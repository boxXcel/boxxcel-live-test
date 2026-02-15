// boxXcel Service Worker for offline support
const CACHE_NAME = 'boxxcel-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/assets/app.css',
  '/assets/app.js',
  '/assets/config.js',
  '/config.json',
  '/logo.png',
  '/boxer/index.html',
  '/boxer/training.html',
  '/boxer/weight.html',
  '/boxer/profile.html',
  '/boxer/data/training_cards_12_15.json',
  '/boxer/data/plan_12_15_week1.json',
  '/boxer/data/plan_12_15_week2.json',
  '/boxer/data/plan_12_15_week3.json'
];

// Install event - cache static resources
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        return fetch(event.request).then(
          response => {
            // Check if we received a valid response
            if (!response.ok) {
              return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Cache API responses and training data
            if (event.request.url.includes('/api/') || 
                event.request.url.includes('/boxer/data/')) {
              caches.open(CACHE_NAME)
                .then(cache => {
                  cache.put(event.request, responseToCache);
                });
            }

            return response;
          }
        ).catch(() => {
          // Network failed, try to serve from cache
          return caches.match(event.request).then(cachedResponse => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // No cache available either - return a basic offline response
            return new Response('Offline - resource not cached', {
              status: 503,
              statusText: 'Service Unavailable',
              headers: new Headers({
                'Content-Type': 'text/plain'
              })
            });
          });
        });
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
