const CACHE_NAME = "code-snippet-library-v2.5.1"; //github update

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/manifest.json",
  // Add CDN resources
  "https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/atom-one-dark.min.css",
  "https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/highlight.min.js"
];

// Install
self.addEventListener("install", event => {
  console.log('[SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[SW] Caching assets');
      return cache.addAll(ASSETS_TO_CACHE);
    }).catch(err => {
      console.error('[SW] Cache failed:', err);
    })
  );
  self.skipWaiting();
});

// Activate
self.addEventListener("activate", event => {
  console.log('[SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      )
    )
  );
  self.clients.claim();
});

// Fetch (offline-first with better error handling)
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      if (response) {
        console.log('[SW] Serving from cache:', event.request.url);
        return response;
      }
      
      return fetch(event.request).then(fetchResponse => {
        // Don't cache non-GET requests or non-successful responses
        if (event.request.method !== 'GET' || !fetchResponse || fetchResponse.status !== 200) {
          return fetchResponse;
        }

        const responseToCache = fetchResponse.clone();
        caches.open(CACHE_NAME).then(cache => {
          cache.put(event.request, responseToCache);
        });

        return fetchResponse;
      }).catch(err => {
        console.log('[SW] Fetch failed, serving fallback:', err);
        // Return cached index.html for navigation requests
        if (event.request.mode === 'navigate') {
          return caches.match('/index.html');
        }
      });
    })
  );
});