// Prova di avvio: esegue il VERO codice di app.html dentro una pagina finta
// (senza browser) con dati di prova realistici, e controlla che
//   1. lo script arrivi in fondo senza errori (un errore qui lascerebbe l'app
//      bloccata sulla schermata di accesso per tutti);
//   2. ogni sezione dello schermo si disegni senza errori, nelle tre viste;
//   3. prima del caricamento dei dati non venga salvato nulla.
// uso: node tests/avvio-app.test.js
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = process.argv[2] || path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'app.html'), 'utf8');
const { buildDemoState } = require(path.join(root, 'scripts', 'demo-data.js'));

const scripts = [...html.matchAll(/<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g)].map(m => m[1]);
assert.ok(scripts.length >= 3, 'script di app.html non trovati');

// ── Pagina finta ────────────────────────────────────────────────────
function makeElement(tag = 'div') {
  const store = { value: '', textContent: '', innerHTML: '', className: '', hidden: false, disabled: false, checked: false, scrollTop: 0, scrollHeight: 0, style: {}, dataset: {}, attributes: {} };
  const classes = new Set();
  const api = {
    classList: {
      add: (...names) => names.forEach(name => classes.add(name)),
      remove: (...names) => names.forEach(name => classes.delete(name)),
      toggle: (name, on) => { const want = on === undefined ? !classes.has(name) : Boolean(on); if (want) classes.add(name); else classes.delete(name); return want; },
      contains: name => classes.has(name)
    },
    addEventListener() {}, removeEventListener() {}, dispatchEvent() {},
    querySelectorAll: () => [], querySelector: () => null, closest: () => null, contains: () => false,
    appendChild: child => child, append() {}, remove() {}, replaceWith() {}, replaceChild() {}, removeChild() {},
    cloneNode: () => makeElement(tag),
    setAttribute(key, value) { store.attributes[key] = String(value); },
    getAttribute: key => (key in store.attributes ? store.attributes[key] : null),
    hasAttribute: key => key in store.attributes,
    removeAttribute(key) { delete store.attributes[key]; },
    focus() {}, blur() {}, click() {}, select() {}, scrollIntoView() {}, requestSubmit() {},
    getBoundingClientRect: () => ({ top: 0, left: 0, right: 0, bottom: 0, width: 0, height: 0 }),
    tagName: tag.toUpperCase(), parentElement: null, offsetParent: {},
    parentNode: { replaceChild() {}, removeChild() {} }
  };
  return new Proxy(api, {
    get(target, prop) {
      if (prop === 'firstChild') return store.innerHTML ? {} : null;
      if (prop in target) return target[prop];
      return store[prop];
    },
    set(target, prop, value) {
      store[prop] = ['innerHTML', 'textContent', 'value', 'className'].includes(prop) ? String(value ?? '') : value;
      return true;
    }
  });
}

function makeStorage() {
  const map = new Map();
  return {
    getItem: key => (map.has(key) ? map.get(key) : null),
    setItem: (key, value) => { map.set(key, String(value)); },
    removeItem: key => { map.delete(key); },
    key: index => [...map.keys()][index] ?? null,
    get length() { return map.size; },
    _map: map
  };
}

const elements = new Map();
const errors = [];
const localStorage = makeStorage();
const sessionStorage = makeStorage();
const body = makeElement('body');
body.classList.add('signed-out');

const sandbox = {
  console: {
    log() {}, info() {}, warn() {},
    error: (...args) => errors.push(args.map(a => (a && a.stack) || String(a)).join(' '))
  },
  document: {
    getElementById(id) { if (!elements.has(id)) elements.set(id, makeElement('div')); return elements.get(id); },
    querySelector: () => null,
    querySelectorAll: () => [],
    createElement: tag => makeElement(tag),
    addEventListener() {}, removeEventListener() {},
    body, head: makeElement('head'), documentElement: makeElement('html'),
    hidden: false, visibilityState: 'visible', activeElement: null, title: 'FitFlow',
    execCommand: () => true
  },
  navigator: { onLine: true, vibrate() {}, userAgent: 'prova' },
  localStorage, sessionStorage,
  location: { href: 'http://localhost/app.html', origin: 'http://localhost', pathname: '/app.html', search: '', hash: '', reload() {}, replace() {} },
  history: { replaceState() {} },
  matchMedia: () => ({ matches: false, addEventListener() {}, removeEventListener() {} }),
  addEventListener() {}, removeEventListener() {}, scrollTo() {}, open: () => null,
  innerWidth: 1280, innerHeight: 800, scrollY: 0,
  fetch: () => Promise.reject(new TypeError('Failed to fetch')),
  requestAnimationFrame: fn => setTimeout(fn, 0),
  MutationObserver: class { observe() {} disconnect() {} },
  HTMLElement: class {},
  Event: class { constructor(type) { this.type = type; } },
  setTimeout, clearTimeout, setInterval, clearInterval,
  crypto: globalThis.crypto, structuredClone, URL, URLSearchParams, AbortController, Blob, performance, atob, btoa, Intl
};
sandbox.window = sandbox;
sandbox.self = sandbox;
sandbox.globalThis = sandbox;
vm.createContext(sandbox);
const run = code => vm.runInContext(code, sandbox);

(async () => {
  // ── 1. Prima di caricare i dati non si salva nulla ──────────────────
  // Sul dispositivo ci sono i dati di un account: se l'avvio si interrompesse,
  // nessun salvataggio "a vuoto" deve poterli sostituire.
  const demo = buildDemoState(40);
  localStorage.setItem('dsworld_clienti_v2', JSON.stringify(demo));
  localStorage.setItem('dsworld_sync_meta_v1', JSON.stringify({ owner: 'utente-di-prova', dirty: false, syncedAt: '2026-11-13T06:00:00.000000+00:00' }));
  const savedBefore = localStorage.getItem('dsworld_clienti_v2');

  // ── 2. Lo script arriva in fondo ────────────────────────────────────
  scripts.forEach((code, index) => {
    try {
      vm.runInContext(code, sandbox, { filename: `app.html (script ${index + 1})` });
    } catch (error) {
      console.error(`NO   avvio interrotto nello script ${index + 1}:\n     ${error.stack || error}`);
      process.exit(1);
    }
  });
  await new Promise(resolve => setTimeout(resolve, 50));
  assert.strictEqual(run('state.clients.length'), 40, 'i dati del dispositivo vengono caricati');
  assert.strictEqual(run('state.lessons.length'), demo.lessons.length);
  assert.strictEqual(body.classList.contains('signed-out'), false, 'con i dati di un account già presenti l\'app si apre subito, senza schermata di accesso');
  console.log('  ok   lo script di app.html arriva in fondo e carica i dati del dispositivo');

  // ── 3. Tutte le sezioni si disegnano ────────────────────────────────
  const steps = [
    ['schermata principale', 'renderAll()'],
    ['vista settimana', "state.calendarView = 'week'; renderCalendarOnly()"],
    ['vista giorno', "state.calendarView = 'day'; state.selectedDay = todayISO(); renderCalendarOnly()"],
    ['vista mese', "state.calendarView = 'month'; renderCalendarOnly()"],
    ['gestionale mensile', 'renderReport()'],
    ['avvisi operativi', 'renderOperazioniModal()'],
    ['clienti a rischio', 'renderAtRiskModal()'],
    ['completamento', 'renderCompletamentoModal()'],
    ['giornata', 'renderDayModal(todayISO())'],
    ['scheda lezione', 'openLessonModal(state.lessons[0].id)'],
    ['modulo cliente (modifica)', 'renderClientModal(state.clients[0])'],
    ['modulo cliente (nuovo)', 'renderClientModal(null)'],
    ['pacchetti', 'renderPackages()'],
    ['profilo trainer', 'renderTrainerProfile()'],
    ['ogni cliente selezionato', 'state.clients.forEach(client => { state.selectedClientId = client.id; renderSelectedClient(); })'],
    ['avvisi e statistiche di ogni piano', 'getAlerts(); state.plans.forEach(plan => planStats(plan))'],
    ['lezione senza orario e cliente con caratteri speciali', "state.lessons.push({ id: 'l_x', clientId: state.clients[0].id, planId: state.clients[0].activePlanId, date: todayISO(), status: 'scheduled' }); state.clients[0].firstName = '<b>Anna & \"Co\"'; invalidateDerivedData(); renderAll(); state.calendarView = 'week'; renderCalendarOnly(); state.calendarView = 'day'; renderCalendarOnly(); state.calendarView = 'month';"]
  ];
  for (const [title, code] of steps) {
    try {
      run(code);
    } catch (error) {
      console.error(`  NO   ${title}\n       ${error.stack || error}`);
      process.exit(1);
    }
    const renderErrors = errors.filter(text => text.includes('Errore di visualizzazione'));
    if (renderErrors.length) {
      console.error(`  NO   ${title}\n       ${renderErrors.join('\n       ')}`);
      process.exit(1);
    }
    console.log('  ok   ' + title);
  }

  // ── 4. Uno stato non ancora caricato non viene mai salvato ──────────
  // (stessa pagina, simulando il momento prima del caricamento)
  assert.ok(savedBefore.length > 1000);
  run("_stateLoaded = false; const __keep = [state.clients, state.lessons]; state.clients = []; state.lessons = []; saveState(true); saveLocalState(); saveUiState(); state.clients = __keep[0]; state.lessons = __keep[1]; _stateLoaded = true;");
  const savedAfter = JSON.parse(localStorage.getItem('dsworld_clienti_v2'));
  assert.strictEqual(savedAfter.clients.length, 40, 'uno stato vuoto non ancora caricato non sostituisce i dati salvati');
  console.log('  ok   prima del caricamento dei dati non viene salvato nulla');

  // ── 5. Controllo di sicurezza sugli invii ───────────────────────────
  run("setSyncMeta({ baseClients: 40, baseLessons: 200 }); cloud.massChangeConfirmed = false;");
  assert.strictEqual(run("detectMassDeletion({ clients: new Array(38), lessons: new Array(190) })"), null, 'piccole variazioni: invio normale');
  assert.ok(run("detectMassDeletion({ clients: new Array(3), lessons: new Array(190) })"), 'clienti più che dimezzati: invio fermato');
  assert.ok(run("detectMassDeletion({ clients: new Array(40), lessons: new Array(10) })"), 'lezioni più che dimezzate: invio fermato');
  assert.strictEqual(run("cloud.massChangeConfirmed = true; detectMassDeletion({ clients: [], lessons: [] })"), null, 'dopo la conferma (import/ripristino) l\'invio passa');
  console.log('  ok   un calo improvviso dei dati ferma l\'invio al cloud finché non viene confermato');

  // ── 6. Copia completa dei dati: tutti i messaggi, anche quando sono tanti ──
  const doc = sandbox.document;
  const text = id => String(doc.getElementById(id).textContent || '');
  const answer = (status, data) => ({ ok: status >= 200 && status < 300, status, json: async () => data });
  const allMessages = Array.from({ length: 2300 }, (_, i) => ({ id: 'm' + i, user_id: 'utente-di-prova', client_id: demo.clients[0].id, sender: 'client', text: 'Messaggio ' + i }));
  let serverMaxRows = 1000;
  let requests = [];
  sandbox.fetch = async (url, options = {}) => {
    const u = new URL(String(url));
    requests.push(u);
    assert.strictEqual(u.pathname, '/rest/v1/client_messages');
    assert.strictEqual(u.searchParams.get('user_id'), 'eq.utente-di-prova', 'si chiedono solo i propri messaggi');
    assert.strictEqual(options.headers.Authorization, 'Bearer token-di-prova');
    const offset = Number(u.searchParams.get('offset'));
    const limit = Math.min(serverMaxRows, Number(u.searchParams.get('limit')));
    return answer(200, allMessages.slice(offset, offset + limit));
  };
  sandbox.__getUser = async () => ({ data: { user: { id: 'utente-di-prova' } }, error: null });
  sandbox.__signOut = async () => ({ error: null });
  const logIn = () => run(`
    DEFAULT_SUPABASE_URL = 'https://db.test'; DEFAULT_SUPABASE_ANON_KEY = 'chiave-pubblica';
    setSyncMeta({ owner: 'utente-di-prova', dirty: false });
    cloud.session = { access_token: 'token-di-prova' };
    cloud.user = { id: 'utente-di-prova', email: 'trainer@fitflow.test', created_at: '2026-01-01T00:00:00Z' };
    cloud.client = { removeChannel() {}, auth: {
      getSession: async () => ({ data: { session: cloud.session } }),
      getUser: () => __getUser(),
      signOut: () => __signOut()
    } };
    updateUserBadge();
  `);
  logIn();
  let fetched = await run('fetchAllTrainerMessages()');
  assert.strictEqual(fetched.length, 2300, 'più di 1000 messaggi: arrivano tutti');
  assert.deepStrictEqual(requests.map(u => u.searchParams.get('offset')), ['0', '1000', '2000', '2300']);
  serverMaxRows = 400; requests = [];
  fetched = await run('fetchAllTrainerMessages()');
  assert.strictEqual(fetched.length, 2300, 'anche se il cloud restituisce meno righe per volta');
  assert.strictEqual(new Set(Array.from(fetched, m => m.id)).size, 2300, 'nessun messaggio doppio');
  const fullFile = JSON.parse(JSON.stringify(run(`buildFullExport({ snapshot: getSnapshot(), messages: [{ id: 'm', client_id: state.clients[1].id }], account: cloud.user, google: cloud.google, exportedAt: 'adesso' })`)));
  assert.strictEqual(fullFile.clients.length, 40);
  assert.strictEqual(fullFile.account.email, 'trainer@fitflow.test');
  assert.strictEqual(fullFile.messages[0].clientName, demo.clients[1].name);
  console.log('  ok   copia completa dei dati: tutti i messaggi, a pagine, con il nome del cliente');

  // ── 7. Eliminazione dell'account (per ultima: alla fine sul dispositivo non resta nulla) ──
  let sent = [];
  let duringRequest = null;
  let serverAnswer = () => answer(200, { ok: true, googleRevoked: null });
  const input = doc.getElementById('deleteAccountEmailInput');
  const button = doc.getElementById('deleteAccountConfirmBtn');
  sandbox.fetch = async (url, options = {}) => {
    sent.push({ url: String(url), method: options.method, auth: options.headers?.Authorization, body: JSON.parse(options.body || '{}') });
    duringRequest = { label: String(button.textContent), buttonOff: button.disabled, inputOff: input.disabled, syncOff: run('cloud.deletingAccount') };
    return serverAnswer();
  };
  const confirmBox = doc.getElementById('confirmModalBackdrop');
  const nothingWiped = () => {
    assert.strictEqual(run('state.clients.length'), 40, 'i dati in uso restano');
    assert.strictEqual(JSON.parse(localStorage.getItem('dsworld_clienti_v2')).clients.length, 40, 'i dati salvati sul dispositivo restano');
    assert.strictEqual(body.classList.contains('signed-out'), false, "si resta dentro l'app");
    assert.strictEqual(run('cloud.user.email'), 'trainer@fitflow.test');
  };

  // 7·0. Mentre un account viene eliminato non parte nessun invio e nessuno scaricamento:
  //      un salvataggio automatico partito in quel momento ricreerebbe i dati nel cloud
  //      o li riscriverebbe sul dispositivo dopo la pulizia.
  let cloudCalls = 0;
  sandbox.__cloudCall = () => { cloudCalls += 1; throw new Error('richiesta al cloud durante l\'eliminazione'); };
  run("cloud.client.from = () => __cloudCall(); cloud.hydrated = true; cloud.saveTimer = null; cloud.deletingAccount = true; setSyncMeta({ dirty: true });");
  assert.strictEqual(await run('syncStateToCloud(true)'), false, 'nessun invio');
  assert.strictEqual(await run('hydrateStateFromCloud({ announce: false })'), false, 'nessuno scaricamento');
  assert.strictEqual(await run('refreshFromCloudIfNewer({ force: true })'), false, 'nessun controllo di novità');
  assert.strictEqual(run('queueCloudSave(true); cloud.saveTimer'), null, 'nessun invio messo in coda');
  assert.strictEqual(cloudCalls, 0, "durante l'eliminazione il cloud non viene contattato");
  run("cloud.deletingAccount = false; cloud.hydrated = false; setSyncMeta({ dirty: false }); delete cloud.client.from;");

  // 7a. Doppia conferma: senza l'email giusta il pulsante resta spento e non parte nulla
  run('openDeleteAccountModal()');
  assert.strictEqual(text('deleteAccountEmailHint'), 'trainer@fitflow.test');
  assert.ok(text('deleteAccountCounts').includes('40'), 'la finestra dice quanti clienti verranno cancellati');
  assert.strictEqual(button.disabled, true, 'appena aperta la finestra il pulsante è spento');
  input.value = 'altro@fitflow.test';
  run('updateDeleteAccountButton(); requestAccountDeletion()');
  assert.strictEqual(button.disabled, true);
  assert.ok(text('deleteAccountError').includes('non corrisponde'));
  assert.strictEqual(confirmBox.classList.contains('open'), false, "con l'email sbagliata non si arriva all'ultima conferma");
  input.value = '  Trainer@FitFlow.test ';
  run('updateDeleteAccountButton()');
  assert.strictEqual(button.disabled, false, "con l'email dell'account il pulsante si accende");
  run('requestAccountDeletion()');
  assert.strictEqual(confirmBox.classList.contains('open'), true, 'prima di eliminare arriva una seconda conferma');
  assert.ok(text('confirmModalMsg').includes('Non hai scaricato una copia'), 'la conferma ricorda che la copia non è stata scaricata');
  assert.strictEqual(sent.length, 0, 'finché non si conferma non parte nessuna richiesta');
  nothingWiped();

  // 7b. Il server risponde con un errore e l'account esiste ancora: non si tocca nulla
  serverAnswer = () => answer(500, { error: 'Eliminazione account non completata' });
  await run("deleteAccountNow('trainer@fitflow.test')");
  assert.deepStrictEqual(sent, [{ url: '/.netlify/functions/delete-account', method: 'POST', auth: 'Bearer token-di-prova', body: { confirmEmail: 'trainer@fitflow.test' } }]);
  assert.ok(text('deleteAccountError').includes('non è stata completata'), "l'errore viene mostrato");
  assert.deepStrictEqual(duringRequest, { label: 'Eliminazione in corso…', buttonOff: true, inputOff: true, syncOff: true }, 'mentre la richiesta è in corso non si può premere di nuovo e i salvataggi sono fermi');
  assert.strictEqual(run('cloud.deletingAccount'), false, "eliminazione non riuscita: i salvataggi ripartono");
  assert.strictEqual(button.disabled, false, 'si può riprovare');
  assert.strictEqual(String(button.textContent), 'Elimina definitivamente');
  nothingWiped();

  // 7c. Rete assente: non si sa com'è andata, quindi non si tocca nulla
  serverAnswer = () => { throw new TypeError('Failed to fetch'); };
  sandbox.__getUser = async () => ({ data: { user: null }, error: { name: 'AuthRetryableFetchError', message: 'Failed to fetch' } });
  await run("deleteAccountNow('trainer@fitflow.test')");
  assert.ok(text('deleteAccountError').includes('Non riesco a sapere'));
  assert.strictEqual(run('cloud.deletingAccount'), false);
  nothingWiped();

  // 7d. La risposta non arriva ma l'account è stato eliminato davvero: il dispositivo va pulito lo stesso.
  //     La chiusura della sessione non riesce (rete): il login salvato va tolto comunque.
  const leftovers = () => [...localStorage._map.keys()].filter(key => key !== 'dsworld_supabase_config_v1');
  const deviceIsClean = () => {
    assert.deepStrictEqual(leftovers(), [], 'sul dispositivo non resta nessun dato');
    assert.strictEqual(run('state.clients.length + state.plans.length + state.lessons.length + state.packages.length'), 0, "nessun dato resta aperto nell'app");
    assert.strictEqual(run('cloud.user'), null, 'sessione chiusa');
    assert.strictEqual(body.classList.contains('signed-out'), true, 'si torna alla schermata di accesso');
    assert.ok(text('authMessage').startsWith('Account eliminato'), 'la schermata di accesso conferma l\'eliminazione');
  };
  localStorage.setItem('fitplanner_clienti_v1', '{"vecchi":"dati"}');
  localStorage.setItem('sb-prova-auth-token', '{"access_token":"token-di-prova"}');
  sandbox.__getUser = async () => ({ data: { user: null }, error: { code: 'user_not_found', status: 403, message: 'User from sub claim in JWT does not exist' } });
  sandbox.__signOut = async () => ({ error: { message: 'Failed to fetch' } });
  await run("deleteAccountNow('trainer@fitflow.test')");
  deviceIsClean();
  assert.ok(!text('authMessage').includes('Google'));

  // 7e. Eliminazione riuscita al primo colpo; l'accesso a Google non è stato revocato: lo si dice
  localStorage.setItem('dsworld_clienti_v2', JSON.stringify(demo));
  run("applySnapshot(JSON.parse(localStorage.getItem('dsworld_clienti_v2')));");
  logIn();
  sandbox.__signOut = async () => ({ error: null });
  serverAnswer = () => answer(200, { ok: true, googleRevoked: false });
  sent = [];
  assert.strictEqual(run('state.clients.length'), 40);
  await run("deleteAccountNow(' Trainer@FitFlow.test ')");
  assert.strictEqual(sent.length, 1);
  deviceIsClean();
  assert.ok(text('authMessage').includes('Google'), "avvisa che l'accesso a Google va tolto a mano");
  assert.strictEqual(button.disabled, true, 'a cose fatte il pulsante torna spento');
  assert.strictEqual(run('cloud.deletingAccount'), false);
  assert.strictEqual(String(input.value), '');
  console.log("  ok   eliminazione account: doppia conferma, errori segnalati, dispositivo pulito e ritorno all'accesso");

  console.log('\nAvvio e schermate: tutte le prove superate');
  process.exit(0);
})().catch(error => {
  console.error('  NO   ' + (error.stack || error));
  process.exit(1);
});
