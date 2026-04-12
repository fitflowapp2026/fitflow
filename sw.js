/* ============================================================
   FitFlow — Service Worker v1
   Cache-first for app shell, network-first for API calls
   ============================================================ */

const CACHE_NAME = 'dsworld-v2';
const CACHE_STATIC = 'dsworld-static-v2';

/* App shell — files to precache on install */
const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/manifest.json'
];

/* ── Install: precache app shell ───────────────────────── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_STATIC)
      .then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clean up old caches ────────────────────── */
self.addEventListener('activate', event => {
  const validCaches = [CACHE_NAME, CACHE_STATIC];
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(key => !validCaches.includes(key))
          .map(key => caches.delete(key))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: cache strategy ─────────────────────────────── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  /* Skip non-GET and cross-origin API requests (Supabase, Google) */
  if (request.method !== 'GET') return;
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('googleapis.com')) return;
  if (url.hostname.includes('netlify')) return;

  /* HTML navigation → network first, fallback to cache */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(cache => cache.put(request, clone));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  /* Static assets → cache first, then network */
  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        if (response && response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_STATIC).then(cache => cache.put(request, clone));
        }
        return response;
      }).catch(() => new Response('', { status: 408, statusText: 'Offline' }));
    })
  );
});

/* ── Background sync for failed cloud saves ───────────── */
self.addEventListener('sync', event => {
  if (event.tag === 'fitflow-sync') {
    event.waitUntil(
      self.clients.matchAll().then(clients => {
        clients.forEach(client => client.postMessage({ type: 'SYNC_REQUESTED' }));
      })
    );
  }
});

/* ── Push notifications (future use) ──────────────────── */
self.addEventListener('push', event => {
  if (!event.data) return;
  let data;
  try { data = event.data.json(); } catch { data = { title: 'FitFlow', body: event.data.text() }; }
  event.waitUntil(
    self.registration.showNotification(data.title || 'FitFlow', {
      body: data.body || '',
      icon: '/icon-192.png',
      badge: '/icon-192.png',
      tag: data.tag || 'fitflow',
      data: data.url ? { url: data.url } : undefined
    })
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();
  if (event.notification.data?.url) {
    event.waitUntil(clients.openWindow(event.notification.data.url));
  }
});
