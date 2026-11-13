// Prova le funzioni Netlify con Supabase e Google finti (nessuna chiamata reale).
// uso: node tests/funzioni-netlify.test.js
const path = require('path');
const assert = require('assert');
const root = process.argv[2] || path.join(__dirname, '..');
const fn = name => require(path.join(root, 'netlify/functions', name));

process.env.SUPABASE_URL = 'https://db.test';
process.env.SUPABASE_SERVICE_ROLE_KEY = 'service-key';
process.env.GOOGLE_CLIENT_ID = 'cid';
process.env.GOOGLE_CLIENT_SECRET = 'csecret';
process.env.GOOGLE_REDIRECT_URI = 'https://site.test/cb';
process.env.GOOGLE_TOKEN_ENCRYPTION_KEY = 'enc-key';
process.env.GOOGLE_OAUTH_STATE_SECRET = 'state-secret';

const { encryptRefreshToken } = fn('_lib/google-calendar.js');
const connection = {
  user_id: 'u1', is_connected: true, calendar_id: 'cal1', calendar_name: 'FitFlow Clienti',
  google_email: 'x@test', ...encryptRefreshToken('refresh-1')
};

const calls = [];
let connected = true;
const res = (status, body) => ({
  ok: status >= 200 && status < 300, status,
  text: async () => (body === null ? '' : JSON.stringify(body)),
  json: async () => body
});
global.fetch = async (url, opts = {}) => {
  const method = opts.method || 'GET';
  calls.push(`${method} ${String(url).split('?')[0]}`);
  url = String(url);
  if (url.startsWith('https://db.test/auth/v1/user')) {
    return opts.headers.Authorization === 'Bearer good' ? res(200, { id: 'u1', email: 'x@test' }) : res(401, { msg: 'bad jwt SEGRETO' });
  }
  if (url.startsWith('https://db.test/rest/v1/google_calendar_connections')) {
    if (method === 'GET') return res(200, connected ? [connection] : []);
    return res(200, [connection]);
  }
  if (url.startsWith('https://oauth2.googleapis.com/token')) return res(200, { access_token: 'at' });
  if (url.endsWith('/calendars/cal1')) return res(200, { id: 'cal1', summary: 'FitFlow Clienti' });
  if (url.includes('/events/gone') && method === 'PUT') return res(404, { error: { message: 'not found' } });
  if (url.includes('/events/') && method === 'PUT') return res(200, { id: 'ev1' });
  if (url.includes('/events/') && method === 'DELETE') return res(204, null);
  if (url.includes('/events') && method === 'POST') return res(200, { id: 'evNew' });
  if (url.includes('/users/me/calendarList')) return res(200, { items: [{ id: 'cal1' }, { id: 'work', summary: 'Lavoro' }, { id: 'h', hidden: true }] });
  if (url.endsWith('/freeBusy')) return res(200, { calendars: { work: { busy: [{ start: 'a', end: 'b' }] } } });
  throw new Error('fetch non previsto: ' + method + ' ' + url);
};

const ev = (method, body, token = 'good') => ({
  httpMethod: method, headers: { authorization: `Bearer ${token}`, host: 'site.test' },
  body: body ? JSON.stringify(body) : null, queryStringParameters: {}
});
const lesson = { id: 'l1', date: '2026-05-01', time: '10:00', duration: 60, clientName: 'Mario' };
const quiet = console.error; console.error = () => {};

(async () => {
  const sync = fn('google-sync.js').handler;
  let r = await sync(ev('POST', { lesson }));
  assert.deepStrictEqual(JSON.parse(r.body), { id: 'l1', googleEventId: 'evNew', calendarName: 'FitFlow Clienti' });
  r = await sync(ev('POST', { lesson: { ...lesson, googleEventId: 'ev1' } }));
  assert.strictEqual(JSON.parse(r.body).googleEventId, 'ev1');
  r = await sync(ev('POST', { lesson: { ...lesson, googleEventId: 'gone' } }));
  assert.strictEqual(JSON.parse(r.body).googleEventId, 'evNew', 'evento sparito → ricreato');
  r = await sync(ev('POST', { action: 'delete', lesson: { ...lesson, googleEventId: 'ev1' } }));
  assert.deepStrictEqual(JSON.parse(r.body), { id: 'l1', deleted: true, calendarName: 'FitFlow Clienti' });
  r = await sync(ev('POST', {}));
  assert.strictEqual(r.statusCode, 400);
  r = await sync(ev('GET'));
  assert.strictEqual(r.statusCode, 405);
  r = await sync(ev('POST', { lesson }, 'bad'));
  assert.strictEqual(r.statusCode, 401, 'senza login: non autorizzato, non errore del server');
  for (const name of ['google-sync.js', 'google-replay-sync.js', 'google-availability.js', 'google-disconnect.js', 'google-auth-start.js', 'delete-account.js']) {
    const res = await fn(name).handler(ev('POST', {}, 'bad'));
    assert.strictEqual(res.statusCode, 401, name + ' senza login');
    assert.deepStrictEqual(JSON.parse(res.body), { error: 'Unauthorized' }, name + ': nessun dettaglio interno');
  }
  assert.ok(!r.body.includes('SEGRETO'), 'nessun dettaglio interno nella risposta');

  const replay = fn('google-replay-sync.js').handler;
  r = await replay(ev('POST', { lessons: [lesson, { ...lesson, id: 'l2', googleEventId: 'ev1' }] }));
  let b = JSON.parse(r.body);
  assert.strictEqual(b.synced, 2);
  assert.deepStrictEqual(b.mappings.map(m => m.googleEventId), ['evNew', 'ev1']);
  r = await replay(ev('POST', { lessons: [lesson, { id: 'rotta' }, { ...lesson, id: 'l3' }] }));
  b = JSON.parse(r.body);
  assert.strictEqual(r.statusCode, 200, 'una lezione incompleta non fa fallire tutto il blocco');
  assert.strictEqual(b.synced, 2);
  assert.strictEqual(b.failed, 1);
  assert.deepStrictEqual(b.mappings.map(m => m.id), ['l1', 'rotta', 'l3'], 'risposte nello stesso ordine delle lezioni inviate');

  const avail = fn('google-availability.js').handler;
  r = await avail(ev('POST', { start: 's', end: 'e' }));
  b = JSON.parse(r.body);
  assert.deepStrictEqual(b.busy, [{ calendarId: 'work', summary: 'Lavoro', start: 'a', end: 'b' }]);
  assert.deepStrictEqual(b.blockers.map(x => x.id), ['work', 'h'].filter(x => x !== 'h'));
  r = await avail(ev('POST', {}));
  assert.strictEqual(r.statusCode, 400);

  const status = fn('google-status.js').handler;
  r = await status(ev('GET'));
  assert.deepStrictEqual(JSON.parse(r.body), { connected: true, calendarId: 'cal1', calendarName: 'FitFlow Clienti', googleEmail: 'x@test' });
  r = await status(ev('GET', null, 'bad'));
  assert.strictEqual(r.statusCode, 401);
  assert.ok(!r.body.includes('SEGRETO'));

  connected = false;
  r = await sync(ev('POST', { lesson }));
  assert.deepStrictEqual(JSON.parse(r.body), { skipped: true, reason: 'google_not_connected' });
  r = await replay(ev('POST', { lessons: [lesson] }));
  assert.strictEqual(JSON.parse(r.body).skipped, true);
  r = await avail(ev('POST', { start: 's', end: 'e' }));
  assert.deepStrictEqual(JSON.parse(r.body), { busy: [] });
  r = await status(ev('GET'));
  assert.strictEqual(JSON.parse(r.body).connected, false);

  const start = fn('google-auth-start.js').handler;
  r = await start(ev('POST', { returnTo: 'https://evil.test/x' }));
  assert.strictEqual(r.statusCode, 200);
  const state = new URL(JSON.parse(r.body).url).searchParams.get('state');
  const payload = JSON.parse(Buffer.from(state.split('.')[0], 'base64url').toString());
  assert.strictEqual(payload.returnTo, 'https://site.test', 'returnTo esterno rifiutato');

  // ── Eliminazione dell'account ──────────────────────────────────────
  // Database finto con due trainer (Anna e Bruno): chi chiama elimina solo se stesso.
  {
    const A = '11111111-1111-4111-8111-111111111111';
    const B = '22222222-2222-4222-8222-222222222222';
    const tokens = { 'token-anna': A, 'token-bruno': B, 'token-strano': 'u1' };
    let db, revoked, log;
    let failOn = '';          // nome del passaggio che deve rispondere con un errore
    let googleAnswer = 'ok';  // 'ok' | 'gia-revocato' | 'errore'
    const reset = () => {
      db = {
        users: new Map([[A, 'anna@test'], [B, 'bruno@test'], ['u1', 'x@test']]),
        user_app_state: [{ user_id: A, app_data: { clients: [1, 2] } }, { user_id: B, app_data: { clients: [3] } }],
        client_messages: [{ id: 'm1', user_id: A }, { id: 'm2', user_id: A }, { id: 'm3', user_id: B }],
        google_calendar_connections: [
          { user_id: A, is_connected: true, calendar_id: 'calA', ...encryptRefreshToken('refresh-anna') },
          { user_id: B, is_connected: true, calendar_id: 'calB', ...encryptRefreshToken('refresh-bruno') }
        ]
      };
      revoked = [];
      log = [];
      failOn = '';
      googleAnswer = 'ok';
    };
    const rowsOf = id => ['user_app_state', 'client_messages', 'google_calendar_connections'].map(t => db[t].filter(r => r.user_id === id).length);
    const brunoIntatto = () => {
      assert.deepStrictEqual(rowsOf(B), [1, 1, 1], 'i dati di un altro trainer non si toccano');
      assert.ok(db.users.has(B), "l'account di un altro trainer non si tocca");
    };
    const nessunaEliminazione = () => {
      assert.deepStrictEqual(rowsOf(A), [1, 2, 1]);
      assert.ok(db.users.has(A));
      assert.ok(!log.some(line => line.startsWith('DELETE')), 'nessuna richiesta di eliminazione partita');
      assert.deepStrictEqual(revoked, [], 'nessuna revoca Google partita');
      brunoIntatto();
    };

    const previousFetch = global.fetch;
    global.fetch = async (url, opts = {}) => {
      const method = opts.method || 'GET';
      const u = new URL(String(url));
      calls.push(`${method} ${u.origin}${u.pathname}`);
      log.push(`${method} ${u.pathname}${u.search}`);
      const headers = opts.headers || {};
      if (u.pathname === '/auth/v1/user') {
        const id = tokens[String(headers.Authorization || '').replace('Bearer ', '')];
        return id && db.users.has(id) ? res(200, { id, email: db.users.get(id) }) : res(401, { msg: 'bad jwt SEGRETO' });
      }
      if (u.origin === 'https://oauth2.googleapis.com' && u.pathname === '/revoke') {
        assert.strictEqual(method, 'POST');
        if (googleAnswer === 'errore') return res(503, { error: 'backend_error SEGRETO' });
        if (googleAnswer === 'gia-revocato') return res(400, { error: 'invalid_token' });
        revoked.push(new URLSearchParams(String(opts.body)).get('token'));
        return res(200, {});
      }
      // Da qui in poi tutto deve arrivare con la chiave di servizio
      assert.strictEqual(headers.apikey, 'service-key', 'chiave di servizio mancante: ' + method + ' ' + u.pathname);
      assert.strictEqual(headers.Authorization, 'Bearer service-key');
      if (u.pathname.startsWith('/rest/v1/')) {
        const table = u.pathname.slice('/rest/v1/'.length);
        assert.ok(Array.isArray(db[table]), 'tabella non prevista: ' + table);
        // Come nel database vero: una richiesta senza filtro riguarda TUTTE le righe
        const filter = u.searchParams.get('user_id');
        const match = row => filter === null || filter === `eq.${row.user_id}`;
        if (method === 'GET') return failOn === 'lettura' ? res(500, { message: 'SEGRETO' }) : res(200, db[table].filter(match));
        if (method === 'DELETE') {
          if (failOn === table) return res(500, { message: 'permission denied SEGRETO' });
          db[table] = db[table].filter(row => !match(row));
          return res(204, null);
        }
      }
      const admin = u.pathname.match(/^\/auth\/v1\/admin\/users\/([^/]+)$/);
      if (admin && method === 'DELETE') {
        if (failOn === 'auth') return res(500, { msg: 'SEGRETO' });
        return db.users.delete(admin[1]) ? res(200, {}) : res(404, { msg: 'User not found' });
      }
      throw new Error('fetch non previsto: ' + method + ' ' + url);
    };

    const del = fn('delete-account.js').handler;
    const conferma = { confirmEmail: 'anna@test' };

    // Senza login (token sbagliato o assente): 401 e nulla viene toccato
    reset();
    r = await del(ev('POST', conferma, 'bad'));
    assert.strictEqual(r.statusCode, 401);
    assert.deepStrictEqual(JSON.parse(r.body), { error: 'Unauthorized' });
    r = await del({ httpMethod: 'POST', headers: { host: 'site.test' }, body: JSON.stringify(conferma) });
    assert.strictEqual(r.statusCode, 401, 'senza intestazione di login');
    nessunaEliminazione();

    // Solo POST
    for (const method of ['GET', 'DELETE', 'PUT']) {
      r = await del(ev(method, conferma, 'token-anna'));
      assert.strictEqual(r.statusCode, 405, method + ' non ammesso');
    }
    nessunaEliminazione();

    // Senza la conferma (email riscritta) non si elimina nulla
    for (const body of [null, {}, { confirmEmail: '' }, { confirmEmail: 'bruno@test' }, { confirmEmail: 'anna@test.it' }, { userId: B }]) {
      r = await del(ev('POST', body, 'token-anna'));
      assert.strictEqual(r.statusCode, 400, 'conferma non valida: ' + JSON.stringify(body));
    }
    // Anche una richiesta scritta male (non un oggetto, email non testuale) viene solo rifiutata
    for (const raw of ['null', '[]', '"anna@test"', '42', '{"confirmEmail":["anna@test"]}', '{"confirmEmail":{"a":1}}', 'non è json']) {
      r = await del({ ...ev('POST', null, 'token-anna'), body: raw });
      assert.strictEqual(r.statusCode, 400, 'richiesta scritta male: ' + raw);
      assert.deepStrictEqual(JSON.parse(r.body), { error: 'Conferma non valida' });
    }
    nessunaEliminazione();

    // Un id utente che non è un UUID non fa partire nessuna eliminazione
    r = await del(ev('POST', { confirmEmail: 'x@test' }, 'token-strano'));
    assert.strictEqual(r.statusCode, 500);
    nessunaEliminazione();

    // Il database non risponde già alla prima lettura: ci si ferma prima di toccare qualcosa
    failOn = 'lettura';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.strictEqual(r.statusCode, 500);
    assert.ok(!r.body.includes('SEGRETO'));
    nessunaEliminazione();

    // Eliminazione riuscita: spariscono solo i dati e l'account di chi chiama
    reset();
    r = await del(ev('POST', { confirmEmail: '  Anna@Test ' }, 'token-anna'));
    assert.strictEqual(r.statusCode, 200);
    assert.deepStrictEqual(JSON.parse(r.body), { ok: true, googleRevoked: true });
    assert.deepStrictEqual(rowsOf(A), [0, 0, 0], 'dati, messaggi e collegamento Google eliminati');
    assert.ok(!db.users.has(A), 'utente di accesso eliminato');
    brunoIntatto();
    assert.deepStrictEqual(revoked, ['refresh-anna'], 'revocato il token Google di chi chiama, non quello di un altro');
    const deletes = log.filter(line => line.startsWith('DELETE'));
    assert.deepStrictEqual(deletes, [
      `DELETE /rest/v1/google_calendar_connections?user_id=eq.${A}`,
      `DELETE /rest/v1/user_app_state?user_id=eq.${A}`,
      `DELETE /rest/v1/client_messages?user_id=eq.${A}`,
      `DELETE /auth/v1/admin/users/${A}`
    ], "ogni eliminazione è filtrata sull'utente; l'account di accesso per ultimo");
    assert.ok(log.indexOf('POST /revoke') < log.indexOf(deletes[0]), 'la revoca Google avviene prima di eliminare il token salvato');
    // A eliminazione avvenuta il vecchio login non vale più
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.strictEqual(r.statusCode, 401);

    // Un id scritto nella richiesta viene ignorato: vale solo chi ha fatto login
    reset();
    r = await del(ev('POST', { confirmEmail: 'bruno@test', userId: A, user_id: A, id: A }, 'token-bruno'));
    assert.strictEqual(r.statusCode, 200);
    assert.deepStrictEqual(rowsOf(B), [0, 0, 0]);
    assert.ok(!db.users.has(B));
    assert.deepStrictEqual(rowsOf(A), [1, 2, 1], "i dati dell'utente indicato nella richiesta restano intatti");
    assert.ok(db.users.has(A), "l'account indicato nella richiesta resta intatto");
    assert.deepStrictEqual(revoked, ['refresh-bruno']);

    // Google non collegato: nessuna revoca, eliminazione normale
    reset();
    db.google_calendar_connections = db.google_calendar_connections.filter(row => row.user_id !== A);
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.deepStrictEqual(JSON.parse(r.body), { ok: true, googleRevoked: null });
    assert.deepStrictEqual(revoked, []);
    assert.ok(!db.users.has(A));
    brunoIntatto();

    // Google non risponde: l'account viene eliminato lo stesso e l'app può avvisare
    reset();
    googleAnswer = 'errore';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.deepStrictEqual(JSON.parse(r.body), { ok: true, googleRevoked: false });
    assert.deepStrictEqual(rowsOf(A), [0, 0, 0]);
    assert.ok(!db.users.has(A));
    // Accesso già revocato dal lato di Google: va bene così
    reset();
    googleAnswer = 'gia-revocato';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.deepStrictEqual(JSON.parse(r.body), { ok: true, googleRevoked: true });

    // Un errore a metà viene segnalato, senza dettagli interni, e l'account resta
    // (così la richiesta si può ripetere)
    reset();
    failOn = 'client_messages';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.strictEqual(r.statusCode, 500, 'errore a metà: segnalato');
    assert.deepStrictEqual(JSON.parse(r.body), { error: 'Eliminazione account non completata' });
    assert.ok(!r.body.includes('SEGRETO') && !r.body.includes('client_messages'), 'nessun dettaglio interno nella risposta');
    assert.ok(db.users.has(A), "dopo un errore a metà l'utente di accesso esiste ancora");
    assert.ok(!log.some(line => line.startsWith('DELETE /auth/')), "l'utente di accesso non viene toccato se un passaggio prima è fallito");
    assert.deepStrictEqual(rowsOf(A), [0, 2, 0], 'i messaggi non eliminati sono ancora lì');
    brunoIntatto();
    failOn = '';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.strictEqual(r.statusCode, 200, 'ripetendo la richiesta si completa');
    assert.deepStrictEqual(rowsOf(A), [0, 0, 0]);
    assert.ok(!db.users.has(A));
    brunoIntatto();

    // Errore proprio all'ultimo passaggio (utente di accesso): segnalato anche questo
    reset();
    failOn = 'auth';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.strictEqual(r.statusCode, 500);
    assert.ok(!r.body.includes('SEGRETO'));
    assert.ok(db.users.has(A));
    failOn = '';
    r = await del(ev('POST', conferma, 'token-anna'));
    assert.strictEqual(r.statusCode, 200);
    assert.ok(!db.users.has(A));
    brunoIntatto();

    global.fetch = previousFetch;
  }

  console.error = quiet;
  console.log('OK — tutte le funzioni Netlify rispondono come previsto (' + calls.length + ' chiamate finte)');
})().catch(e => { console.error = quiet; console.error('FALLITO:', e); process.exit(1); });
