const CACHE_NAME = "stlight-cache-v1";

const ASSETS = [
  "./",
  "./index.html",
  "./styles.css",
  "./app.js",
  "./catalog.json",
  "./assets/logo.png",
  "./assets/hero.jpg"
];

/* =========================
   INSTALL
========================= */

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    })
  );
});

/* =========================
   ACTIVATE
========================= */

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
});

/* =========================
   FETCH (OFFLINE FIRST)
========================= */

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cached) => {
      return cached || fetch(event.request);
    })
  );
});
