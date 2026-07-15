const CACHE_NAME = 'spicesight-v3';

// Install — activate immediately, don't pre-cache HTML
self.addEventListener('install', event => {
  self.skipWaiting();
});

// Activate — delete ALL old caches
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

  if (url.protocol !== 'http:' && url.protocol !== 'https:') return;
  if (url.pathname.startsWith('/api/')) return;
  if (url.origin !== self.location.origin) return;
  if (event.request.method !== 'GET') return;

  // NAVIGATION (HTML): network-first — always try fresh, cache only as offline fallback.
  // This prevents stale index.html pointing at deleted hashed JS bundles.
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then(response => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put('/index.html', clone).catch(() => {}));
          return response;
        })
        .catch(() => caches.match('/index.html'))
    );
    return;
  }

  // STATIC ASSETS (hashed JS/CSS, images, fonts): cache-first is safe —
  // hashed filenames never change content.
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.status === 200) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone).catch(() => {}));
        }
        return response;
      });
    })
  );
});