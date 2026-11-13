#!/usr/bin/env node
/**
 * FitFlow — server di sviluppo locale (NON viene pubblicato: netlify pubblica solo dist/).
 *
 * Serve la cartella dist/ e finge il minimo indispensabile di Supabase e delle
 * funzioni Netlify, così l'app si può provare sul proprio computer con login,
 * salvataggio cloud e portale cliente, senza toccare i dati veri.
 *
 * USO:   npm run dev          → http://127.0.0.1:8770/app.html
 *        (le credenziali di prova sono in scripts/dev-seed.json)
 *
 * Tutto resta in memoria: riavviando il server si riparte dai dati di prova.
 */
'use strict';

const http = require('http');
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT || 8770);
const ORIGIN = `http://127.0.0.1:${PORT}`;
const SEED = JSON.parse(fs.readFileSync(path.join(__dirname, 'dev-seed.json'), 'utf8'));
const { buildDemoState } = require('./demo-data');

// ── Dati in memoria ──────────────────────────────────────────────────
const db = {
  users: new Map(),        // email → { id, email, password }
  sessions: new Map(),     // access_token → userId
  refresh: new Map(),      // refresh_token → userId
  states: new Map(),       // userId → { app_data, updated_at, created_at }
  messages: [],            // client_messages
  gone: new Set(),         // access_token di account eliminati (il login non vale più)
  deleteAccountMode: '',   // prova dell'eliminazione account: vedi handleDeleteAccount
  apiDown: false,          // true = le API non rispondono (simula assenza di rete)
  siteDown: false,         // true = non risponde nemmeno il sito (prova dell'app senza rete)
  log: []                  // ultime chiamate API, per i test
};

function microNow() {
  // Come Postgres: precisione al microsecondo, sempre diversa a ogni scrittura
  const now = new Date();
  microNow.n = (microNow.n || 0) + 1;
  const micro = String(microNow.n % 1000).padStart(3, '0');
  return now.toISOString().replace('Z', `${micro}+00:00`);
}

function b64url(value) {
  return Buffer.from(JSON.stringify(value)).toString('base64url');
}

function makeSession(user) {
  const exp = Math.floor(Date.now() / 1000) + 3600;
  const access = `${b64url({ alg: 'HS256', typ: 'JWT' })}.${b64url({ sub: user.id, email: user.email, role: 'authenticated', aud: 'authenticated', exp })}.${crypto.randomBytes(16).toString('base64url')}`;
  const refresh = crypto.randomBytes(12).toString('base64url');
  db.sessions.set(access, user.id);
  db.refresh.set(refresh, user.id);
  return {
    access_token: access,
    token_type: 'bearer',
    expires_in: 3600,
    expires_at: exp,
    refresh_token: refresh,
    user: publicUser(user)
  };
}

function publicUser(user) {
  return {
    id: user.id,
    aud: 'authenticated',
    role: 'authenticated',
    email: user.email,
    email_confirmed_at: '2026-01-01T00:00:00Z',
    app_metadata: { provider: 'email', providers: ['email'] },
    user_metadata: {},
    created_at: '2026-01-01T00:00:00Z'
  };
}

function createUser(email, password) {
  const user = { id: crypto.randomUUID(), email: String(email).toLowerCase(), password };
  db.users.set(user.email, user);
  return user;
}

function userFromRequest(req) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  const id = db.sessions.get(token);
  if (!id) return null;
  return [...db.users.values()].find(u => u.id === id) || null;
}

function seed() {
  const user = createUser(SEED.email, SEED.password);
  db.states.set(user.id, { app_data: buildDemoState(Number(SEED.demoClients || 40)), updated_at: microNow(), created_at: microNow() });
}
seed();

// ── Utilità HTTP ─────────────────────────────────────────────────────
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,PUT,DELETE,OPTIONS',
  'Access-Control-Expose-Headers': 'content-range'
};

function send(res, status, body, headers = {}) {
  const payload = body === null || body === undefined ? '' : (typeof body === 'string' ? body : JSON.stringify(body));
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', ...CORS, ...headers });
  res.end(payload);
}

function readBody(req) {
  return new Promise(resolve => {
    const chunks = [];
    req.on('data', c => chunks.push(c));
    req.on('end', () => {
      const text = Buffer.concat(chunks).toString('utf8');
      try { resolve(text ? JSON.parse(text) : {}); } catch (_) { resolve({}); }
    });
  });
}

// Le intestazioni di sicurezza scritte in netlify.toml valgono anche qui: così un
// blocco del browser (CSP) si scopre in locale e non dopo la pubblicazione.
function readNetlifyHeaders() {
  const rules = [];
  let current = null;
  try {
    for (const line of fs.readFileSync(path.join(ROOT, 'netlify.toml'), 'utf8').split('\n')) {
      const text = line.trim();
      if (text === '[[headers]]') { current = { path: '', values: {} }; rules.push(current); continue; }
      if (text.startsWith('[') && text !== '[headers.values]') { current = null; continue; }
      if (!current || !text || text.startsWith('#')) continue;
      const match = text.match(/^([A-Za-z-]+|for)\s*=\s*"(.*)"$/);
      if (!match) continue;
      if (match[1] === 'for') current.path = match[2];
      else current.values[match[1]] = match[2];
    }
  } catch (_) {}
  return rules;
}
const NETLIFY_HEADERS = readNetlifyHeaders();
function securityHeadersFor(pathname) {
  const out = {};
  NETLIFY_HEADERS.forEach(rule => {
    if (rule.path === '/*' || rule.path === pathname) Object.assign(out, rule.values);
  });
  delete out['Strict-Transport-Security']; // in locale non c'è https
  delete out['Cache-Control'];
  return out;
}

const MIME = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.json': 'application/json', '.png': 'image/png', '.svg': 'image/svg+xml', '.css': 'text/css; charset=utf-8', '.ico': 'image/x-icon', '.webp': 'image/webp', '.jpg': 'image/jpeg' };

function serveStatic(req, res, pathname) {
  let rel = decodeURIComponent(pathname);
  if (rel === '/') rel = '/index.html';
  const file = path.join(DIST, rel);
  if (!file.startsWith(DIST) || !fs.existsSync(file) || !fs.statSync(file).isFile()) {
    res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('Non trovato');
    return;
  }
  const headers = { 'Content-Type': MIME[path.extname(file).toLowerCase()] || 'application/octet-stream', 'Cache-Control': 'no-cache', ...securityHeadersFor(rel) };
  if (rel === '/client.html') {
    // Il portale cliente ha l'indirizzo del cloud vero scritto dentro: in locale
    // deve parlare con questo server finto, mai con i dati reali.
    const page = fs.readFileSync(file, 'utf8').replace(/https:\/\/[a-z0-9]+\.supabase\.co/g, `http://${req.headers.host || `127.0.0.1:${PORT}`}`);
    res.writeHead(200, headers);
    res.end(page);
    return;
  }
  res.writeHead(200, headers);
  fs.createReadStream(file).pipe(res);
}

// Filtri in stile PostgREST: colonna=eq.valore / is.null / is.false
function matchFilters(row, params, ignore = []) {
  for (const [key, raw] of params) {
    if (['select', 'order', 'on_conflict', 'limit', 'offset', 'columns', ...ignore].includes(key)) continue;
    const dot = raw.indexOf('.');
    const op = raw.slice(0, dot);
    const value = raw.slice(dot + 1);
    const actual = row[key];
    if (op === 'eq' && String(actual) !== value) return false;
    if (op === 'is') {
      if (value === 'null' && actual !== null && actual !== undefined) return false;
      if (value === 'false' && actual !== false) return false;
      if (value === 'true' && actual !== true) return false;
    }
    if (op === 'gte' && !(String(actual) >= value)) return false;
  }
  return true;
}

function pickColumns(row, select) {
  if (!select || select === '*') return row;
  const out = {};
  select.split(',').map(s => s.trim()).filter(Boolean).forEach(col => { out[col] = row[col]; });
  return out;
}

// ── Finto Supabase: autenticazione ───────────────────────────────────
async function handleAuth(req, res, url) {
  const route = url.pathname.replace('/auth/v1', '');
  const body = req.method === 'POST' || req.method === 'PUT' ? await readBody(req) : {};
  if (route === '/signup' && req.method === 'POST') {
    const email = String(body.email || '').toLowerCase();
    if (!email || String(body.password || '').length < 6) return send(res, 422, { code: 422, error_code: 'weak_password', msg: 'Password should be at least 6 characters' });
    if (db.users.has(email)) return send(res, 422, { code: 422, error_code: 'user_already_exists', msg: 'User already registered' });
    return send(res, 200, makeSession(createUser(email, body.password)));
  }
  if (route === '/token' && req.method === 'POST') {
    const grant = url.searchParams.get('grant_type');
    if (grant === 'password') {
      const user = db.users.get(String(body.email || '').toLowerCase());
      if (!user || user.password !== body.password) return send(res, 400, { code: 400, error_code: 'invalid_credentials', msg: 'Invalid login credentials' });
      return send(res, 200, makeSession(user));
    }
    if (grant === 'refresh_token') {
      const id = db.refresh.get(body.refresh_token);
      const user = [...db.users.values()].find(u => u.id === id);
      if (!user) return send(res, 400, { code: 400, error_code: 'refresh_token_not_found', msg: 'Invalid Refresh Token: Refresh Token Not Found' });
      return send(res, 200, makeSession(user));
    }
    return send(res, 400, { code: 400, msg: 'unsupported grant' });
  }
  if (route === '/user') {
    const user = userFromRequest(req);
    // Account eliminato: Supabase riconosce ancora il login ma non trova più l'utente
    const bearer = String(req.headers.authorization || '').replace('Bearer ', '');
    if (!user && db.gone.has(bearer)) return send(res, 403, { code: 403, error_code: 'user_not_found', msg: 'User from sub claim in JWT does not exist' });
    if (!user) return send(res, 401, { code: 401, msg: 'invalid JWT' });
    if (req.method === 'PUT' && body.password) user.password = body.password;
    return send(res, 200, publicUser(user));
  }
  if (route === '/logout') return send(res, 204, null);
  if (route === '/recover') return send(res, 200, {});
  return send(res, 404, { msg: 'auth route non simulata: ' + route });
}

// ── Finto Supabase: tabelle ──────────────────────────────────────────
async function handleRest(req, res, url) {
  const table = url.pathname.replace('/rest/v1/', '');
  const user = userFromRequest(req);
  if (!user) return send(res, 401, { code: 'PGRST301', message: 'JWT expired' });
  const prefer = String(req.headers.prefer || '');
  const wantsRows = prefer.includes('return=representation');
  const select = url.searchParams.get('select');
  const wantsObject = String(req.headers.accept || '').includes('vnd.pgrst.object+json');

  if (table === 'user_app_state') {
    const mine = db.states.get(user.id);
    const row = mine ? { user_id: user.id, ...mine } : null;
    if (req.method === 'GET') {
      const rows = row && matchFilters(row, url.searchParams) ? [pickColumns(row, select)] : [];
      if (wantsObject) return rows.length ? send(res, 200, rows[0]) : send(res, 406, { code: 'PGRST116', message: 'JSON object requested, multiple (or no) rows returned' });
      return send(res, 200, rows);
    }
    const body = await readBody(req);
    if (req.method === 'POST') {
      // upsert: come in Postgres il trigger imposta updated_at solo sugli UPDATE
      const now = microNow();
      const next = mine
        ? { ...mine, app_data: body.app_data, updated_at: now }
        : { app_data: body.app_data, created_at: now, updated_at: now };
      db.states.set(user.id, next);
      return send(res, 201, wantsRows ? [pickColumns({ user_id: user.id, ...next }, select)] : null);
    }
    if (req.method === 'PATCH') {
      if (!row || !matchFilters(row, url.searchParams)) return send(res, 200, wantsRows ? [] : null);
      const next = { ...mine, ...('app_data' in body ? { app_data: body.app_data } : {}), updated_at: microNow() };
      db.states.set(user.id, next);
      return send(res, 200, wantsRows ? [pickColumns({ user_id: user.id, ...next }, select)] : null);
    }
  }

  if (table === 'client_messages') {
    const own = db.messages.filter(m => m.user_id === user.id);
    if (req.method === 'GET') {
      // Come Supabase: al massimo 1000 righe per richiesta, il resto si chiede a pagine (limit/offset)
      const offset = Math.max(0, Number(url.searchParams.get('offset')) || 0);
      const limit = Math.min(1000, Math.max(0, Number(url.searchParams.get('limit') ?? 1000) || 0));
      const rows = own.filter(m => matchFilters(m, url.searchParams)).slice(offset, offset + limit).map(m => pickColumns(m, select));
      return send(res, 200, rows);
    }
    const body = await readBody(req);
    if (req.method === 'POST') {
      if (body.user_id !== user.id) return send(res, 403, { code: '42501', message: 'new row violates row-level security policy' });
      const row = { id: crypto.randomUUID(), created_at: new Date().toISOString(), delivered_at: null, read: false, type: 'message', lesson_id: null, ...body };
      db.messages.push(row);
      return send(res, 201, wantsRows ? [row] : null);
    }
    if (req.method === 'PATCH') {
      own.filter(m => matchFilters(m, url.searchParams)).forEach(m => Object.assign(m, body));
      return send(res, 204, null);
    }
  }
  return send(res, 404, { message: 'tabella non simulata: ' + table });
}

// ── Finta funzione del portale cliente (solo lettura dati + messaggi) ──
async function handlePortal(req, res) {
  const body = await readBody(req);
  const token = String(body.token || '');
  let owner = null, client = null, data = null;
  for (const [userId, state] of db.states) {
    const match = (state.app_data.clients || []).find(c => c.shareToken === token);
    if (match) { owner = userId; client = match; data = state.app_data; break; }
  }
  if (!client) return send(res, 404, { error: 'Link non valido o scaduto' });
  const mine = () => db.messages.filter(m => m.client_token === token);
  if (body.action === 'get_data') {
    const plan = (data.plans || []).find(p => p.id === client.activePlanId) || null;
    const pkg = plan ? (data.packages || []).find(p => p.id === plan.packageId) : null;
    // Stessa risposta della funzione vera (supabase/functions/client-portal):
    // piano con il suo id, lezioni con il piano di appartenenza, totale con bonus e riporti
    const totalSessions = Number(pkg?.lessonsTotal || 0) + Number(plan?.bonusLessons || 0) + Number(plan?.carryOverLessons || 0);
    return send(res, 200, {
      client: { name: client.name, firstName: client.firstName, lastName: client.lastName, email: client.email },
      lessons: (data.lessons || []).filter(l => l.clientId === client.id).map(l => ({ id: l.id, planId: l.planId, date: l.date, time: l.time, duration: l.duration, status: l.status, lessonType: l.lessonType })),
      plan: plan ? { id: plan.id, startDate: plan.startDate, totalPrice: plan.totalPrice } : null,
      package: pkg ? { name: pkg.name, sessions: totalSessions > 0 ? totalSessions : null, duration: pkg.duration, perWeek: pkg.perWeek } : null,
      messages: mine().map(({ id, sender, text, type, lesson_id, created_at, read, delivered_at }) => ({ id, sender, text, type, lesson_id, created_at, read, delivered_at }))
    });
  }
  if (['send_message', 'cancel_request', 'reschedule_request'].includes(body.action)) {
    const text = body.action === 'send_message' ? String(body.payload?.text || '').trim() : `Richiesta ${body.action === 'cancel_request' ? 'disdetta' : 'spostamento'} lezione del ${body.payload?.lessonDate || ''}`;
    if (!text) return send(res, 400, { error: 'Messaggio vuoto' });
    db.messages.push({ id: crypto.randomUUID(), client_token: token, user_id: owner, client_id: client.id, sender: 'client', text, type: body.action === 'send_message' ? 'message' : body.action, lesson_id: body.payload?.lessonId || null, read: false, delivered_at: null, created_at: new Date().toISOString() });
    return send(res, 200, { ok: true });
  }
  if (body.action === 'mark_read' || body.action === 'mark_delivered') {
    mine().filter(m => m.sender === 'trainer').forEach(m => { m.delivered_at = m.delivered_at || new Date().toISOString(); if (body.action === 'mark_read') m.read = true; });
    return send(res, 200, { ok: true });
  }
  return send(res, 400, { error: 'Azione non riconosciuta' });
}

// ── Finta funzione "delete-account" ──────────────────────────────────
// Stesse risposte di netlify/functions/delete-account.js, sui dati in memoria.
// Con /__test/delete-account-mode si prova (una volta sola) anche quando va male:
//   'errore-a-meta'       → elimina solo una parte e risponde con un errore
//   'risposta-persa'      → elimina tutto ma la risposta non arriva (rete caduta)
//   'google-non-revocato' → elimina tutto, ma l'accesso a Google non è stato tolto
async function handleDeleteAccount(req, res) {
  if (req.method !== 'POST') return send(res, 405, { error: 'Method not allowed' });
  const user = userFromRequest(req);
  if (!user) return send(res, 401, { error: 'Unauthorized' });
  const body = await readBody(req);
  if (String(body.confirmEmail || '').trim().toLowerCase() !== user.email) return send(res, 400, { error: 'Conferma non valida' });
  const mode = db.deleteAccountMode;
  db.deleteAccountMode = '';
  // Come la funzione vera: dati dell'app, poi messaggi, per ultimo l'utente di accesso
  db.states.delete(user.id);
  if (mode === 'errore-a-meta') return send(res, 500, { error: 'Eliminazione account non completata' });
  db.messages = db.messages.filter(m => m.user_id !== user.id);
  for (const [token, id] of db.sessions) if (id === user.id) { db.sessions.delete(token); db.gone.add(token); }
  for (const [token, id] of db.refresh) if (id === user.id) db.refresh.delete(token);
  db.users.delete(user.email);
  if (mode === 'risposta-persa') { req.socket.destroy(); return; }
  return send(res, 200, { ok: true, googleRevoked: mode === 'google-non-revocato' ? false : null });
}

// ── Comandi per i test (solo su questo server locale) ────────────────
async function handleTest(req, res, url) {
  const route = url.pathname.replace('/__test', '');
  const body = req.method === 'POST' ? await readBody(req) : {};
  const seedUser = db.users.get(String(SEED.email).toLowerCase());
  const email = body.email || url.searchParams.get('email');
  const target = email ? db.users.get(String(email).toLowerCase()) : seedUser;
  if (route === '/delete-account-mode') { db.deleteAccountMode = String(body.mode || ''); return send(res, 200, { mode: db.deleteAccountMode }); }
  // Cosa resta di un account nel finto cloud (per controllare l'eliminazione)
  if (route === '/account') {
    return send(res, 200, {
      exists: Boolean(target),
      hasState: Boolean(target && db.states.has(target.id)),
      messages: target ? db.messages.filter(m => m.user_id === target.id).length : 0,
      sessions: target ? [...db.sessions.values()].filter(id => id === target.id).length : 0,
      totalUsers: db.users.size,
      totalMessages: db.messages.length
    });
  }
  if (route === '/api-down') { db.apiDown = Boolean(body.down); return send(res, 200, { apiDown: db.apiDown }); }
  if (route === '/site-down') { db.siteDown = Boolean(body.down); db.apiDown = db.siteDown; return send(res, 200, { siteDown: db.siteDown }); }
  // Simula una sessione revocata dal server (il prossimo accesso ai dati risponde 401)
  if (route === '/expire-sessions') { db.sessions.clear(); db.refresh.clear(); return send(res, 200, { ok: true }); }
  // Per i test automatici nel browser: compila il login senza copiare la password a mano
  if (route === '/seed-credentials') return send(res, 200, { email: SEED.email, password: SEED.password });
  if (route === '/state') {
    const state = target ? db.states.get(target.id) : null;
    return send(res, 200, state ? { updated_at: state.updated_at, counts: { clients: state.app_data.clients?.length || 0, plans: state.app_data.plans?.length || 0, lessons: state.app_data.lessons?.length || 0, packages: state.app_data.packages?.length || 0 }, app_data: url.searchParams.get('full') ? state.app_data : undefined } : { updated_at: null });
  }
  if (route === '/remote-edit') {
    // Simula una modifica fatta da un altro dispositivo dello stesso trainer
    const state = target && db.states.get(target.id);
    if (!state) return send(res, 404, { error: 'nessuno stato' });
    const data = state.app_data;
    if (body.addClient) data.clients.unshift({ id: body.addClient.id, firstName: body.addClient.firstName, lastName: body.addClient.lastName, name: `${body.addClient.firstName} ${body.addClient.lastName}`, shareToken: `remote${Date.now()}aaaaaaaaaa`, serviceType: 'personal', paymentStatus: 'paid', createdAt: new Date().toISOString() });
    if (body.removeClientId) data.clients = data.clients.filter(c => c.id !== body.removeClientId);
    if (body.renameClient) { const c = data.clients.find(x => x.id === body.renameClient.id); if (c) { c.firstName = body.renameClient.firstName; c.name = `${c.firstName} ${c.lastName}`; } }
    if (body.setLessonStatus) { const l = data.lessons.find(x => x.id === body.setLessonStatus.id); if (l) l.status = body.setLessonStatus.status; }
    state.updated_at = microNow();
    return send(res, 200, { updated_at: state.updated_at });
  }
  if (route === '/log') {
    const copy = db.log.slice();
    if (url.searchParams.get('clear')) db.log.length = 0;
    return send(res, 200, copy);
  }
  if (route === '/reset') {
    db.users.clear(); db.sessions.clear(); db.refresh.clear(); db.states.clear(); db.messages.length = 0; db.log.length = 0; db.apiDown = false; db.siteDown = false;
    db.gone.clear(); db.deleteAccountMode = '';
    seed();
    return send(res, 200, { ok: true });
  }
  if (route === '/client-message') {
    // Simula un messaggio scritto dal cliente nel portale
    const state = target && db.states.get(target.id);
    const client = state?.app_data.clients.find(c => c.id === body.clientId) || state?.app_data.clients[0];
    if (!client) return send(res, 404, { error: 'cliente non trovato' });
    // count: quanti messaggi creare (per provare l'esportazione con più di 1000 messaggi)
    const count = Math.min(5000, Math.max(1, Number(body.count) || 1));
    for (let i = 0; i < count; i++) {
      db.messages.push({ id: crypto.randomUUID(), client_token: client.shareToken, user_id: target.id, client_id: client.id, sender: body.sender === 'trainer' ? 'trainer' : 'client', text: count > 1 ? `${body.text || 'Messaggio di prova'} ${i + 1}` : (body.text || 'Messaggio di prova'), type: 'message', lesson_id: null, read: false, delivered_at: null, created_at: new Date(Date.now() + i).toISOString() });
    }
    return send(res, 200, { ok: true, clientId: client.id, count });
  }
  return send(res, 404, { error: 'comando di test sconosciuto' });
}

async function handleRequest(req, res) {
  const url = new URL(req.url, ORIGIN);
  const p = url.pathname;
  try {
    if (req.method === 'OPTIONS') { res.writeHead(204, CORS); res.end(); return; }
    if (p.startsWith('/__test/')) return await handleTest(req, res, url);
    const isApi = p.startsWith('/auth/v1') || p.startsWith('/rest/v1') || p.startsWith('/functions/v1') || p.startsWith('/.netlify/functions/') || p.startsWith('/realtime/v1');
    if (isApi) {
      db.log.push(`${req.method} ${p}${p.startsWith('/rest/v1') && url.searchParams.get('select') ? '?select=' + url.searchParams.get('select') : ''}`);
      if (db.log.length > 400) db.log.shift();
      // "rete assente": chiude la connessione senza rispondere
      if (db.apiDown) { req.socket.destroy(); return; }
    }
    // Stesso indirizzo con cui è stata aperta la pagina (localhost o 127.0.0.1)
    if (db.siteDown) { req.socket.destroy(); return; }
    if (p === '/.netlify/functions/config') return send(res, 200, { supabaseUrl: `http://${req.headers.host || `127.0.0.1:${PORT}`}`, supabaseAnonKey: 'chiave-pubblica-di-prova' });
    if (p === '/.netlify/functions/google-status') return userFromRequest(req) ? send(res, 200, { connected: false, calendarId: '', calendarName: '', googleEmail: '' }) : send(res, 401, { error: 'Unauthorized' });
    if (p === '/.netlify/functions/delete-account') return await handleDeleteAccount(req, res);
    if (p.startsWith('/.netlify/functions/')) return send(res, 200, { skipped: true, reason: 'google_not_connected', busy: [], mappings: [], synced: 0 });
    if (p.startsWith('/auth/v1')) return await handleAuth(req, res, url);
    if (p.startsWith('/rest/v1/')) return await handleRest(req, res, url);
    if (p === '/functions/v1/client-portal') return await handlePortal(req, res);
    if (p.startsWith('/realtime/v1')) { res.writeHead(404); res.end(); return; }
    return serveStatic(req, res, p);
  } catch (error) {
    console.error(error);
    send(res, 500, { error: String(error.message || error) });
  }
}

if (!fs.existsSync(DIST)) {
  console.error('✕  Cartella dist/ mancante: esegui prima "npm run build".');
  process.exit(1);
}

// Solo sul proprio computer: in ascolto sia su 127.0.0.1 sia su ::1,
// perché "localhost" può indicare l'uno o l'altro a seconda del sistema.
function listen(host, required) {
  const server = http.createServer(handleRequest);
  // Il canale in tempo reale non è simulato: le richieste WebSocket vengono chiuse subito
  server.on('upgrade', (req, socket) => socket.destroy());
  server.on('error', error => {
    if (required) { console.error(`✕  Porta ${PORT} non disponibile: ${error.message}`); process.exit(1); }
  });
  server.listen(PORT, host, () => {
    if (!required) return;
    console.log(`✓  FitFlow in locale: http://localhost:${PORT}/app.html`);
    console.log('   Backend finto in memoria — credenziali di prova in scripts/dev-seed.json');
  });
}
listen('127.0.0.1', true);
listen('::1', false);
