const { getBearerToken, json, parseJsonBody } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');
const { getReadyConnection, upsertOneLesson } = require('./_lib/google-lessons');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  let user;
  try {
    user = await verifyUser(getBearerToken(event));
  } catch (error) {
    return json(401, { error: 'Unauthorized' });
  }
  try {
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
