const cacheName = 'my-app-cache-v2';
const assetsToCache = [
    '/',
    "/index.html",
"/manifest.json",
"/README.md",
"/scan.py",
"/service-worker.js",
"/asset/css/all.min.css",
"/asset/css/app.css",
"/asset/css/bootstrap.min.css",
"/asset/icon/android-chrome-192x192.png",
"/asset/icon/android-chrome-512x512.png",
"/asset/icon/app.png",
"/asset/icon/apple-touch-icon.png",      
"/asset/icon/favicon-16x16.png",
"/asset/icon/favicon-32x32.png",
"/asset/icon/favicon.ico",
"/asset/js/bootstrap.bundle.min.js",
"/asset/webfonts/fa-solid-900.ttf",
"/asset/webfonts/fa-solid-900.woff2",
"/asset/webfonts/Poppins-Bold.ttf",
"/asset/webfonts/Poppins-Regular.ttf",
"/hitungbahan/index.html",
"/hitungbahan/manifest.json",
"/hitungbahan/service-worker.js",
"/hitungbahan/asset/css/all.min.css",
"/hitungbahan/asset/css/app.css",
"/hitungbahan/asset/css/bootstrap.min.css",
"/hitungbahan/asset/icon/android-chrome-192x192.png",
"/hitungbahan/asset/icon/android-chrome-512x512.png",
"/hitungbahan/asset/icon/app.png",
"/hitungbahan/asset/icon/apple-touch-icon.png",
"/hitungbahan/asset/icon/favicon-16x16.png",
"/hitungbahan/asset/icon/favicon-32x32.png",
"/hitungbahan/asset/icon/favicon.ico",
"/hitungbahan/asset/js/bootstrap.bundle.min.js",
"/hitungbahan/asset/webfonts/fa-solid-900.ttf",
"/hitungbahan/asset/webfonts/fa-solid-900.woff2",
"/hitungbahan/asset/webfonts/Poppins-Bold.ttf",
"/hitungbahan/asset/webfonts/Poppins-Regular.ttf",
"/qrcode/index.html",
"/qrcode/manifest.json",
"/qrcode/service-worker.js",
"/qrcode/asset/css/all.min.css",
"/qrcode/asset/css/app.css",
"/qrcode/asset/css/bootstrap.min.css",
"/qrcode/asset/icon/android-chrome-192x192.png",
"/qrcode/asset/icon/android-chrome-512x512.png",
"/qrcode/asset/icon/app.png",
"/qrcode/asset/icon/apple-touch-icon.png",
"/qrcode/asset/icon/favicon-16x16.png",
"/qrcode/asset/icon/favicon-32x32.png",
"/qrcode/asset/icon/favicon.ico",
"/qrcode/asset/js/bootstrap.bundle.min.js",
"/qrcode/asset/webfonts/fa-solid-900.ttf",
"/qrcode/asset/webfonts/fa-solid-900.woff2",
"/qrcode/asset/webfonts/Poppins-Bold.ttf",
"/qrcode/asset/webfonts/Poppins-Regular.ttf",
"/todo/app.js",
"/todo/favicon.ico",
"/todo/icon192.png",
"/todo/icon512.png",
"/todo/index.html",
"/todo/manifest.json",
"/todo/service-worker.js",
"/todo/style.css",
"/todo/asset/css/all.min.css",
"/todo/asset/css/app.css",
"/todo/asset/css/bootstrap.min.css",
"/todo/asset/icon/android-chrome-192x192.png",
"/todo/asset/icon/android-chrome-512x512.png",
"/todo/asset/icon/app.png",
"/todo/asset/icon/apple-touch-icon.png",
"/todo/asset/icon/favicon-16x16.png",
"/todo/asset/icon/favicon-32x32.png",
"/todo/asset/icon/favicon.ico",
"/todo/asset/js/bootstrap.bundle.min.js",
"/todo/asset/webfonts/fa-solid-900.ttf",
"/todo/asset/webfonts/fa-solid-900.woff2",
"/todo/asset/webfonts/Poppins-Bold.ttf",
"/todo/asset/webfonts/Poppins-Regular.ttf",


    
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
