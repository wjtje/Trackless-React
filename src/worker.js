/* eslint-disable no-undef */
const CACHE_NAME = 'trackless-client-0.2-beta.1';
const filesToCache = [];

// Perform install steps
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      // Cache all files
      console.log('Worker: Stated to cache all files');
      return cache.addAll(filesToCache);
    })
  )
});

// Perform steps to access the cache
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Cache hit - return response
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});

// Remove all old caches
self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName != CACHE_NAME) {  // If the cache name is not the current name delete it
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});