// Funzione Netlify (runtime Node 22, vedi netlify.toml)
//
// Elimina DEFINITIVAMENTE l'account di chi chiama. Non si può annullare.
//
// Passaggi, in quest'ordine:
//   1. Google Calendar: revoca dell'accesso concesso a FitFlow (se collegato)
//   2. righe dell'utente nelle tabelle di USER_TABLES
//   3. utente di Supabase Auth (email, password, sessioni)
// L'utente di accesso viene tolto per ultimo: se un passaggio non riesce
// l'account esiste ancora e la stessa richiesta si può ripetere.
//
// Chi viene eliminato è SEMPRE l'utente del login verificato: dalla richiesta
// non si legge mai un id. L'email riscritta a mano serve solo da conferma.
const { json, getBearerToken, parseJsonBody } = require('./_lib/utils');
const { verifyUser, getGoogleConnection, isUserId, deleteUserRows, deleteAuthUser } = require('./_lib/supabase');
const { decryptRefreshToken, revokeGoogleToken } = require('./_lib/google-calendar');

// Tabelle con una colonna user_id che contengono dati del trainer.
// Una tabella nuova con dati del trainer va aggiunta a questo elenco.
// Prima i dati dell'app (così i link del portale cliente smettono subito di
// funzionare e nessun cliente può più scrivere), poi i messaggi.
const USER_TABLES = ['google_calendar_connections', 'user_app_state', 'client_messages'];

const normalizeEmail = value => String(value || '').trim().toLowerCase();

// true  = accesso revocato
// false = revoca non riuscita: l'eliminazione prosegue e l'app avvisa l'utente
// null  = Google non era collegato
async function revokeGoogleAccess(userId) {
  // Un errore del database qui ferma tutto: nulla è stato ancora eliminato
  const connection = await getGoogleConnection(userId);
  if (!connection?.refresh_token_enc) return null;
  try {
    const refreshToken = decryptRefreshToken(connection);
    if (!refreshToken) return false;
    await revokeGoogleToken(refreshToken);
    return true;
  } catch (error) {
    console.error('[delete-account] revoca Google non riuscita:', error.message);
    return false;
  }
}

exports.handler = async function handler(event) {
  if (event.httpMethod !== 'POST') return json(405, { error: 'Method not allowed' });

  let user;
  try {
    user = await verifyUser(getBearerToken(event));
  } catch (error) {
    return json(401, { error: 'Unauthorized' });
  }

  // Conferma: l'email riscritta a mano deve essere quella dell'account che ha fatto login
  const body = parseJsonBody(event);
  const typedEmail = body && typeof body === 'object' ? body.confirmEmail : '';
  const accountEmail = normalizeEmail(user?.email);
  if (!accountEmail || typeof typedEmail !== 'string' || normalizeEmail(typedEmail) !== accountEmail) {
    return json(400, { error: 'Conferma non valida' });
  }

  let step = 'controllo';
  try {
    if (!isUserId(user.id)) throw new Error('Id utente non valido');
    step = 'google';
    const googleRevoked = await revokeGoogleAccess(user.id);
    for (const table of USER_TABLES) {
      step = table;
      await deleteUserRows(table, user.id);
    }
    step = 'auth';
    await deleteAuthUser(user.id);
    return json(200, { ok: true, googleRevoked });
  } catch (error) {
    // Niente dati dell'utente nei log e niente dettagli nella risposta:
    // solo il passaggio in cui ci si è fermati
    console.error(`[delete-account] passaggio "${step}" non riuscito:`, error.message);
    return json(500, { error: 'Eliminazione account non completata' });
  }
};
