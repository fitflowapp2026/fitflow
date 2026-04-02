const { json, getBearerToken } = require('./_lib/utils');
const { verifyUser, getGoogleConnection } = require('./_lib/supabase');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    const connection = await getGoogleConnection(user.id);
    return json(200, {
      connected: Boolean(connection?.is_connected && connection?.calendar_id && connection?.refresh_token_enc),
      calendarId: connection?.calendar_id || '',
      calendarName: connection?.calendar_name || 'FitFlow Clienti',
      googleEmail: connection?.google_email || ''
    });
  } catch (error) {
    console.error(error);
    return json(401, { error: error.message || 'Unauthorized' });
  }
};
