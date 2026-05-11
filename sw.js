/* ═══════════════════════════════════════════════════
   DSWORLD Service Worker v1.2.0
   - Cache-first per assets statici
   - Background sync al ritorno online
   - Push notifications handler
═══════════════════════════════════════════════════ */

const CACHE_NAME = 'dsworld-cache-v3';
const STATIC_ASSETS = ['/', '/app.html', '/app.js', '/app.css'];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (
    url.pathname.startsWith('/.netlify/') ||
    url.hostname.includes('supabase') ||
    url.hostname.includes('googleapis') ||
    url.hostname.includes('fonts.g') ||
    event.request.method !== 'GET'
  ) return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') return response;
        const clone = response.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        return response;
      }).catch(() => cached || new Response('Offline', { status: 503 }));
    })
  );
});

self.addEventListener('sync', event => {
  if (event.tag === 'dsworld-sync') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SYNC_REQUESTED' }));
      })
    );
  }
});

/* ── Push Notifications ── */
self.addEventListener('push', event => {
  let payload = {};
  try { payload = event.data?.json() || {}; } catch (_) { payload = { body: event.data?.text() || 'Nuovo avviso DSWORLD' }; }
  const title = payload.title || 'DSWORLD';
  const options = {
    body:    payload.body    || 'Hai nuovi avvisi operativi.',
    icon:    payload.icon    || '/icon-192.png',
    badge:   payload.badge   || '/icon-96.png',
    tag:     payload.tag     || 'dsworld-general',
    data:    payload.data    || { url: '/app.html' },
    vibrate: [100, 50, 100],
    actions: [
      { action: 'open',    title: 'Apri app' },
      { action: 'dismiss', title: 'Ignora'   }
    ],
    renotify: false,
    requireInteraction: false
  };
  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.action === 'dismiss') return;
  const targetUrl = event.notification.data?.url || '/app.html';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      for (const client of clients) {
        if (client.url.includes('/app.html') && 'focus' in client) return client.focus();
      }
      if (self.clients.openWindow) return self.clients.openWindow(targetUrl);
    })
  );
});
