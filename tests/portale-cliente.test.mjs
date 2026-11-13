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
const db = {
  states: [], messages: [],
  links: [],              // tabella client_portal_links: codice → trainer
  linksBroken: false,     // la tabella dei link non risponde (es. migrazione non applicata)
  containsBroken: false,  // la ricerca dentro i dati dei trainer non è disponibile
  statesBroken: false,    // i dati dei trainer non si riescono a leggere
  linkLookups: 0,         // ricerche nella tabella dei link
  loadedUsers: [],        // trainer di cui sono stati letti i dati (uno alla volta)
  lookups: 0,             // ricerche di riserva dentro i dati di tutti i trainer
  scans: 0,               // letture complete dei dati di tutti i trainer
};
const resetCounters = () => Object.assign(db, { linkLookups: 0, loadedUsers: [], lookups: 0, scans: 0 });
// Tiene la tabella dei link allineata ai dati, come fa il trigger nel database:
// una riga per codice; se due trainer hanno lo stesso codice resta al primo.
const syncLinks = () => {
  db.links = [];
  for (const s of db.states) for (const c of s.app_data.clients || []) {
    if (typeof c?.shareToken === 'string' && !db.links.some(l => l.token === c.shareToken)) {
      db.links.push({ token: c.shareToken, user_id: s.user_id, client_id: c.id ?? null });
    }
  }
};
const contains = (data, pattern) => {
  if (Array.isArray(pattern)) return Array.isArray(data) && pattern.every(p => data.some(d => contains(d, p)));
  if (pattern && typeof pattern === 'object') return data && typeof data === 'object' && Object.keys(pattern).every(k => contains(data[k], pattern[k]));
  return data === pattern;
};
class Q {
  constructor(table) { this.table = table; this.op = 'select'; this.f = []; this.eqs = {}; }
  select(cols, opts) { this.cols = cols; this.opts = opts || {}; return this; }
  insert(row) { this.op = 'insert'; this.row = row; return this; }
  update(row) { this.op = 'update'; this.row = row; return this; }
  eq(c, v) { this.eqs[c] = v; this.f.push(r => r[c] === v); return this; }
  is(c, v) { this.f.push(r => (r[c] ?? null) === v); return this; }
  gte(c, v) { this.f.push(r => r[c] >= v); return this; }
  contains(c, v) { this.containsUsed = true; this.f.push(r => contains(r[c], v)); return this; }
  limit(n) { this.max = n; return this; }
  maybeSingle() { this.single = true; return this; }
  order() { return this; }
  then(ok, ko) { return new Promise(resolve => resolve(this.run())).then(ok, ko); }
  run() {
    const rows = { user_app_state: db.states, client_messages: db.messages, client_portal_links: db.links }[this.table];
    assert.ok(rows, 'tabella inattesa: ' + this.table);
    // la funzione legge soltanto: i dati dei trainer e i link li scrivono l'app e il database
    if (this.table !== 'client_messages') assert.strictEqual(this.op, 'select', 'scrittura inattesa su ' + this.table);
    if (this.table === 'client_portal_links') {
      db.linkLookups++;
      if (db.linksBroken) return { data: null, error: { message: "Could not find the table 'public.client_portal_links' in the schema cache" } };
    }
    if (this.table === 'user_app_state') {
      if (this.containsUsed) db.lookups++;
      else if ('user_id' in this.eqs) db.loadedUsers.push(this.eqs.user_id);
      else db.scans++;
      if (db.statesBroken) return { data: null, error: { message: 'connection refused' } };
      if (this.containsUsed && db.containsBroken) return { data: null, error: { message: 'operator does not exist: json @> unknown' } };
    }
    if (this.op === 'insert') { rows.push({ id: 'm' + (rows.length + 1), created_at: new Date().toISOString(), delivered_at: null, ...this.row }); return { error: null }; }
    let hit = rows.filter(r => this.f.every(fn => fn(r)));
    if (this.op === 'update') { hit.forEach(r => Object.assign(r, this.row)); return { error: null }; }
    if (this.opts?.head) return { count: hit.length, error: null };
    if (this.max) hit = hit.slice(0, this.max);
    // come il vero database: tornano solo le colonne richieste
    const cols = (this.cols || '*').split(',').map(c => c.trim());
    const pick = r => JSON.parse(JSON.stringify(cols.includes('*') ? r : Object.fromEntries(cols.map(c => [c, r[c]]))));
    if (this.single) { assert.ok(hit.length <= 1, 'maybeSingle con più righe'); return { data: hit.length ? pick(hit[0]) : null, error: null }; }
    return { data: hit.map(pick), error: null };
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
      { id: 'lA1', clientId: 'cA', planId: 'pA', date: '2026-12-01', time: '10:00', duration: 60, status: 'scheduled', lessonType: 'personal', note: 'NOTA LEZIONE PRIVATA' },
      { id: 'lB1', clientId: 'cB', date: '2026-12-02', time: '11:00', duration: 60, status: 'scheduled' }
    ],
    plans: [{ id: 'pA', clientId: 'cA', packageId: 'k1', startDate: '2026-11-01', totalPrice: 400, paymentStatus: 'unpaid' }],
    packages: [{ id: 'k1', name: 'Base 12', lessonsTotal: 12, duration: 60, perWeek: 2, totalPrice: 400 }]
  }
});
db.states.push({ user_id: 'trainer2', app_data: { clients: [{ id: 'cC', name: 'Carla Neri', shareToken: TOKEN_C }], lessons: [{ id: 'lC1', clientId: 'cC', date: '2026-12-03', time: '09:00' }], plans: [], packages: [] } });
syncLinks();

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
  assert.strictEqual(db.lookups, 0, 'mai una ricerca dentro i dati di tutti i trainer');
  assert.deepStrictEqual(db.loadedUsers, [], 'per un codice sconosciuto non si leggono i dati di nessun trainer');
  assert.strictEqual(db.linkLookups, 1, 'alla tabella dei link arriva solo il codice scritto bene');
});

test('la ricerca passa dalla tabella dei link e legge solo i dati di quel trainer', async () => {
  const c = await call({ token: TOKEN_C, action: 'get_data' });
  assert.deepStrictEqual(c.data.lessons.map(l => l.id), ['lC1']);
  assert.deepStrictEqual(db.loadedUsers, ['trainer2'], 'letti solo i dati del trainer del link');
  const a = await call({ token: TOKEN_A, action: 'mark_delivered' });
  assert.deepStrictEqual(a.data, { ok: true });
  assert.deepStrictEqual(db.loadedUsers, ['trainer2', 'trainer1'], 'una sola lettura per richiesta, sempre del trainer giusto');
  assert.strictEqual(db.linkLookups, 2, 'una ricerca nella tabella dei link per richiesta');
  assert.strictEqual(db.lookups + db.scans, 0, 'nessuna ricerca tra i dati di tutti i trainer');
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
  assert.deepStrictEqual(r.data.package, { name: 'Base 12', sessions: 12, duration: 60, perWeek: 2 }, 'le lezioni del pacchetto (lessonsTotal) arrivano al portale come sessions');
  assert.strictEqual(r.data.plan.id, 'pA', 'il portale sa qual è il percorso in corso');
  assert.strictEqual(r.data.lessons[0].planId, 'pA', 'e a quale percorso appartiene ogni lezione');
  const text = JSON.stringify(r.data);
  ['SEGRETO', 'PRIVATA', 'Bruno', 'Carla', 'lB1', 'lC1', 'shareToken', TOKEN_B, 'paymentStatus'].forEach(x => assert.ok(!text.includes(x), 'trapela: ' + x));
  // lezioni bonus e riportate fanno parte del totale mostrato al cliente
  Object.assign(db.states[0].app_data.plans[0], { bonusLessons: 2, carryOverLessons: 1 });
  const bonus = await call({ token: TOKEN_A, action: 'get_data' });
  assert.strictEqual(bonus.data.package.sessions, 15, 'pacchetto 12 + 2 bonus + 1 riportata');
  Object.assign(db.states[0].app_data.plans[0], { bonusLessons: 0, carryOverLessons: 0 });
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

test('un codice non apre mai i dati di un altro trainer, anche se la tabella dei link è sbagliata', async () => {
  const before = db.messages.length;
  // la tabella indica per errore un altro trainer: quel trainer non ha un cliente con questo codice
  db.links.find(l => l.token === TOKEN_A).user_id = 'trainer2';
  for (const action of ['get_data', 'send_message', 'cancel_request', 'reschedule_request', 'mark_read', 'mark_delivered']) {
    const r = await call({ token: TOKEN_A, action, payload: { text: 'ciao', lessonId: 'lC1', lessonDate: '3 dic' } });
    assert.strictEqual(r.status, 404, action + ': il codice non vale per un altro trainer');
    assert.deepStrictEqual(r.data, { error: 'Link non valido o scaduto' }, action + ': nessun dato in risposta');
  }
  assert.strictEqual(db.messages.length, before, 'nessun messaggio arrivato a un altro trainer');
  assert.strictEqual(db.lookups + db.scans, 0, 'e nessuna ricerca tra i dati di tutti i trainer');
  syncLinks();

  // la tabella indica il trainer giusto ma il cliente sbagliato: conta chi ha davvero il codice
  db.links.find(l => l.token === TOKEN_A).client_id = 'cB';
  const anna = await call({ token: TOKEN_A, action: 'get_data' });
  assert.strictEqual(anna.data.client.name, 'Anna Rossi');
  assert.deepStrictEqual(anna.data.lessons.map(l => l.id), ['lA1'], 'mai le lezioni di un altro cliente');
});

test('un trainer che copia il codice di un cliente altrui non riceve nulla', async () => {
  // trainer2 mette nei propri dati un cliente finto con il codice di Anna (cliente di trainer1)
  const intruso = db.states[1].app_data;
  intruso.clients.push({ id: 'cX', name: 'Cliente Finto', shareToken: TOKEN_A });
  intruso.lessons.push({ id: 'lX1', clientId: 'cX', date: '2026-12-09', time: '08:00' });
  try {
    syncLinks();
    assert.strictEqual(db.links.find(l => l.token === TOKEN_A).user_id, 'trainer1', 'il link resta a chi lo aveva già');
    db.messages.filter(m => m.client_token === TOKEN_A).forEach(m => { m.created_at = new Date(Date.now() - 120000).toISOString(); });

    const r = await call({ token: TOKEN_A, action: 'get_data' });
    assert.strictEqual(r.data.client.name, 'Anna Rossi');
    assert.deepStrictEqual(r.data.lessons.map(l => l.id), ['lA1']);
    assert.ok(!JSON.stringify(r.data).includes('Finto'), 'il cliente di Anna non vede dati messi da un altro trainer');
    assert.deepStrictEqual((await call({ token: TOKEN_A, action: 'send_message', payload: { text: 'per il mio trainer' } })).data, { ok: true });
    assert.deepStrictEqual([db.messages.at(-1).user_id, db.messages.at(-1).client_id], ['trainer1', 'cA'], 'il messaggio arriva al trainer vero');
    assert.deepStrictEqual(db.loadedUsers, ['trainer1', 'trainer1'], 'i dati dell\'altro trainer non vengono nemmeno letti');
  } finally { intruso.clients.pop(); intruso.lessons.pop(); }
});

test('un codice che la tabella dei link non conosce non fa cercare altrove', async () => {
  db.links = db.links.filter(l => l.token !== TOKEN_B);
  const before = db.messages.length;
  assert.strictEqual((await call({ token: TOKEN_B, action: 'get_data' })).status, 404);
  assert.strictEqual((await call({ token: TOKEN_B, action: 'send_message', payload: { text: 'ciao' } })).status, 404);
  assert.strictEqual(db.messages.length, before);
  assert.deepStrictEqual(db.loadedUsers, [], 'nessun dato letto');
  assert.strictEqual(db.lookups + db.scans, 0, 'nessuna ricerca tra i dati di tutti i trainer');
  syncLinks();
  assert.strictEqual((await call({ token: TOKEN_B, action: 'get_data' })).status, 200, 'appena il link è registrato, funziona');
});

test('se i dati del trainer non si riescono a leggere il portale dice errore, non "link scaduto"', async () => {
  db.statesBroken = true;
  const r = await call({ token: TOKEN_A, action: 'get_data' });
  assert.strictEqual(r.status, 500);
  assert.deepStrictEqual(r.data, { error: 'Errore database' });
  assert.strictEqual(db.lookups + db.scans, 0, 'niente ricerche di riserva: la tabella dei link aveva risposto');
});

test('se la tabella dei link non risponde si usa la ricerca di prima, con lo stesso risultato', async () => {
  db.linksBroken = true;
  const quiet = console.error; console.error = () => {};
  try {
    const before = db.messages.length;
    const r = await call({ token: TOKEN_C, action: 'get_data' });
    assert.deepStrictEqual(r.data.lessons.map(l => l.id), ['lC1']);
    assert.ok(!JSON.stringify(r.data).includes('Anna'), 'solo i dati di quel cliente');
    assert.deepStrictEqual([db.lookups, db.scans], [1, 0], 'ricerca dentro i dati, senza scansione completa');
    assert.deepStrictEqual(db.loadedUsers, []);
    // anche con la riserva: codice inesistente respinto, lezioni altrui non toccabili
    assert.strictEqual((await call({ token: 'zzzzzzzzzzzzzzzzzzzzzzzz', action: 'get_data' })).status, 404);
    assert.strictEqual((await call({ token: TOKEN_C, action: 'cancel_request', payload: { lessonId: 'lA1' } })).status, 404, 'lezione di un altro trainer');
    assert.strictEqual(db.messages.length, before);
    assert.deepStrictEqual((await call({ token: TOKEN_C, action: 'send_message', payload: { text: 'con la riserva' } })).data, { ok: true });
    assert.deepStrictEqual([db.messages.at(-1).user_id, db.messages.at(-1).client_id], ['trainer2', 'cC']);
  } finally { console.error = quiet; }
});

test('se nemmeno la ricerca mirata è disponibile si usa la scansione, con lo stesso risultato', async () => {
  db.linksBroken = true; db.containsBroken = true;
  const quiet = console.error; console.error = () => {};
  try {
    const r = await call({ token: TOKEN_C, action: 'get_data' });
    assert.deepStrictEqual(r.data.lessons.map(l => l.id), ['lC1']);
    assert.strictEqual(db.scans, 1);
    db.statesBroken = true;
    assert.strictEqual((await call({ token: TOKEN_C, action: 'get_data' })).status, 500, 'database irraggiungibile: errore, non dati');
  } finally { console.error = quiet; }
});

let failed = 0;
for (const [title, fn] of tests) {
  resetCounters();
  try { await fn(); console.log('  ok   ' + title); }
  catch (e) { failed++; console.log('  FALLITO ' + title + '\n       ' + String(e.message).split('\n').slice(0, 5).map(x => x.slice(0, 160)).join('\n       ')); }
  // ogni prova riparte da un database "sano": guasti finti spenti e link allineati ai dati
  Object.assign(db, { linksBroken: false, containsBroken: false, statesBroken: false });
  syncLinks();
}
fs.unlinkSync(copy);
console.log(failed ? `\n${failed} prove fallite su ${tests.length}` : `\nTutte le ${tests.length} prove superate`);
process.exit(failed ? 1 : 0);
