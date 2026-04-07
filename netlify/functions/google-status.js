const { json, getBearerToken, getEnv } = require('./_lib/utils');
const { verifyUser } = require('./_lib/supabase');

async function rawGetGoogleConnection(userId) {
  const base = getEnv('SUPABASE_URL').replace(/\/$/, '');
  const key = getEnv('SUPABASE_SERVICE_ROLE_KEY');
  const url = `${base}/rest/v1/google_calendar_connections?user_id=eq.${encodeURIComponent(userId)}&select=*`;
  console.log('[google-status] query url:', url);
  const response = await fetch(url, {
    method: 'GET',
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json'
    }
  });
  const text = await response.text();
  console.log('[google-status] raw status:', response.status);
  console.log('[google-status] raw body:', text);
  const rows = text ? JSON.parse(text) : [];
  return Array.isArray(rows) && rows[0] ? rows[0] : null;
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });
  try {
    const accessToken = getBearerToken(event);
    const user = await verifyUser(accessToken);
    console.log('[google-status] user.id:', JSON.stringify(user.id));
    console.log('[google-status] user.id length:', user.id?.length);
    console.log('[google-status] user.email:', user.email);

    const connection = await rawGetGoogleConnection(user.id);

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
