
const CACHE_NAME = 'thinkred-v1754308004475';
const STATIC_CACHE_URLS = [
  '/',
  '/assets/logos/thinkRED-np.svg',
  '/assets/chunk-markdown-vendors-CdFC4r6T.js',
  '/assets/main-CFyZ4K1R.js',
  '/assets/react-core-Ch7uNxnz.js',
  '/assets/styles-Chy_jdRx.css',
  '/assets/vendors-CzGrRzu0.js'
];

// Install event
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_CACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

// Activate event
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames
          .filter(cacheName => cacheName !== CACHE_NAME)
          .map(cacheName => caches.delete(cacheName))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event
self.addEventListener('fetch', event => {
  if (event.request.destination === 'document') {
    event.respondWith(
      caches.match(event.request)
        .then(response => response || fetch(event.request))
    );
  } else if (event.request.destination === 'script' || event.request.destination === 'style') {
    event.respondWith(
      caches.match(event.request)
        .then(response => {
          if (response) return response;
          return fetch(event.request).then(fetchResponse => {
            const responseClone = fetchResponse.clone();
            caches.open(CACHE_NAME).then(cache => {
              cache.put(event.request, responseClone);
            });
            return fetchResponse;
          });
        })
    );
  }
});