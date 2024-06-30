const CACHE_NAME = "islam-hubap-cac";
const urlsToCache = [
  "/",
  "/asmaul.html",
  "/audio.html",
  "/audio2.html",
  "/bahan.html",
  "/hadist.html",
  "/hadis.html",
  "/index.html",
  "/manifest.json",
  "/qr.html",
  "/quran.html",
  "/readme.md",
  "/scan.py",
  "/service-worker.js",
  "/sholat.html",
  "/todo.html",
  "/hadis.html",
  "/asset/android/android-launchericon-144-144.png",
  "/asset/android/android-launchericon-192-192.png",
  "/asset/android/android-launchericon-48-48.png",
  "/asset/android/android-launchericon-512-512.png",
  "/asset/android/android-launchericon-72-72.png",
  "/asset/android/android-launchericon-96-96.png",
  "/asset/background/background1.jpg",
  "/asset/background/background2.jpg",
  "/asset/background/background3.jpg",
  "/asset/background/background4.jpg",
  "/asset/background/background5.jpg",
  "/asset/background/background6.jpg",
  "/asset/background/background7.jpg",
  "/asset/background/background8.jpg",
  "/asset/background/background9.jpg",
  "/asset/background/background10.jpg",
  "/asset/css/all.min.css",
  "/asset/css/asma.css",
  "/asset/css/audio.css",
  "/asset/css/bootstrap-select.min.css",
  "/asset/css/bootstrap.min.css",
  "/asset/css/hadist.css",
  "/asset/css/quran.css",
  "/asset/css/select2.min.css",
  "/asset/css/sholat.css",
  "/asset/css/todo.css",
  "/asset/data/asmaul-husna.json",
  "/asset/data/asmaul-husnaxxx.json",
  "/asset/data/asmaul-lengkap.json",
  "/asset/data/audio.json",
  "/asset/data/quran.png",
  "/asset/data/hadist/abu-dawud.json",
  "/asset/data/hadist/ahmad.json",
  "/asset/data/hadist/bukhari.json",
  "/asset/data/hadist/darimi.json",
  "/asset/data/hadist/ibnu-majah.json",
  "/asset/data/hadist/malik.json",
  "/asset/data/hadist/muslim.json",
  "/asset/data/hadist/nasai.json",
  "/asset/data/hadist/tirmidzi.json",
  "/asset/font/material.woff2",
  "/asset/font/Poppins-Bold.ttf",
  "/asset/font/Poppins-Regular.ttf",
  "/asset/font/readex-arabic.woff2",
  "/asset/icon/android-chrome-192x192.png",
  "/asset/icon/android-chrome-512x512.png",
  "/asset/icon/apple-touch-icon.png",
  "/asset/icon/favicon-16x16.png",
  "/asset/icon/favicon-32x32.png",
  "/asset/icon/favicon.ico",
  "/asset/js/asma.js",
  "/asset/js/audio.js",
  "/asset/js/bootstrap-select.min.js",
  "/asset/js/bootstrap.bundle.min.js",
  "/asset/js/bootstrap.min.js",
  "/asset/js/FileSaver.min.js",
  "/asset/js/hadist.js",
  "/asset/js/hadis.js",
  "/asset/js/hadist2.js",
  "/asset/js/html2canvas.min.js",
  "/asset/js/jquery-3.6.0.min.js",
  "/asset/js/jquery.min.js",
  "/asset/js/jquery.slim.min.js",
  "/asset/js/popper.min.js",
  "/asset/js/qrcode.min.js",
  "/asset/js/quran.js",
  "/asset/js/quran2.js",
  "/asset/js/select-bootstrap.bundle.min.js",
  "/asset/js/select2.min.js",
  "/asset/js/sholat.js",
  "/asset/js/sholat2.js",
  "/asset/js/todo.js",
  "/asset/js/bahan.js",
  "/asset/js/hadis.js",
  "/asset/webfonts/fa-solid-900.ttf",
  "/asset/webfonts/fa-solid-900.woff2",
  "/asset/webfonts/Poppins-Bold.ttf",
  "/asset/webfonts/Poppins-Regular.ttf",
];

self.addEventListener("install", function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache
        .addAll(urlsToCache.map((url) => new Request(url, { mode: "no-cors" })))
        .then(function () {
          console.log("All resources have been fetched and cached.");
        })
        .catch(function (error) {
          console.error("Failed to cache:", error);
        });
    })
  );
});

self.addEventListener("fetch", function (event) {
  event.respondWith(
    caches.match(event.request).then(function (response) {
      // Cache hit - return response
      if (response) {
        return response;
      }

      // Fetch and cache new resources from network
      return fetch(event.request)
        .then(function (response) {
          // Check if we received a valid response
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response because it's a Stream and can only be consumed once.
          let responseToCache = response.clone();

          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, responseToCache);
          });

          return response;
        })
        .catch(function (error) {
          console.error("Error fetching data:", error);
        });
    })
  );
});
