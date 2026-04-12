#!/usr/bin/env node
/**
 * DSWORLD — extract.js
 * Legge app_source.html e genera src/ completo.
 * Esegui UNA SOLA VOLTA: node extract.js
 * Poi usa: node build.js  (oppure npm run dev)
 */
'use strict';
const fs   = require('fs');
const path = require('path');

const ROOT   = __dirname;
const SOURCE = path.join(ROOT, 'app_source.html');
const SRC    = path.join(ROOT, 'src');

if (!fs.existsSync(SOURCE)) {
  console.error('ERRORE: app_source.html non trovato.');
  process.exit(1);
}

const raw   = fs.readFileSync(SOURCE, 'utf8');
const lines = raw.split('\n');
console.log(`Sorgente: ${lines.length} righe\n`);

// Scrive un file, strippando l'indentazione di 4 spazi
function W(relPath, content) {
  const abs = path.join(SRC, relPath);
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  const out = content.split('\n').map(l => l.startsWith('    ') ? l.slice(4) : l).join('\n');
  fs.writeFileSync(abs, out.trimEnd() + '\n', 'utf8');
  const kb = (fs.statSync(abs).size / 1024).toFixed(1);
  process.stdout.write(`  ok  src/${relPath.padEnd(40)} ${kb.padStart(6)} KB\n`);
}

// Righe [from, to] 1-indexed inclusive
function L(from, to) {
  return lines.slice(from - 1, to).join('\n');
}

// Estrae un blocco HTML per id
function byId(id) {
  let start = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes(`id="${id}"`)) { start = i; break; }
  }
  if (start === -1) return `<!-- MISSING: ${id} -->`;
  const tagMatch = lines[start].match(/<(\w+)/);
  const tag = tagMatch ? tagMatch[1] : 'div';
  const reO = new RegExp(`<${tag}[\\s>/]`, 'g');
  const reC = new RegExp(`</${tag}>`, 'g');
  let depth = 0, end = start;
  for (let i = start; i < lines.length; i++) {
    depth += (lines[i].match(reO) || []).length;
    depth -= (lines[i].match(reC) || []).length;
    if (i > start && depth <= 0) { end = i; break; }
  }
  return lines.slice(start, end + 1).join('\n');
}

// ── CSS ────────────────────────────────────────────────────────
console.log('[1/5] CSS...');
const CSS = [
  ['css/variables.css',   30,   49],
  ['css/base.css',        50,  184],
  ['css/messages.css',   185,  292],
  ['css/layout.css',     293,  583],
  ['css/calendar.css',   584,  712],
  ['css/hero.css',       713,  898],
  ['css/modals.css',     899, 1464],
  ['css/forms.css',     1465, 2118],
  ['css/animations.css',2119, 2414],
  ['css/mobile.css',    2415, 3142],
];
CSS.forEach(([p, s, e]) => W(p, L(s, e)));

// ── HTML ───────────────────────────────────────────────────────
console.log('\n[2/5] HTML...');
W('html/auth.html', byId('authShell'));

// drawer = overlay + sidebar + bottomNav
{
  const overlay = byId('drawerOverlay');
  const sidebar = byId('sidebarDrawer');
  let ns = -1, ne = -1;
  for (let i = 0; i < lines.length; i++) {
    if (lines[i].includes('id="bottomNav"')) { ns = i; break; }
  }
  if (ns !== -1) {
    let d = 0;
    for (let i = ns; i < lines.length; i++) {
      d += (lines[i].match(/<nav[\s>]/g) || []).length;
      d -= (lines[i].match(/<\/nav>/g) || []).length;
      if (i > ns && d <= 0) { ne = i; break; }
    }
  }
  const bnav = ns !== -1 ? lines.slice(ns, ne + 1).join('\n') : '';
  W('html/drawer.html', [overlay, sidebar, bnav].join('\n\n'));
}

{
  const skip = lines.find(l => l.includes('class="skip-link"')) || '';
  W('html/app-layout.html', skip + '\n\n' + byId('mainApp'));
}

[
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
].forEach(([p, id]) => W(p, byId(id)));

{
  const extra = lines.find(l => l.includes('id="calendarQuickSearch"')) || '';
  W('html/modal-account.html',
    byId('passwordUpdateModalBackdrop') + '\n\n' +
    byId('accountModalBackdrop') + '\n\n' + extra);
}

W('html/modal-misc.html',
  ['completamentoModalBackdrop','paymentQuickModalBackdrop',
   'operazioniModalBackdrop','atRiskModalBackdrop'].map(byId).join('\n\n'));

// ── JS ─────────────────────────────────────────────────────────
console.log('\n[3/5] JavaScript...');
// IMPORTANTE: initApp e' alla riga 9639 — va in init.js, NON in pwa.js
const JS = [
  ['js/constants.js',            4107, 4154],
  ['js/state.js',                4155, 4362],
  ['js/utils.js',                4363, 4478],
  ['js/data-helpers-a.js',       4479, 4694],
  ['js/storage.js',              4695, 4867],
  ['js/cloud-sync.js',           4868, 5118],
  ['js/google-calendar.js',      5119, 5425],
  ['js/data-helpers-b.js',       5426, 6124],
  ['js/data-helpers-c.js',       6125, 6462],
  ['js/render-client-modal.js',  6463, 6618],
  ['js/render-packages.js',      6619, 6652],
  ['js/render-hero.js',          6653, 6737],
  ['js/render-ops-modals.js',    6738, 6937],
  ['js/render-selected-client.js',6938,7181],
  ['js/render-clients.js',       7182, 7367],
  ['js/render-calendar.js',      7368, 7920],
  ['js/lesson-actions.js',       7921, 8216],
  ['js/renew-report-auth.js',    8217, 8695],
  ['js/render-all.js',           8696, 8719],
  ['js/actions.js',              8720, 9217],
  ['js/pwa.js',                  9218, 9638], // finisce riga 9638, PRIMA di initApp
  ['js/init.js',                 9639, 9726], // initApp parte qui (riga 9639)
  ['js/mobile-ui.js',            9727, 9839],
  ['js/realtime.js',             9840, 9976],
  ['js/render-messages.js',      9977,10338],
  ['js/misc.js',                10339,10419],
];
JS.forEach(([p, s, e]) => W(p, L(s, e)));

// ── shell.html ─────────────────────────────────────────────────
console.log('\n[4/5] shell.html...');
{
  let headLines = [];
  for (const line of lines) {
    if (line.trim() === '</head>') break;
    headLines.push(line);
  }
  const head = headLines.join('\n').replace(/\s*<style>[\s\S]*?<\/style>/, '');
  const cssInc = CSS.map(([p]) => `/* @@include src/${p} */`).join('\n');
  const jsInc  = JS.map(([p])  => `// @@include src/${p}`)  .join('\n');
  // ExcelJS loader (righe 4093-4105)
  const excel = L(4093, 4105).replace(/^    /gm, '  ');

  const shell = `${head}
  <style>
${cssInc}
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

${excel}

  <!-- Supabase JS: carica da CDN, avvio tramite waitForSupabase in misc.js -->
  <script>
    (function () {
      function tryLoad(urls, idx) {
        if (idx >= urls.length) { console.error('[DSWORLD] supabase-js non caricato.'); return; }
        var s = document.createElement('script');
        s.src = urls[idx];
        s.onerror = function () { document.head.removeChild(s); tryLoad(urls, idx + 1); };
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
${jsInc}
  </script>

</body>
</html>
`;
  const abs = path.join(SRC, 'html', 'shell.html');
  fs.mkdirSync(path.dirname(abs), { recursive: true });
  fs.writeFileSync(abs, shell.trimEnd() + '\n', 'utf8');
  const kb = (fs.statSync(abs).size / 1024).toFixed(1);
  console.log(`  ok  src/html/shell.html${' '.repeat(27)} ${kb.padStart(6)} KB`);
}

// ── Config files ───────────────────────────────────────────────
console.log('\n[5/5] Config files...');
fs.writeFileSync(path.join(ROOT, 'netlify.toml'),
`# DSWORLD — Netlify esegue "node build.js" prima di ogni deploy
[build]
  command   = "node build.js"
  publish   = "."

[build.environment]
  NODE_VERSION = "18"
`, 'utf8');
console.log('  ok  netlify.toml');

fs.writeFileSync(path.join(ROOT, '.gitignore'),
`node_modules/
# app.html e' generato da build.js
app.html
`, 'utf8');
console.log('  ok  .gitignore');

fs.writeFileSync(path.join(ROOT, 'package.json'),
JSON.stringify({
  name: 'dsworld', version: '1.0.0', private: true,
  scripts: { build: 'node build.js', dev: 'node build.js --watch' },
  engines: { node: '>=16' }
}, null, 2) + '\n', 'utf8');
console.log('  ok  package.json');

// ── Verifica finale ────────────────────────────────────────────
console.log('\n── Verifica ──────────────────────────────────────');
const pwa  = fs.readFileSync(path.join(SRC, 'js/pwa.js'), 'utf8');
const init = fs.readFileSync(path.join(SRC, 'js/init.js'), 'utf8');
const mob  = fs.readFileSync(path.join(SRC, 'js/mobile-ui.js'), 'utf8');
const css  = fs.readFileSync(path.join(SRC, 'css/forms.css'), 'utf8');
console.log('  initApp in pwa.js:   ', !pwa.includes('async function initApp') ? 'OK (assente)' : 'ERRORE');
console.log('  initApp in init.js:  ', init.includes('async function initApp') ? 'OK (presente)' : 'ERRORE');
console.log('  IIFE mobile-ui:      ', mob.includes('(function initMobileUI') ? 'OK' : 'ERRORE');
console.log('  filter:blur rimosso: ', !css.includes('filter: blur(8px)') ? 'OK' : 'ERRORE');

console.log(`
==================================================
  Fatto! Prossimo passo:
    node build.js
==================================================
`);
