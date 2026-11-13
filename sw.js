/* ══════════════════════════════════════════════════════════════
   FitFlow Service Worker

   - Pagine (app.html, index.html…): PRIMA la rete, poi la copia salvata.
     Chi usa l'app riceve sempre l'ultima versione pubblicata; senza
     connessione si apre comunque la copia salvata sul dispositivo.
   - Librerie da CDN a versione fissa: copia salvata (non cambiano mai).
   - Icone e manifest: copia salvata, aggiornata in sottofondo.
   - Supabase, funzioni Netlify, Google, portale cliente: mai toccati.

   BUILD_ID viene scritto da scripts/make-dist.js a ogni pubblicazione:
   non serve più cambiare a mano il nome della cache.
══════════════════════════════════════════════════════════════ */

const BUILD_ID = '__BUILD_ID__';
const CACHE_NAME = `fitflow-${BUILD_ID}`;
const APP_SHELL = ['/app.html', '/manifest.json', '/icon-192.png', '/icon-180.png', '/icon-512.png'];
/* Librerie esterne che app.html carica all'avvio: l'elenco viene scritto da
   scripts/make-dist.js leggendo app.html, così la versione è indicata in un posto solo. */
const CDN_SHELL = [/*__CDN_SHELL__*/];
const CDN_HOSTS = ['cdn.jsdelivr.net', 'unpkg.com'];
const STATIC_EXT = /\.(?:png|jpg|jpeg|webp|svg|ico|json|woff2?)$/i;
const PAGE_TIMEOUT_MS = 4000;

/* ── Install: salva subito la pagina dell'app e le icone ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => Promise.all([
        ...APP_SHELL.map(url => cache.add(new Request(url, { cache: 'reload' })).catch(() => {})),
        ...CDN_SHELL.map(url => cache.add(new Request(url, { mode: 'cors', credentials: 'omit' })).catch(() => {}))
      ]))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: elimina le cache delle versioni precedenti ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function offlineResponse() {
  return new Response(
    '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<title>FitFlow</title><body style="margin:0;display:grid;place-items:center;min-height:100vh;background:#141414;color:#fff;font-family:system-ui,sans-serif;text-align:center;padding:24px">' +
    '<div><h1 style="font-size:1.2rem">Nessuna connessione</h1><p style="color:#c8c5be">Riprova quando torna la rete.</p></div></body>',
    { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
  );
}

/* Pagine: rete prima; se la rete è assente o troppo lenta, copia salvata */
async function pageNetworkFirst(event, url) {
  const cache = await caches.open(CACHE_NAME);
  const key = url.pathname; // la stessa pagina con qualunque parametro (?google=connected…)
  const network = fetch(event.request).then(response => {
    if (response && response.ok) cache.put(key, response.clone()).catch(() => {});
    return response;
  });
  /* tiene vivo il service worker finché la copia non è aggiornata */
  event.waitUntil(network.catch(() => {}));

  const cached = await cache.match(key);
  if (!cached) {
    try { return await network; } catch (_) { return offlineResponse(); }
  }
  const timeout = new Promise(resolve => setTimeout(() => resolve(null), PAGE_TIMEOUT_MS));
  try {
    const response = await Promise.race([network, timeout]);
    return response || cached;
  } catch (_) {
    return cached;
  }
}

/* File che non cambiano mai (librerie a versione fissa) */
async function cacheFirst(request) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response && response.ok && response.type !== 'opaque') cache.put(request, response.clone()).catch(() => {});
  return response;
}

/* Icone e manifest: risposta immediata dalla copia, aggiornamento in sottofondo */
async function staleWhileRevalidate(event) {
  const cache = await caches.open(CACHE_NAME);
  const cached = await cache.match(event.request);
  const network = fetch(event.request).then(response => {
    if (response && response.ok) cache.put(event.request, response.clone()).catch(() => {});
    return response;
  });
  if (cached) {
    event.waitUntil(network.catch(() => {}));
    return cached;
  }
  return network;
}

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);

  if (CDN_HOSTS.includes(url.hostname)) {
    event.respondWith(cacheFirst(request));
    return;
  }
  /* Tutto ciò che non è del sito (Supabase, Google, font) va sempre in rete */
  if (url.origin !== self.location.origin) return;
  if (url.pathname.startsWith('/.netlify/') || url.pathname.startsWith('/api/')) return;
  /* Portale cliente: contiene il link personale, non va mai salvato */
  if (url.pathname === '/client.html' || url.pathname === '/client') return;
  if (url.pathname === '/sw.js') return;

  if (request.mode === 'navigate' || request.destination === 'document') {
    event.respondWith(pageNetworkFirst(event, url));
    return;
  }
  if (STATIC_EXT.test(url.pathname)) {
    event.respondWith(staleWhileRevalidate(event));
  }
});

/* ── Background Sync — riprova il sync cloud quando torna online ── */
self.addEventListener('sync', event => {
  if (event.tag === 'fitflow-sync') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SYNC_REQUESTED' }));
      })
    );
  }
});

/* ══════════════════════════════════════════════════════════════
   NOTIFICHE PUSH — predisposizione
   Il ricevitore è pronto, ma l'app non ha ancora l'iscrizione alle
   notifiche né la funzione server che le invia. Payload atteso:
   { title, body, icon, tag, data: { url } }
══════════════════════════════════════════════════════════════ */
self.addEventListener('push', event => {
  let payload = {};
  try {
    payload = event.data?.json() || {};
  } catch (_) {
    payload = { body: event.data?.text() || 'Nuovo avviso FitFlow' };
  }

  const title   = payload.title  || 'FitFlow';
  const options = {
    body:    payload.body    || 'Hai nuovi avvisi operativi.',
    icon:    payload.icon    || '/icon-192.png',
    badge:   payload.badge   || '/icon-192.png',
    tag:     payload.tag     || 'fitflow-general',
    data:    payload.data    || { url: '/app.html' },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open', title: 'Apri app' },
      { action: 'dismiss', title: 'Ignora' }
    ],
    renotify: false,
    requireInteraction: false
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

/* ── Tap sulla notifica ── */
self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;

  const targetUrl = event.notification.data?.url || '/app.html';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      /* Se c'è già una finestra aperta, la porta in foreground */
      for (const client of clients) {
        if (client.url.includes('/app.html') && 'focus' in client) {
          return client.focus();
        }
      }
      /* Altrimenti apre una nuova scheda */
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
