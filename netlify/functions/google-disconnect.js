// Funzione Netlify (runtime Node 22, vedi netlify.toml)
//
// Pulsante "Scollega" di Google Calendar. Passaggi, in quest'ordine:
//   1. Google: revoca dell'accesso concesso a FitFlow, così FitFlow sparisce
//      anche dall'elenco delle app collegate nell'account Google del trainer
//   2. database: il token salvato viene svuotato
// La revoca viene prima: finché il token è ancora salvato, una richiesta
// interrotta a metà si può ripetere. Se la revoca non riesce si scollega lo
// stesso e l'app avvisa l'utente, che può togliere l'accesso da sé.
const { json, getBearerToken } = require('./_lib/utils');
const { verifyUser, getGoogleConnection, patchGoogleConnection } = require('./_lib/supabase');
const { decryptRefreshToken, revokeGoogleToken } = require('./_lib/google-calendar');

// Stesso schema di revokeGoogleAccess in delete-account.js:
// true  = accesso revocato
// false = revoca non riuscita: lo scollegamento prosegue e l'app avvisa l'utente
// null  = Google non era collegato (nessun token salvato)
async function revokeGoogleAccess(connection) {
  if (!connection?.refresh_token_enc) return null;
  try {
    const refreshToken = decryptRefreshToken(connection);
    if (!refreshToken) return false;
    await revokeGoogleToken(refreshToken);
    return true;
  } catch (error) {
    // Niente token o dati dell'utente nei log: solo il motivo
    console.error('[google-disconnect] revoca Google non riuscita:', error.message);
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
  try {
    // Un errore del database in lettura ferma tutto: nulla è stato ancora toccato
    const connection = await getGoogleConnection(user.id);
    const googleRevoked = await revokeGoogleAccess(connection);
    await patchGoogleConnection(user.id, {
      is_connected: false,
      refresh_token_enc: null,
      refresh_token_iv: null,
      refresh_token_tag: null
    });
    return json(200, { ok: true, googleRevoked });
  } catch (error) {
    // Il dettaglio resta nei log del server: al browser arriva solo un errore generico
    console.error('[google-disconnect] scollegamento non riuscito:', error.message);
    return json(500, { error: 'Disconnessione Google non riuscita' });
  }
};
