#!/usr/bin/env node
/**
 * DSWORLD — extract.js  v2
 * ─────────────────────────────────────────────────────────────
 * Legge app.html e scrive automaticamente tutti i file src/.
 * Genera anche shell.html corretto e applica i bug fix noti.
 *
 * USO (una volta sola):
 *   node extract.js
 *
 * Poi verifica:
 *   node build.js && open app.html
 */

'use strict';

const fs   = require('fs');
const path = require('path');

const ROOT       = __dirname;
const APP_HTML   = path.join(ROOT, 'app.html');
const APP_SOURCE = path.join(ROOT, 'app.source.html');
const SRC        = path.join(ROOT, 'src');

// Usa app.source.html come sorgente (immutabile).
// build.js sovrascrive solo app.html, mai app.source.html.
if (!fs.existsSync(APP_SOURCE)) {
  if (!fs.existsSync(APP_HTML)) {
    console.error('X  app.html non trovato.'); process.exit(1);
  }
  fs.copyFileSync(APP_HTML, APP_SOURCE);
  console.log('ok  app.source.html creato (sorgente originale)');
} else {
  console.log('--  Usando app.source.html');
}
const raw   = fs.readFileSync(APP_SOURCE, 'utf8');
const lines = raw.split('\n');

/* -- Helper: righe [from, to] 1-indexed inclusivo ----------- */
function L(from, to) {
  return lines.slice(from - 1, to).join('\n');
}

/* -- Helper: scrive file, crea dir, rimuove indent 4sp ------- */
function write(relPath, content) {
  const abs = path.join(SRC, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const cleaned = content.replace(/^    /gm, '');
  fs.writeFileSync(abs, cleaned.trimEnd() + '\n', 'utf8');
  const kb = (Buffer.byteLength(cleaned, 'utf8') / 1024).toFixed(1);
  console.log(`  ok  src/${relPath.padEnd(42)} ${kb.padStart(6)} KB`);
}

/* -- Helper: scrive senza rimuovere indent ------------------ */
function writeRaw(relPath, content) {
  const abs = path.join(SRC, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, content.trimEnd() + '\n', 'utf8');
  const kb = (Buffer.byteLength(content, 'utf8') / 1024).toFixed(1);
  console.log(`  ok  src/${relPath.padEnd(42)} ${kb.padStart(6)} KB`);
}

/* -- Helper: estrae blocco HTML per id ---------------------- */
function extractById(id) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`id="${id}"`)) { start = i; break; }
  }
  if (start === -1) return `<!-- MISSING: #${id} -->`;
  const tagMatch = lines[start].match(/<(\w+)/);
  const tag = tagMatch ? tagMatch[1] : 'div';
  let depth = 0, end = start;
  const reOpen  = new RegExp(`<${tag}[\\s>/]`, 'g');
  const reClose = new RegExp(`</${tag}>`, 'g');
  for (let i = start; i < lines.length; i++) {
    depth += (lines[i].match(reOpen)  || []).length;
    depth -= (lines[i].match(reClose) || []).length;
    if (i > start && depth <= 0) { end = i; break; }
  }
  return lines.slice(start, end + 1).join('\n');
}

/* ============================================================
   STEP 1 — CSS
   Ordine identico all'originale (nessun gap, nessun overlap)
   ============================================================ */
console.log('\n[1/6] CSS...');

const CSS_SPLITS = [
  ['css/variables.css',   30,   49],
  ['css/base.css',        50,  184],
  ['css/messages.css',   185,  292],
  ['css/layout.css',     293,  583],
  ['css/calendar.css',   584,  712],
  ['css/hero.css',       713,  898],
  ['css/modals.css',     899, 1464],
  ['css/forms.css',     1465, 2119],
  ['css/animations.css',2120, 2415],
  ['css/mobile.css',    2416, 3143],
];

for (const [relPath, from, to] of CSS_SPLITS) write(relPath, L(from, to));

/* ============================================================
   STEP 2 — HTML
   ============================================================ */
console.log('\n[2/6] HTML...');

write('html/auth.html', extractById('authShell'));

/* drawer = overlay + sidebar + bottom nav */
{
  const overlay = extractById('drawerOverlay');
  const sidebar = extractById('sidebarDrawer');
  let bnStart = -1, bnEnd = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="bottomNav"')) { bnStart = i; break; }
  }
  if (bnStart !== -1) {
    let d = 0;
    for (let i = bnStart; i < lines.length; i++) {
      d += (lines[i].match(/<nav[\s>]/g)||[]).length
         - (lines[i].match(/<\/nav>/g)||[]).length;
      if (i > bnStart && d <= 0) { bnEnd = i; break; }
    }
  }
  const bnav = bnStart !== -1 ? lines.slice(bnStart, bnEnd + 1).join('\n') : '';
  write('html/drawer.html', [overlay, sidebar, bnav].join('\n\n'));
}

/* app-layout = skip-link + div#mainApp */
{
  let skipLine = '';
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('class="skip-link"')) { skipLine = lines[i]; break; }
  }
  write('html/app-layout.html', skipLine + '\n\n' + extractById('mainApp'));
}

/* Modal singoli */
for (const [relPath, id] of [
  ['html/modal-messages.html',     'messagesModalBackdrop'],
  ['html/modal-client.html',       'clientModalBackdrop'],
  ['html/modal-packages.html',     'packagesModalBackdrop'],
  ['html/modal-lesson.html',       'lessonModalBackdrop'],
  ['html/modal-day.html',          'dayModalBackdrop'],
  ['html/modal-time.html',         'timeModalBackdrop'],
  ['html/modal-renew.html',        'renewModalBackdrop'],
  ['html/modal-report.html',       'reportModalBackdrop'],
  ['html/modal-confirm.html',      'confirmModalBackdrop'],
  ['html/modal-fsc.html',          'fscBackdrop'],
  ['html/modal-month-picker.html', 'mpBackdrop'],
]) write(relPath, extractById(id));

/* modal-account = password + account + hidden inputs */
{
  const pw      = extractById('passwordUpdateModalBackdrop');
  const account = extractById('accountModalBackdrop');
  let extra = '';
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="calendarQuickSearch"')) { extra = lines[i]; break; }
  }
  write('html/modal-account.html', [pw, account, extra].join('\n\n'));
}

/* modal-misc = 4 modal operativi */
write('html/modal-misc.html',
  ['completamentoModalBackdrop','paymentQuickModalBackdrop',
   'operazioniModalBackdrop','atRiskModalBackdrop']
  .map(extractById).join('\n\n'));

/* ============================================================
   STEP 3 — JavaScript
   ============================================================ */
console.log('\n[3/6] JavaScript...');

const JS_SPLITS = [
  ['js/constants.js',            4108, 4155],
  ['js/state.js',                4156, 4363],
  ['js/utils.js',                4364, 4479],
  ['js/data-helpers-a.js',       4480, 4695],
  ['js/storage.js',              4696, 4868],
  ['js/cloud-sync.js',           4869, 5119],
  ['js/google-calendar.js',      5120, 5426],
  ['js/data-helpers-b.js',       5427, 6125],
  ['js/data-helpers-c.js',       6126, 6463],
  ['js/render-client-modal.js',  6464, 6619],
  ['js/render-packages.js',      6620, 6653],
  ['js/render-hero.js',          6654, 6738],
  ['js/render-ops-modals.js',    6739, 6938],
  ['js/render-selected-client.js',6939,7182],
  ['js/render-clients.js',       7183, 7368],
  ['js/render-calendar.js',      7369, 7921],
  ['js/lesson-actions.js',       7922, 8217],
  ['js/renew-report-auth.js',    8218, 8696],
  ['js/render-all.js',           8697, 8720],
  ['js/actions.js',              8721, 9218],
  ['js/pwa.js',                  9219, 9639],
  ['js/init.js',                 9640, 9727],
  ['js/mobile-ui.js',            9728, 9840],
  ['js/realtime.js',             9841, 9977],
  ['js/render-messages.js',      9978,10339],
  ['js/misc.js',                10340,10420],
];

for (const [relPath, from, to] of JS_SPLITS) write(relPath, L(from, to));

/* ============================================================
   STEP 4 — Bug fix automatici
   ============================================================ */
console.log('\n[4/6] Bug fix...');

function patch(relPath, desc, search, replace) {
  const abs = path.join(SRC, relPath);
  if (!fs.existsSync(abs)) { console.log(`  --  ${relPath} mancante, skip`); return; }
  let c = fs.readFileSync(abs, 'utf8');
  if (!c.includes(search)) { console.log(`  --  pattern non trovato: ${desc}`); return; }
  fs.writeFileSync(abs, c.replace(search, replace), 'utf8');
  console.log(`  ok  ${desc}`);
}

/* FIX 1: gap duplicato in .messages-sidebar */
patch('css/messages.css',
  'CSS: rimuove gap:1px duplicato in .messages-sidebar',
  'gap: 1px;\n  overflow-y: auto;\n  border-right: 1px solid rgba(255,255,255,0.07);\n  background: rgba(255,255,255,0.02);\n  padding: 8px;\n  gap: 6px;',
  'overflow-y: auto;\n  border-right: 1px solid rgba(255,255,255,0.07);\n  background: rgba(255,255,255,0.02);\n  padding: 8px;\n  gap: 6px;'
);

/* FIX 2: clientPortalUrl piu robusta */
patch('js/utils.js',
  "JS: clientPortalUrl usa pathname split",
  "function clientPortalUrl(token) {\n  const base = window.location.origin + window.location.pathname.replace('app.html','').replace('index.html','') + 'client.html';",
  "function clientPortalUrl(token) {\n  const dir  = window.location.pathname.replace(/\\/[^\\/]*$/, '/');\n  const base = window.location.origin + dir + 'client.html';"
);

/* FIX 3: sendMsgChatReply doppia fetch — sostituisce tutte le occorrenze */
{
  const abs = require('path').join(SRC, 'js/render-messages.js');
  if (require('fs').existsSync(abs)) {
    let c = require('fs').readFileSync(abs, 'utf8');
    const old3 = "showToast('Risposta inviata!', 'ok');\n    openMsgChat(client);\n    loadClientMessages(client);";
    const new3 = "showToast('Risposta inviata!', 'ok');\n    /* FIX: una sola fetch */\n    loadClientMessages(client);";
    const n = (c.match(new RegExp(old3.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
    c = c.split(old3).join(new3);
    require('fs').writeFileSync(abs, c, 'utf8');
    console.log('  ok  JS: sendMsgChatReply rimuove openMsgChat duplicata (' + n + ' occorrenze)');
  }
}

/* FIX 4: autoCompleteElapsedLessons fuori da renderAll */
patch('js/render-all.js',
  'JS: rimuove autoCompleteElapsedLessons da renderAll',
  "  try { autoCompleteElapsedLessons(); } catch(e) { console.error(e); }\n",
  "  /* autoComplete gestita da scheduleNextAutoComplete in init.js */\n"
);

/* FIX 5: debounce su refreshUnreadMessages */
patch('js/realtime.js',
  'JS: aggiunge _debouncedRefreshUnread',
  "async function refreshUnreadMessages() {",
  "const _debouncedRefreshUnread = (function(){\n  let t; return function(){ clearTimeout(t); t = setTimeout(refreshUnreadMessages, 200); };\n})();\n\nasync function refreshUnreadMessages() {"
);

/* ============================================================
   STEP 5 — Genera shell.html con ordine preciso
   ============================================================ */
console.log('\n[5/6] shell.html...');

/* Estrai head originale senza il blocco <style> */
let headLines = [];
for (let i = 0; i < lines.length; i++) {
  if (lines[i].trim() === '</head>') break;
  headLines.push(lines[i]);
}
const headNoStyle = headLines.join('\n')
  .replace(/\s*<style>[\s\S]*?<\/style>/, '');

/* ExcelJS loader inline (righe 4094-4106 originale) */
const excelLoader = L(4094, 4106).replace(/^    /gm, '  ');

const cssBlock = CSS_SPLITS.map(([p]) => `/* @@include src/${p} */`).join('\n');
const jsBlock  = JS_SPLITS.map(([p]) => `// @@include src/${p}`).join('\n');

const shellHtml = `${headNoStyle}
  <style>
${cssBlock}
  </style>
</head>
<body class="signed-out">

<!-- @@include src/html/auth.html -->
<!-- @@include src/html/drawer.html -->
<!-- @@include src/html/modal-messages.html -->
<!-- @@include src/html/modal-client.html -->
<!-- @@include src/html/modal-packages.html -->
<!-- @@include src/html/modal-lesson.html -->
<!-- @@include src/html/modal-day.html -->
<!-- @@include src/html/modal-time.html -->
<!-- @@include src/html/modal-renew.html -->
<!-- @@include src/html/modal-report.html -->
<!-- @@include src/html/modal-account.html -->
<!-- @@include src/html/modal-misc.html -->
<!-- @@include src/html/modal-confirm.html -->
<!-- @@include src/html/modal-fsc.html -->
<!-- @@include src/html/modal-month-picker.html -->
<!-- @@include src/html/app-layout.html -->

  <div class="toast" id="toast" role="status" aria-live="polite" aria-atomic="true"></div>

${excelLoader}

  <!-- Supabase JS: carica da CDN, con fallback automatico -->
  <script>
    (function () {
      function tryLoad(urls, idx) {
        if (idx >= urls.length) {
          console.error('[DSWORLD] Impossibile caricare supabase-js.');
          return;
        }
        var s = document.createElement('script');
        s.src = urls[idx];
        s.onerror = function () {
          document.head.removeChild(s);
          tryLoad(urls, idx + 1);
        };
        document.head.appendChild(s);
      }
      tryLoad([
        'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2',
        'https://unpkg.com/@supabase/supabase-js@2',
        'https://esm.sh/@supabase/supabase-js@2'
      ], 0);
    })();
  </script>

  <script>
${jsBlock}
  </script>

</body>
</html>
`;

writeRaw('html/shell.html', shellHtml);

/* ============================================================
   STEP 6 — File di configurazione progetto
   ============================================================ */
console.log('\n[6/6] Config files...');

/* netlify.toml — build automatico prima di ogni deploy */
fs.writeFileSync(path.join(ROOT, 'netlify.toml'),
`# DSWORLD — Netlify esegue "node build.js" prima di ogni deploy
[build]
  command   = "node build.js"
  publish   = "."

[build.environment]
  NODE_VERSION = "18"
`, 'utf8');
console.log('  ok  netlify.toml');

/* .gitignore */
fs.writeFileSync(path.join(ROOT, '.gitignore'),
`node_modules/

# app.html e' generato da build.js — non modificare a mano
app.html
`, 'utf8');
console.log('  ok  .gitignore');

/* package.json */
fs.writeFileSync(path.join(ROOT, 'package.json'),
JSON.stringify({
  name: 'dsworld',
  version: '1.0.0',
  private: true,
  scripts: {
    build: 'node build.js',
    dev:   'node build.js --watch',
    extract: 'node extract.js'
  },
  engines: { node: '>=16' }
}, null, 2) + '\n', 'utf8');
console.log('  ok  package.json');

/* ============================================================
   RIEPILOGO FINALE
   ============================================================ */
console.log(`
==================================================
  Estrazione completata!
  ${CSS_SPLITS.length} CSS  |  16 HTML  |  ${JS_SPLITS.length} JS  |  5 bug fix
==================================================

  Verifica:
    node build.js          <- ricostruisce app.html
    npm run dev            <- watch (ricostruisce ad ogni salvataggio)

  Deploy su Netlify:
    git add . && git push  <- Netlify chiama "node build.js" in automatico
    (niente configurazione extra — netlify.toml e' gia' fatto)
==================================================
`);
