// Service Worker for ThinkRED Technologies
// Version 1.0.0

const CACHE_NAME = 'thinkred-v1';
const STATIC_CACHE_NAME = 'thinkred-static-v1';

// Assets to cache immediately (will be updated by build process with actual file names)
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/assets/logos/thinkRED-np.svg',
  '/assets/avatars/assistant-red.webp',
  '/assets/icons/thinkred/favicon.png',
  '/manifest.json'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE_NAME)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        return self.skipWaiting();
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((cacheName) => {
              return cacheName !== CACHE_NAME && cacheName !== STATIC_CACHE_NAME;
            })
            .map((cacheName) => {
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip external requests
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cached version if available
        if (response) {
          return response;
        }

        // Otherwise, fetch from network
        return fetch(event.request)
          .then((response) => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache static assets
            if (event.request.url.includes('/assets/') || 
                event.request.url.endsWith('.js') || 
                event.request.url.endsWith('.css') ||
                event.request.url.endsWith('.png') ||
                event.request.url.endsWith('.jpg') ||
                event.request.url.endsWith('.webp') ||
                event.request.url.endsWith('.svg')) {
              caches.open(STATIC_CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            } else {
              // Cache other resources in the main cache
              caches.open(CACHE_NAME)
                .then((cache) => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          });
      })
  );
});
