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
  for (const name of ['google-sync.js', 'google-replay-sync.js', 'google-availability.js', 'google-disconnect.js', 'google-auth-start.js']) {
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

  console.error = quiet;
  console.log('OK — tutte le funzioni Netlify rispondono come previsto (' + calls.length + ' chiamate finte)');
})().catch(e => { console.error = quiet; console.error('FALLITO:', e); process.exit(1); });
