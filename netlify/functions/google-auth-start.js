const { json, getBearerToken, normalizeReturnTo } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');
const { buildAuthUrl } = require('./_lib/google-calendar');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    const body = event.body ? JSON.parse(event.body) : {};
    const returnTo = normalizeReturnTo(body.returnTo, event);
    const url = buildAuthUrl({ uid: user.id, returnTo });
    return json(200, { url });
  } catch (error) {
    console.error(error);
    return json(401, { error: error.message || 'Unauthorized' });
  }
};
