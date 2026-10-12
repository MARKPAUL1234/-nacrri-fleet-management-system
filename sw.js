const CACHE_NAME = "nacrri-fleet-v1.0.1";
const ASSETS_TO_CACHE = [
  "./",
  "./index.html",
  "./index.css",
  "./app.js",
  "./logo.svg",
  "./logo.png",
  "./manifest.json",
  "./icons/icon_bus.png",
  "./icons/icon_motorcycle.png",
  "./icons/icon_programme_admin.png",
  "./icons/icon_programme_cereals.png",
  "./icons/icon_programme_horticulture.png",
  "./icons/icon_programme_legumes.png",
  "./icons/icon_programme_rootcrops.png",
  "./icons/icon_programme_workshop.png",
  "./icons/icon_tractor.png",
  "./icons/icon_van.png",
  "./icons/icon_vehicle.png"
];

self.addEventListener("install", (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((name) => {
          if (name !== CACHE_NAME) {
            return caches.delete(name);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (e) => {
  // Only handle HTTP/HTTPS requests
  if (!e.request.url.startsWith("http")) return;

  e.respondWith(
    caches.match(e.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }
      return fetch(e.request).then((networkResponse) => {
        return networkResponse;
      }).catch(() => {
        // Fallback for navigation
        if (e.request.mode === "navigate") {
          return caches.match("./index.html");
        }
      });
    })
  );
});
