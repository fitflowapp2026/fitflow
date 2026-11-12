
const { getBearerToken, json, parseJsonBody } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');
const { listCalendars, queryFreeBusy } = require('./_lib/google-calendar');
const { getReadyConnection } = require('./_lib/google-lessons');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    const ready = await getReadyConnection(user.id);
    if (!ready) return json(200, { busy: [] });
    const body = parseJsonBody(event);
    const timeMin = body.start;
    const timeMax = body.end;
    if (!timeMin || !timeMax) return json(400, { error: 'Intervallo mancante' });

    const calendars = await listCalendars(ready.accessToken);
    const blockers = calendars.filter(item => {
      if (!item?.id || item.id === ready.calendarId) return false;
      if (item.hidden) return false;
      if (item.deleted) return false;
      return true;
    });
    const freeBusy = await queryFreeBusy(ready.accessToken, timeMin, timeMax, blockers.map(item => item.id));
    const busy = [];
    blockers.forEach(item => {
      const ranges = freeBusy?.[item.id]?.busy || [];
      ranges.forEach(range => busy.push({ calendarId: item.id, summary: item.summary || 'Occupato', start: range.start, end: range.end }));
    });
    return json(200, { busy, blockers: blockers.map(item => ({ id: item.id, summary: item.summary || item.id })) });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || 'Google availability failed' });
  }
};
