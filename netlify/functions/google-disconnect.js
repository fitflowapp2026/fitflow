const { json, getBearerToken } = require('./_lib/utils');
const { verifyUser, patchGoogleConnection } = require('./_lib/supabase');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    await patchGoogleConnection(user.id, {
      is_connected: false,
      refresh_token_enc: null,
      refresh_token_iv: null,
      refresh_token_tag: null
    });
    return json(200, { ok: true });
  } catch (error) {
    console.error(error);
    return json(401, { error: error.message || 'Unauthorized' });
  }
};
