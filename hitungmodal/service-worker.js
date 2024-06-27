// service-worker.js
self.addEventListener('install', function(event) {
    event.waitUntil(
      caches.open('bold-cache').then(function(cache) {
        return cache.addAll([
          '/',
          '/index.html',
          '/js/app.js',
          '/css/app.css',
          '/manifest.json',
          '/icon.png',
          '/service-worker.js',

        ]);
      })
    );
  });
  
  self.addEventListener('fetch', function(event) {
    event.respondWith(
      caches.match(event.request).then(function(response) {
        return response || fetch(event.request);
      })
    );
  });
  
