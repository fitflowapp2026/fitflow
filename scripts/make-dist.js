#!/usr/bin/env node
/**
 * Prepara la cartella dist/ con i SOLI file che devono essere pubblici.
 * Netlify pubblica dist/ (vedi netlify.toml): script, copie di lavoro,
 * funzioni e configurazione Supabase restano fuori dal sito.
 *
 * I file sorgente non vengono modificati. L'unica differenza tra sorgente e
 * dist/ è in sw.js: al posto di __BUILD_ID__ viene scritta un'impronta dei
 * file pubblicati, così a ogni pubblicazione con qualcosa di cambiato chi
 * usa l'app riceve la versione nuova senza dover toccare nulla a mano.
 *
 * USO:  node scripts/make-dist.js
 */
'use strict';

const fs     = require('fs');
const path   = require('path');
const crypto = require('crypto');

const ROOT = path.join(__dirname, '..');
const DIST = path.join(ROOT, 'dist');

// Elenco esplicito: un file nuovo NON diventa pubblico finché non lo aggiungi qui.
const PUBLIC_FILES = [
  'index.html',
  'app.html',
  'client.html',
  'privacy.html',
  'termini.html',
  'manifest.json',
  'sw.js'
];
// Immagini nella radice (icone, splash screen): pubbliche tutte
const PUBLIC_EXT = ['.png', '.jpg', '.jpeg', '.webp', '.svg', '.ico'];
const BUILD_PLACEHOLDER = '__BUILD_ID__';
const CDN_PLACEHOLDER = '/*__CDN_SHELL__*/';

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const files = new Set(PUBLIC_FILES);
for (const name of fs.readdirSync(ROOT)) {
  if (PUBLIC_EXT.includes(path.extname(name).toLowerCase())) files.add(name);
}

let missing = 0;
const hash = crypto.createHash('sha256');
for (const name of [...files].sort()) {
  const from = path.join(ROOT, name);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) {
    console.error(`✕  File pubblico mancante: ${name}`);
    missing++;
    continue;
  }
  hash.update(name).update(fs.readFileSync(from));
  if (name !== 'sw.js') fs.copyFileSync(from, path.join(DIST, name));
}
if (missing) process.exit(1);

// sw.js: stessa copia, con l'impronta della pubblicazione al posto del segnaposto
const buildId = hash.digest('hex').slice(0, 12);
const swSource = fs.readFileSync(path.join(ROOT, 'sw.js'), 'utf8');
if (!swSource.includes(BUILD_PLACEHOLDER)) {
  console.error(`✕  In sw.js manca il segnaposto ${BUILD_PLACEHOLDER}: la cache non si aggiornerebbe.`);
  process.exit(1);
}
// Libreria Supabase caricata da app.html: va salvata subito, così l'app parte anche senza rete
const appSource = fs.readFileSync(path.join(ROOT, 'app.html'), 'utf8');
const supabaseFile = (appSource.match(/SUPABASE_JS_FILE\s*=\s*'([^']+)'/) || [])[1];
if (!supabaseFile) {
  console.error('✕  In app.html non trovo SUPABASE_JS_FILE: la libreria non verrebbe salvata per l\'uso senza rete.');
  process.exit(1);
}
const cdnShell = JSON.stringify('https://cdn.jsdelivr.net/npm' + supabaseFile);
fs.writeFileSync(
  path.join(DIST, 'sw.js'),
  swSource.split(BUILD_PLACEHOLDER).join(buildId).split(CDN_PLACEHOLDER).join(cdnShell)
);

console.log(`✓  dist/ pronta — ${files.size} file pubblici (versione ${buildId})`);
