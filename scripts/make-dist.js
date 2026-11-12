#!/usr/bin/env node
/**
 * Prepara la cartella dist/ con i SOLI file che devono essere pubblici.
 * Netlify pubblica dist/ (vedi netlify.toml): script, copie di lavoro,
 * funzioni e configurazione Supabase restano fuori dal sito.
 *
 * Non modifica nessun file: copia e basta.
 * USO:  node scripts/make-dist.js
 */
'use strict';

const fs   = require('fs');
const path = require('path');

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

fs.rmSync(DIST, { recursive: true, force: true });
fs.mkdirSync(DIST, { recursive: true });

const files = new Set(PUBLIC_FILES);
for (const name of fs.readdirSync(ROOT)) {
  if (PUBLIC_EXT.includes(path.extname(name).toLowerCase())) files.add(name);
}

let missing = 0;
for (const name of files) {
  const from = path.join(ROOT, name);
  if (!fs.existsSync(from) || !fs.statSync(from).isFile()) {
    console.error(`✕  File pubblico mancante: ${name}`);
    missing++;
    continue;
  }
  fs.copyFileSync(from, path.join(DIST, name));
}

if (missing) process.exit(1);
console.log(`✓  dist/ pronta — ${files.size} file pubblici`);
