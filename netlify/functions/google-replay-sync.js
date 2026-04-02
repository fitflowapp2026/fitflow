const { getBearerToken, json, parseJsonBody } = require('./_lib/utils');
const { verifyUser, getGoogleConnection, upsertGoogleConnection } = require('./_lib/supabase');
const { decryptRefreshToken, refreshGoogleAccessToken, ensureCalendar, insertEvent, updateEvent, deleteEvent } = require('./_lib/google-calendar');

async function getReadyConnection(userId) {
  const connection = await getGoogleConnection(userId);
  if (!connection?.is_connected || !connection?.refresh_token_enc) return null;
  const refreshToken = decryptRefreshToken(connection);
  if (!refreshToken) return null;
  const accessToken = await refreshGoogleAccessToken(refreshToken);
  const calendar = await ensureCalendar(accessToken, connection, userId);
  if (calendar.id !== connection.calendar_id || calendar.summary !== connection.calendar_name) {
    await upsertGoogleConnection({
      user_id: userId,
      calendar_id: calendar.id,
      calendar_name: calendar.summary || 'FitFlow Clienti',
      is_connected: true,
      connected_at: connection.connected_at || new Date().toISOString()
    });
  }
  return { accessToken, calendarId: calendar.id, calendarName: calendar.summary || 'FitFlow Clienti' };
}

async function upsertOneLesson(ready, lesson) {
  if (!lesson?.id || !lesson?.date || !lesson?.time) throw new Error('Lesson payload incompleto');
  if (lesson.googleEventId) {
    try {
      const updated = await updateEvent(ready.accessToken, ready.calendarId, lesson.googleEventId, lesson);
      return { id: lesson.id, googleEventId: updated.id, calendarName: ready.calendarName };
    } catch (error) {
      if (error.status !== 404 && error.status !== 410) throw error;
    }
  }
  const inserted = await insertEvent(ready.accessToken, ready.calendarId, lesson);
  return { id: lesson.id, googleEventId: inserted.id, calendarName: ready.calendarName };
}

async function deleteOneLesson(ready, lesson) {
  if (!lesson?.googleEventId) return { id: lesson?.id || '', deleted: false, calendarName: ready.calendarName };
  await deleteEvent(ready.accessToken, ready.calendarId, lesson.googleEventId);
  return { id: lesson.id, deleted: true, calendarName: ready.calendarName };
}
exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    const ready = await getReadyConnection(user.id);
    if (!ready) return json(200, { skipped: true, reason: 'google_not_connected', synced: 0, mappings: [] });
    const body = parseJsonBody(event);
    const lessons = Array.isArray(body.lessons) ? body.lessons : [];
    const mappings = [];
    for (const lesson of lessons) {
      mappings.push(await upsertOneLesson(ready, lesson));
    }
    return json(200, { synced: mappings.length, mappings, calendarName: ready.calendarName });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || 'Google replay sync failed' });
  }
};
