const cacheName = 'my-app-cache-v1';
const assetsToCache = [
    '/',
    '/index.html',
    '/manifest.json',
    "/asset/js/bootstrap.bundle.min.js",
    "/asset/webfonts/fa-solid-900.ttf",
    "/asset/webfonts/fa-solid-900.woff2",
    "/asset/webfonts/Poppins-Bold.ttf",
    "/asset/css/all.min.css",
    "/asset/css/bootstrap.min.css",
    "/asset/icon/app.png",
    "/asset/icon/favicon.ico",
    "/asset/icon/android-chrome-192x192.png",
    "/asset/icon/android-chrome-512x512.png",
    "/asset/icon/apple-touch-icon.png",
    "/asset/icon/favicon-32x32.png",
    "/asset/icon/favicon-16x16.png"


    
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(cacheName)
            .then(cache => {
                return cache.addAll(assetsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('activate', event => {
    const cacheWhitelist = [cacheName];
    event.waitUntil(
        caches.keys().then(keyList => {
            return Promise.all(keyList.map(key => {
                if (!cacheWhitelist.includes(key)) {
                    return caches.delete(key);
                }
            }));
        })
    );
});
