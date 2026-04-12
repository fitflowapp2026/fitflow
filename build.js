#!/usr/bin/env node
/**
 * DSWORLD — Build script
 * Assembla tutti i file sorgente in app.html
 *
 * USO:
 *   node build.js          → scrive app.html
 *   node build.js --watch  → ricostruisce ad ogni modifica in src/
 */

const fs   = require('fs');
const path = require('path');

const ROOT     = __dirname;
const SHELL    = path.join(ROOT, 'src', 'html', 'shell.html');
const OUT      = path.join(ROOT, 'app.html');
const SRC_DIR  = path.join(ROOT, 'src');

// ── Istruzione di inclusione ──────────────────────────────────────
// Nel template usa:
//   <!-- @@include src/html/topbar.html -->     per HTML
//   /* @@include src/css/base.css */            per CSS dentro <style>
//   // @@include src/js/utils.js               per JS dentro <script>
const INCLUDE_RE = /(?:<!--|\/\*|\/\/)\s*@@include\s+([\w\/.\-]+)\s*(?:-->|\*\/)?/g;

function readFile(filePath) {
  const abs = path.join(ROOT, filePath);
  if (!fs.existsSync(abs)) {
    console.warn(`  ⚠  File non trovato: ${filePath} — incluso come commento vuoto`);
    return `/* MISSING: ${filePath} */`;
  }
  return fs.readFileSync(abs, 'utf8');
}

function build() {
  const start = Date.now();

  if (!fs.existsSync(SHELL)) {
    console.error(`✕  Shell non trovata: ${SHELL}`);
    process.exit(1);
  }

  let source = fs.readFileSync(SHELL, 'utf8');
  let includeCount = 0;

  // Sostituisce ogni @@include con il contenuto del file
  source = source.replace(INCLUDE_RE, (_, filePath) => {
    includeCount++;
    const content = readFile(filePath.trim());
    // Rimuove BOM se presente
    return content.replace(/^\uFEFF/, '');
  });

  fs.writeFileSync(OUT, source, 'utf8');

  const size  = (fs.statSync(OUT).size / 1024).toFixed(1);
  const ms    = Date.now() - start;
  console.log(`✓  app.html ricostruito — ${includeCount} file inclusi, ${size} KB (${ms}ms)`);
}

// ── Watch mode ───────────────────────────────────────────────────
if (process.argv.includes('--watch')) {
  console.log('👁  Watch mode attivo. Modifica un file in src/ per ricostruire.\n');
  build();

  let debounceTimer = null;
  fs.watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(() => {
      console.log(`  ↻  ${filename} modificato`);
      try {
        build();
      } catch (err) {
        console.error('✕  Errore durante il build:', err.message);
      }
    }, 80);
  });
} else {
  try {
    build();
  } catch (err) {
    console.error('✕  Build fallito:', err.message);
    process.exit(1);
  }
}
