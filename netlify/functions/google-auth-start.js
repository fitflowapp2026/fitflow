const { json, getBearerToken, normalizeReturnTo } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');
const { buildAuthUrl } = require('./_lib/google-calendar');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  let user;
  try {
    user = await verifyUser(getBearerToken(event));
  } catch (error) {
    return json(401, { error: 'Unauthorized' });
  }
  try {
    const body = event.body ? JSON.parse(event.body) : {};
    const returnTo = normalizeReturnTo(body.returnTo, event);
    const url = buildAuthUrl({ uid: user.id, returnTo });
    return json(200, { url });
  } catch (error) {
    console.error(error);
    return json(500, { error: 'Collegamento Google non disponibile' });
  }
};
