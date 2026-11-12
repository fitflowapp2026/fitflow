// Esegue la VERA funzione client-portal con un Supabase finto (niente rete).
// uso: node tests/portale-cliente.test.mjs   (serve Node 22.18 o successivo)
import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert';
import os from 'node:os';
import { fileURLToPath, pathToFileURL } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = process.argv[2] || path.join(here, '..');
let src = fs.readFileSync(path.join(root, 'supabase/functions/client-portal/index.ts'), 'utf8');
const importLine = "import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'";
assert.ok(src.includes(importLine), 'riga di import non trovata');
src = src.replace(importLine, 'const createClient = (globalThis as any).__createClient');
// copia temporanea fuori dal progetto, con l'import del client Supabase sostituito da quello finto
const copy = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'portale-')), 'index.ts');
fs.writeFileSync(copy, src);

// ── Supabase finto ────────────────────────────────────────────────────
const db = { states: [], messages: [], containsBroken: false, scans: 0, lookups: 0 };
const contains = (data, pattern) => {
  if (Array.isArray(pattern)) return Array.isArray(data) && pattern.every(p => data.some(d => contains(d, p)));
  if (pattern && typeof pattern === 'object') return data && typeof data === 'object' && Object.keys(pattern).every(k => contains(data[k], pattern[k]));
  return data === pattern;
};
class Q {
  constructor(table) { this.table = table; this.op = 'select'; this.f = []; }
  select(cols, opts) { this.cols = cols; this.opts = opts || {}; return this; }
  insert(row) { this.op = 'insert'; this.row = row; return this; }
  update(row) { this.op = 'update'; this.row = row; return this; }
  eq(c, v) { this.f.push(r => r[c] === v); return this; }
  is(c, v) { this.f.push(r => (r[c] ?? null) === v); return this; }
  gte(c, v) { this.f.push(r => r[c] >= v); return this; }
  contains(c, v) { this.containsUsed = true; this.f.push(r => contains(r[c], v)); return this; }
  limit(n) { this.max = n; return this; }
  order() { return this; }
  then(ok, ko) { return Promise.resolve(this.run()).then(ok, ko); }
  run() {
    const rows = this.table === 'user_app_state' ? db.states : db.messages;
    if (this.op === 'insert') { rows.push({ id: 'm' + (rows.length + 1), created_at: new Date().toISOString(), delivered_at: null, ...this.row }); return { error: null }; }
    if (this.table === 'user_app_state') {
      if (this.containsUsed) { db.lookups++; if (db.containsBroken) return { data: null, error: { message: 'operator does not exist: json @> unknown' } }; }
      else db.scans++;
    }
    let hit = rows.filter(r => this.f.every(fn => fn(r)));
    if (this.op === 'update') { hit.forEach(r => Object.assign(r, this.row)); return { error: null }; }
    if (this.opts?.head) return { count: hit.length, error: null };
    if (this.max) hit = hit.slice(0, this.max);
    return { data: JSON.parse(JSON.stringify(hit)), error: null };
  }
}
globalThis.__createClient = (url, key) => { assert.strictEqual(key, 'service-key'); return { from: t => new Q(t) }; };
globalThis.Deno = { env: { get: k => ({ SUPABASE_URL: 'https://db.test', SUPABASE_SERVICE_ROLE_KEY: 'service-key' })[k] }, serve: fn => { globalThis.__handler = fn; } };
await import(pathToFileURL(copy).href);
const call = async (body, method = 'POST') => {
  const res = await globalThis.__handler(new Request('https://fn.test/client-portal', { method, body: method === 'POST' ? (typeof body === 'string' ? body : JSON.stringify(body)) : undefined }));
  let data = null; const text = await res.text(); try { data = JSON.parse(text); } catch { data = text; }
  return { status: res.status, data };
};

// ── Dati: due trainer, tre clienti ────────────────────────────────────
const TOKEN_A = 'aaaaaaaaaaaaaaaaaaaaaaaa', TOKEN_B = 'bbbbbbbbbbbbbbbbbbbbbbbb', TOKEN_C = 'cccccccccccccccccccccccc';
db.states.push({
  user_id: 'trainer1',
  app_data: {
    clients: [
      { id: 'cA', name: 'Anna Rossi', firstName: 'Anna', lastName: 'Rossi', email: 'anna@example.com', phone: '333-SEGRETO', notes: 'NOTA PRIVATA', shareToken: TOKEN_A, activePlanId: 'pA' },
      { id: 'cB', name: 'Bruno Verdi', email: 'bruno@example.com', shareToken: TOKEN_B }
    ],
    lessons: [
      { id: 'lA1', clientId: 'cA', date: '2026-12-01', time: '10:00', duration: 60, status: 'scheduled', lessonType: 'personal', note: 'NOTA LEZIONE PRIVATA' },
      { id: 'lB1', clientId: 'cB', date: '2026-12-02', time: '11:00', duration: 60, status: 'scheduled' }
    ],
    plans: [{ id: 'pA', clientId: 'cA', packageId: 'k1', startDate: '2026-11-01', totalPrice: 400, paymentStatus: 'unpaid' }],
    packages: [{ id: 'k1', name: 'Base 12', sessions: 12, duration: 60, perWeek: 2, totalPrice: 400 }]
  }
});
db.states.push({ user_id: 'trainer2', app_data: { clients: [{ id: 'cC', name: 'Carla Neri', shareToken: TOKEN_C }], lessons: [{ id: 'lC1', clientId: 'cC', date: '2026-12-03', time: '09:00' }], plans: [], packages: [] } });

const tests = [];
const test = (t, fn) => tests.push([t, fn]);

test('richieste malformate vengono respinte', async () => {
  assert.strictEqual((await call(null, 'OPTIONS')).status, 200);
  assert.strictEqual((await call('non-json')).status, 400);
  assert.strictEqual((await call({ action: 'get_data' })).status, 404, 'token mancante');
  assert.strictEqual((await call({ token: 'corto', action: 'get_data' })).status, 404);
  assert.strictEqual((await call({ token: { $ne: 1 }, action: 'get_data' })).status, 404, 'token non testuale');
  assert.strictEqual((await call({ token: "x' or '1'='1 aaaaaaaaaaaa", action: 'get_data' })).status, 404);
  assert.strictEqual((await call({ token: 'zzzzzzzzzzzzzzzzzzzzzzzz', action: 'get_data' })).status, 404, 'token inesistente');
  assert.strictEqual(db.scans, 0, 'mai una scansione di tutti i trainer');
});

test('trainer_reply non esiste più', async () => {
  const before = db.messages.length;
  const r = await call({ token: TOKEN_A, action: 'trainer_reply', payload: { text: 'finto trainer' } });
  assert.strictEqual(r.status, 400);
  assert.strictEqual(db.messages.length, before, 'nessun messaggio scritto a nome del trainer');
});

test('get_data restituisce solo i dati di quel cliente, senza campi privati', async () => {
  const r = await call({ token: TOKEN_A, action: 'get_data' });
  assert.strictEqual(r.status, 200);
  assert.deepStrictEqual(r.data.lessons.map(l => l.id), ['lA1']);
  assert.strictEqual(r.data.client.name, 'Anna Rossi');
  assert.deepStrictEqual(r.data.package, { name: 'Base 12', sessions: 12, duration: 60, perWeek: 2 });
  const text = JSON.stringify(r.data);
  ['SEGRETO', 'PRIVATA', 'Bruno', 'Carla', 'lB1', 'lC1', 'shareToken', TOKEN_B, 'paymentStatus'].forEach(x => assert.ok(!text.includes(x), 'trapela: ' + x));
  const c = await call({ token: TOKEN_C, action: 'get_data' });
  assert.deepStrictEqual(c.data.lessons.map(l => l.id), ['lC1'], 'cliente di un altro trainer trovato nella riga giusta');
});

test('messaggi: salvati con cliente e trainer giusti, vuoti o troppo lunghi respinti', async () => {
  assert.strictEqual((await call({ token: TOKEN_A, action: 'send_message', payload: { text: '   ' } })).status, 400);
  assert.strictEqual((await call({ token: TOKEN_A, action: 'send_message', payload: { text: 'x'.repeat(1001) } })).status, 400);
  assert.strictEqual((await call({ token: TOKEN_A, action: 'send_message', payload: { text: { a: 1 } } })).status, 400, 'testo non testuale');
  const r = await call({ token: TOKEN_A, action: 'send_message', payload: { text: ' Ciao! ' } });
  assert.deepStrictEqual(r.data, { ok: true });
  const m = db.messages.at(-1);
  assert.deepStrictEqual([m.client_token, m.user_id, m.client_id, m.sender, m.text, m.type], [TOKEN_A, 'trainer1', 'cA', 'client', 'Ciao!', 'message']);
});

test('disdetta e spostamento: solo per le proprie lezioni', async () => {
  const before = db.messages.length;
  assert.strictEqual((await call({ token: TOKEN_A, action: 'cancel_request', payload: { lessonId: 'lB1', lessonDate: 'x' } })).status, 404, 'lezione di un altro cliente');
  assert.strictEqual((await call({ token: TOKEN_A, action: 'reschedule_request', payload: { lessonId: 'lC1' } })).status, 404, 'lezione di un altro trainer');
  assert.strictEqual((await call({ token: TOKEN_A, action: 'cancel_request', payload: {} })).status, 400);
  assert.strictEqual(db.messages.length, before);
  assert.deepStrictEqual((await call({ token: TOKEN_A, action: 'cancel_request', payload: { lessonId: 'lA1', lessonDate: '1 dic 2026' } })).data, { ok: true });
  assert.deepStrictEqual([db.messages.at(-1).type, db.messages.at(-1).lesson_id, db.messages.at(-1).text], ['cancel_request', 'lA1', 'Richiesta disdetta lezione del 1 dic 2026']);
  await call({ token: TOKEN_A, action: 'reschedule_request', payload: { lessonId: 'lA1', lessonDate: '1 dic', preferredDate: 'Z'.repeat(500) } });
  assert.ok(db.messages.at(-1).text.length < 160, 'i campi liberi vengono accorciati');
});

test('limite di invii per link, senza bloccare gli altri clienti', async () => {
  let last;
  for (let i = 0; i < 10; i++) last = await call({ token: TOKEN_A, action: 'send_message', payload: { text: 'spam ' + i } });
  assert.strictEqual(last.status, 429);
  assert.strictEqual(db.messages.filter(m => m.client_token === TOKEN_A && m.sender === 'client').length, 6, 'al massimo 6 al minuto');
  assert.strictEqual((await call({ token: TOKEN_A, action: 'cancel_request', payload: { lessonId: 'lA1' } })).status, 429);
  assert.strictEqual((await call({ token: TOKEN_A, action: 'get_data' })).status, 200, 'la lettura resta possibile');
  assert.strictEqual((await call({ token: TOKEN_B, action: 'send_message', payload: { text: 'io posso' } })).status, 200);
  db.messages.filter(m => m.client_token === TOKEN_A).forEach(m => { m.created_at = new Date(Date.now() - 120000).toISOString(); });
  assert.strictEqual((await call({ token: TOKEN_A, action: 'send_message', payload: { text: 'dopo un minuto' } })).status, 200);
});

test('lettura e consegna segnano solo i messaggi del trainer di quel link', async () => {
  db.messages.push({ id: 't1', client_token: TOKEN_A, sender: 'trainer', text: 'risposta', read: false, delivered_at: null, created_at: new Date().toISOString() });
  db.messages.push({ id: 't2', client_token: TOKEN_B, sender: 'trainer', text: 'altra', read: false, delivered_at: null, created_at: new Date().toISOString() });
  await call({ token: TOKEN_A, action: 'mark_delivered' });
  assert.ok(db.messages.find(m => m.id === 't1').delivered_at);
  assert.strictEqual(db.messages.find(m => m.id === 't2').delivered_at, null);
  await call({ token: TOKEN_A, action: 'mark_read' });
  assert.strictEqual(db.messages.find(m => m.id === 't1').read, true);
  assert.strictEqual(db.messages.find(m => m.id === 't2').read, false);
});

test('se la ricerca mirata non è disponibile si usa la scansione, con lo stesso risultato', async () => {
  db.containsBroken = true;
  const quiet = console.error; console.error = () => {};
  const r = await call({ token: TOKEN_C, action: 'get_data' });
  console.error = quiet;
  assert.deepStrictEqual(r.data.lessons.map(l => l.id), ['lC1']);
  assert.strictEqual(db.scans, 1);
  db.containsBroken = false;
});

let failed = 0;
for (const [title, fn] of tests) {
  try { await fn(); console.log('  ok   ' + title); }
  catch (e) { failed++; console.log('  FALLITO ' + title + '\n       ' + String(e.message).split('\n').slice(0, 5).map(x => x.slice(0, 160)).join('\n       ')); }
}
fs.unlinkSync(copy);
console.log(failed ? `\n${failed} prove fallite su ${tests.length}` : `\nTutte le ${tests.length} prove superate`);
process.exit(failed ? 1 : 0);
