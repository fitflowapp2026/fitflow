const { getBearerToken, json, parseJsonBody } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');
const { getReadyConnection, upsertOneLesson } = require('./_lib/google-lessons');

const MAX_LESSONS_PER_CALL = 50;
const PARALLEL = 4;

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
    // L'app invia le lezioni a blocchi: un limite evita richieste che non finirebbero in tempo
    const lessons = (Array.isArray(body.lessons) ? body.lessons : []).slice(0, MAX_LESSONS_PER_CALL);
    const mappings = new Array(lessons.length);
    let next = 0;
    let failed = 0;
    // Poche lezioni alla volta in parallelo: più veloce, senza superare i limiti di Google
    async function worker() {
      while (next < lessons.length) {
        const index = next++;
        try {
          mappings[index] = await upsertOneLesson(ready, lessons[index]);
        } catch (error) {
          failed++;
          console.error('[google-replay-sync] lezione non sincronizzata:', error.message);
          mappings[index] = { id: lessons[index]?.id || '', error: true };
        }
      }
    }
    await Promise.all(Array.from({ length: Math.min(PARALLEL, lessons.length) }, worker));
    return json(200, { synced: lessons.length - failed, failed, mappings, calendarName: ready.calendarName });
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || 'Google replay sync failed' });
  }
};
