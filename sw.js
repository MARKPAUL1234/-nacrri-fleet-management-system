const CACHE_NAME = "nacrri-fleet-v1";
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
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
