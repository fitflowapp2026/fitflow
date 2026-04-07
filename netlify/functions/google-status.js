const { json, getBearerToken } = require('./_lib/utils');
const { verifyUser, getGoogleConnection } = require('./_lib/supabase');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    console.log('[google-status] user.id:', user.id);
    const connection = await getGoogleConnection(user.id);
    console.log('[google-status] connection:', JSON.stringify({
      exists: Boolean(connection),
      is_connected: connection?.is_connected,
      has_calendar: Boolean(connection?.calendar_id),
      has_token: Boolean(connection?.refresh_token_enc),
      token_length: connection?.refresh_token_enc?.length
    }));
    return json(200, {
      connected: Boolean(connection?.is_connected && connection?.calendar_id && connection?.refresh_token_enc),
      calendarId: connection?.calendar_id || '',
      calendarName: connection?.calendar_name || 'FitFlow Clienti',
      googleEmail: connection?.google_email || ''
    });
  } catch (error) {
    console.error('[google-status] error:', error.message);
    return json(401, { error: error.message || 'Unauthorized' });
  }
};
