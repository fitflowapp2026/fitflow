const { getBearerToken, json, parseJsonBody } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');
const { getReadyConnection, upsertOneLesson, deleteOneLesson } = require('./_lib/google-lessons');

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
    if (!ready) return json(200, { skipped: true, reason: 'google_not_connected' });
    const body = parseJsonBody(event);
    const action = body.action || 'upsert';
    const lesson = body.lesson || null;
    if (!lesson) return json(400, { error: 'Lesson mancante' });
    if (action === 'delete') {
      const result = await deleteOneLesson(ready, lesson);
      return json(200, result);
    }
    const result = await upsertOneLesson(ready, lesson);
    return json(200, result);
  } catch (error) {
    console.error(error);
    return json(500, { error: error.message || 'Google sync failed' });
  }
};
