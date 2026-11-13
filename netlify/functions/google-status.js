// Funzione Netlify (runtime Node 22, vedi netlify.toml)
const { json, getBearerToken } = require('./_lib/utils');
const { verifyUser, getGoogleConnection } = require('./_lib/supabase');

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'GET') return json(405, { error: 'Method not allowed' });

  let user;
  try {
    user = await verifyUser(getBearerToken(event));
  } catch (error) {
    return json(401, { error: 'Unauthorized' });
  }

  try {
    const connection = await getGoogleConnection(user.id);
    return json(200, {
      connected: Boolean(connection?.is_connected && connection?.calendar_id && connection?.refresh_token_enc),
      calendarId: connection?.calendar_id || '',
      calendarName: connection?.calendar_name || 'FitFlow Clienti',
      googleEmail: connection?.google_email || ''
    });
  } catch (error) {
    // Niente dati utente o token nei log: solo il messaggio dell'errore
    console.error('[google-status] error:', error.message);
    return json(500, { error: 'Stato Google non disponibile' });
  }
};
