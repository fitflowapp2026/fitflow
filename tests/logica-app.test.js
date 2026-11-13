// Prova la logica dell'app che non ha bisogno del browser, eseguendo le VERE
// funzioni di app.html (estratte tra i segnaposto "prova:...").
// uso: node tests/logica-app.test.js
'use strict';
const fs = require('fs');
const path = require('path');
const vm = require('vm');
const assert = require('assert');

const root = process.argv[2] || path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'app.html'), 'utf8');

function extract(name) {
  const start = html.indexOf(`/* prova:${name}:inizio */`);
  const end = html.indexOf(`/* prova:${name}:fine */`);
  assert.ok(start >= 0 && end > start, `segnaposto prova:${name} non trovati in app.html`);
  return html.slice(start, end);
}

const sandbox = {};
vm.createContext(sandbox);
vm.runInContext(`${extract('unione')}\n${extract('telefono')}\nthis.api = { mergeSnapshots, mergeCollection, mergeIdList, mergeSettings, stableStringify, normalizeItalianPhone };`, sandbox);
const { mergeSnapshots, stableStringify, normalizeItalianPhone } = sandbox.api;
vm.runInContext(`${extract('dati-completi')}\nthis.dati = { buildFullExport, emailMatchesAccount };`, sandbox);
const { buildFullExport, emailMatchesAccount } = sandbox.dati;

const tests = [];
const test = (title, fn) => tests.push([title, fn]);
// Array.from: gli elenchi creati dentro la sandbox vanno riportati in questo contesto per il confronto
const ids = list => Array.from(list, item => item.id).sort();
const plain = value => JSON.parse(JSON.stringify(value));

const base = () => ({
  clients: [{ id: 'c1', firstName: 'Anna', notes: '' }, { id: 'c2', firstName: 'Bruno', notes: '' }, { id: 'c3', firstName: 'Carla', notes: '' }],
  packages: [{ id: 'k1', name: 'Base 12', lessonsTotal: 12 }],
  plans: [{ id: 'p1', clientId: 'c1', packageId: 'k1' }, { id: 'p2', clientId: 'c2', packageId: 'k1' }, { id: 'p3', clientId: 'c3', packageId: 'k1' }],
  lessons: [
    { id: 'l1', clientId: 'c1', planId: 'p1', date: '2026-11-20', time: '10:00', status: 'scheduled' },
    { id: 'l2', clientId: 'c2', planId: 'p2', date: '2026-11-21', time: '11:00', status: 'scheduled' },
    { id: 'l3', clientId: 'c3', planId: 'p3', date: '2026-11-22', time: '12:00', status: 'scheduled' }
  ],
  selectedClientId: 'c1',
  viewDate: '2026-11-01',
  dismissedAlerts: ['payment_c1_unpaid', 'renewal_c2_3'],
  settings: { trainerName: 'Marco', studioName: 'Studio Uno' }
});

test('aggiunte fatte su due dispositivi restano entrambe', () => {
  const local = base(), remote = base();
  local.clients.push({ id: 'cL', firstName: 'Locale' });
  local.lessons.push({ id: 'lL', clientId: 'c1', planId: 'p1', date: '2026-11-25', time: '09:00', status: 'scheduled' });
  remote.clients.push({ id: 'cR', firstName: 'Remoto' });
  remote.lessons.push({ id: 'lR', clientId: 'c2', planId: 'p2', date: '2026-11-26', time: '09:00', status: 'scheduled' });
  const merged = mergeSnapshots(base(), local, remote);
  assert.deepStrictEqual(ids(merged.clients), ['c1', 'c2', 'c3', 'cL', 'cR']);
  assert.deepStrictEqual(ids(merged.lessons), ['l1', 'l2', 'l3', 'lL', 'lR']);
});

test('ciò che è stato eliminato da una parte non ricompare', () => {
  const local = base(), remote = base();
  local.lessons = local.lessons.filter(l => l.id !== 'l1');   // eliminata qui
  remote.lessons = remote.lessons.filter(l => l.id !== 'l2'); // eliminata sull'altro dispositivo
  const merged = mergeSnapshots(base(), local, remote);
  assert.deepStrictEqual(ids(merged.lessons), ['l3']);
});

test('modifiche diverse: vale chi ha modificato; se entrambi, vale questo dispositivo', () => {
  const local = base(), remote = base();
  local.clients[0].notes = 'nota locale';          // c1 cambiato solo qui
  remote.clients[1].notes = 'nota remota';         // c2 cambiato solo sull'altro
  local.lessons[2].status = 'done';                // l3 cambiata da entrambi
  remote.lessons[2].status = 'cancelled';
  const merged = mergeSnapshots(base(), local, remote);
  assert.strictEqual(merged.clients.find(c => c.id === 'c1').notes, 'nota locale');
  assert.strictEqual(merged.clients.find(c => c.id === 'c2').notes, 'nota remota');
  assert.strictEqual(merged.lessons.find(l => l.id === 'l3').status, 'done');
});

test('un elemento eliminato altrove ma modificato qui viene tenuto', () => {
  const local = base(), remote = base();
  local.clients[2].notes = 'lavoro in corso';
  remote.clients = remote.clients.filter(c => c.id !== 'c3');
  const merged = mergeSnapshots(base(), local, remote);
  assert.ok(merged.clients.some(c => c.id === 'c3'), 'il lavoro fatto qui non si perde');
});

test('cliente eliminato altrove: spariscono anche piani e lezioni, comprese quelle nuove', () => {
  const local = base(), remote = base();
  local.lessons.push({ id: 'lNew', clientId: 'c2', planId: 'p2', date: '2026-11-28', time: '10:00', status: 'scheduled' });
  remote.clients = remote.clients.filter(c => c.id !== 'c2');
  remote.plans = remote.plans.filter(p => p.clientId !== 'c2');
  remote.lessons = remote.lessons.filter(l => l.clientId !== 'c2');
  const merged = mergeSnapshots(base(), local, remote);
  assert.ok(!merged.clients.some(c => c.id === 'c2'));
  assert.ok(!merged.plans.some(p => p.clientId === 'c2'));
  assert.ok(!merged.lessons.some(l => l.clientId === 'c2'), 'nessuna lezione senza cliente');
});

test("l'ordine dei campi non conta come modifica (il database li riordina)", () => {
  const local = base(), remote = base();
  remote.clients = remote.clients.map(c => ({ notes: c.notes, firstName: c.firstName, id: c.id }));
  remote.clients[0].firstName = 'Anna Maria';
  const merged = mergeSnapshots(base(), local, remote);
  assert.strictEqual(merged.clients.find(c => c.id === 'c1').firstName, 'Anna Maria', 'invariato qui → vale la versione del cloud');
  assert.strictEqual(stableStringify({ b: 1, a: [2, { d: 3, c: 4 }] }), stableStringify({ a: [2, { c: 4, d: 3 }], b: 1 }));
});

test('senza versione di partenza non si perde nulla (unione semplice)', () => {
  const local = base(), remote = base();
  local.clients = local.clients.filter(c => c.id !== 'c3');
  local.plans = local.plans.filter(p => p.clientId !== 'c3');
  local.lessons = local.lessons.filter(l => l.clientId !== 'c3');
  local.clients[0].notes = 'locale';
  remote.clients[0].notes = 'remoto';
  remote.clients.push({ id: 'cR', firstName: 'Remoto' });
  const merged = mergeSnapshots(null, local, remote);
  assert.deepStrictEqual(ids(merged.clients), ['c1', 'c2', 'c3', 'cR']);
  assert.strictEqual(merged.clients.find(c => c.id === 'c1').notes, 'locale');
});

test('avvisi chiusi e impostazioni si uniscono campo per campo', () => {
  const local = base(), remote = base();
  local.dismissedAlerts = ['payment_c1_unpaid', 'followup_c3_x'];   // tolto renewal_c2_3, aggiunto followup
  remote.dismissedAlerts = ['payment_c1_unpaid', 'renewal_c2_3', 'check_c1_12'];
  local.settings.studioName = 'Studio Due';
  remote.settings.trainerName = 'Marco R.';
  remote.settings.waTemplate = 'Ciao {nome}';
  const merged = mergeSnapshots(base(), local, remote);
  assert.deepStrictEqual(plain(merged.dismissedAlerts).sort(), ['check_c1_12', 'followup_c3_x', 'payment_c1_unpaid']);
  assert.deepStrictEqual(plain(merged.settings), { trainerName: 'Marco R.', studioName: 'Studio Due', waTemplate: 'Ciao {nome}' });
  assert.strictEqual(merged.selectedClientId, 'c1');
});

test('dati mancanti o vuoti non fanno cadere l\'unione', () => {
  const merged = mergeSnapshots(null, {}, {});
  assert.deepStrictEqual(plain(merged.clients), []);
  assert.deepStrictEqual(plain(merged.lessons), []);
  const onlyRemote = mergeSnapshots(null, { clients: [] }, base());
  assert.strictEqual(onlyRemote.clients.length, 3);
});

test('numeri di telefono: prefisso +39 sempre corretto', () => {
  assert.strictEqual(normalizeItalianPhone('333 1234567'), '393331234567');
  assert.strictEqual(normalizeItalianPhone('3921234567'), '393921234567', 'cellulare che inizia per 39x');
  assert.strictEqual(normalizeItalianPhone('+39 333 123 4567'), '393331234567');
  assert.strictEqual(normalizeItalianPhone('0039 333 1234567'), '393331234567');
  assert.strictEqual(normalizeItalianPhone('393331234567'), '393331234567', 'prefisso già presente, senza +');
  assert.strictEqual(normalizeItalianPhone('+44 7700 900123'), '447700900123', 'numero estero lasciato com\'è');
});

test('copia completa dei dati: clienti, piani, lezioni, pacchetti, impostazioni e tutti i messaggi', () => {
  const messages = [
    { id: 'm1', user_id: 'u1', client_id: 'c1', client_token: 'tok1', sender: 'client', text: 'Ciao', type: 'message', read: true, created_at: '2026-11-01T10:00:00Z' },
    { id: 'm2', user_id: 'u1', client_id: 'c1', client_token: 'tok1', sender: 'trainer', text: 'A domani', type: 'message', read: false, created_at: '2026-11-01T10:05:00Z' },
    { id: 'm3', user_id: 'u1', client_id: 'eliminato', client_token: 'tok9', sender: 'client', text: 'Vecchio messaggio', type: 'message', read: true, created_at: '2026-10-01T09:00:00Z' }
  ];
  const file = plain(buildFullExport({
    snapshot: base(),
    messages,
    account: { id: 'u1', email: 'trainer@test', created_at: '2026-01-01T00:00:00Z' },
    google: { connected: true, calendarName: 'FitFlow Clienti', googleEmail: 'trainer@gmail.test', lastError: 'x' },
    exportedAt: '2026-11-13T08:00:00.000Z'
  }));
  assert.deepStrictEqual(file.clients, base().clients);
  assert.deepStrictEqual(file.plans, base().plans);
  assert.deepStrictEqual(file.lessons, base().lessons);
  assert.deepStrictEqual(file.packages, base().packages);
  assert.deepStrictEqual(file.settings, base().settings);
  assert.deepStrictEqual(file.dismissedAlerts, base().dismissedAlerts);
  assert.strictEqual(file.messages.length, 3, 'tutti i messaggi, anche quelli di un cliente non più presente');
  assert.deepStrictEqual(file.messages.map(m => m.text), ['Ciao', 'A domani', 'Vecchio messaggio']);
  assert.deepStrictEqual(file.messages.map(m => m.clientName), ['Anna', 'Anna', ''], 'ogni messaggio riporta il nome del cliente');
  assert.strictEqual(file.messages[0].sender, 'client', 'i campi originali del messaggio restano');
  assert.deepStrictEqual(file.account, { email: 'trainer@test', userId: 'u1', createdAt: '2026-01-01T00:00:00Z' });
  assert.deepStrictEqual(file.googleCalendar, { connected: true, calendarName: 'FitFlow Clienti', googleEmail: 'trainer@gmail.test' });
  assert.strictEqual(file.exportedAt, '2026-11-13T08:00:00.000Z');
  // Stesse voci del backup: il file si può anche reimportare con "Importa"
  for (const key of ['clients', 'packages', 'plans', 'lessons']) assert.ok(Array.isArray(file[key]), key);
});

test('copia completa dei dati: dati mancanti non la fanno cadere', () => {
  const file = plain(buildFullExport({ snapshot: {}, messages: null, account: null, google: null, exportedAt: 'x' }));
  assert.deepStrictEqual([file.clients, file.plans, file.lessons, file.packages, file.messages, file.dismissedAlerts], [[], [], [], [], [], []]);
  assert.deepStrictEqual(file.settings, {});
  assert.deepStrictEqual(file.account, { email: '', userId: '', createdAt: '' });
  assert.strictEqual(file.googleCalendar.connected, false);
});

test("eliminazione account: la conferma vale solo con l'email dell'account", () => {
  assert.strictEqual(emailMatchesAccount('trainer@test', 'trainer@test'), true);
  assert.strictEqual(emailMatchesAccount('  Trainer@TEST ', 'trainer@test'), true, 'maiuscole e spazi attorno non contano');
  assert.strictEqual(emailMatchesAccount('trainer@test.it', 'trainer@test'), false);
  assert.strictEqual(emailMatchesAccount('trainer@tes', 'trainer@test'), false);
  assert.strictEqual(emailMatchesAccount('', 'trainer@test'), false);
  assert.strictEqual(emailMatchesAccount('', ''), false, "senza email dell'account non si conferma nulla");
  assert.strictEqual(emailMatchesAccount(undefined, undefined), false);
});

let failed = 0;
for (const [title, fn] of tests) {
  try { fn(); console.log('  ok   ' + title); }
  catch (error) { failed++; console.error('  NO   ' + title + '\n       ' + (error.message || error)); }
}
if (failed) { console.error(`\n${failed} prove fallite`); process.exit(1); }
console.log(`\nTutte le ${tests.length} prove superate`);
