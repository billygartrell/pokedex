const CACHE_NAME = "scarlet-violet-pokedex-v16";
const APP_FILES = [
  "./",
  "./index.html",
  "./journal.html",
  "./styles.css",
  "./app.js",
  "./pokemon-data.js",
  "./journal.js",
  "./img/badges/cortondo.png",
  "./img/badges/artazon.png",
  "./img/badges/levincia.png",
  "./img/badges/cascarrafa.png",
  "./img/badges/medali.png",
  "./img/badges/montenevera.png",
  "./img/badges/alfornada.png",
  "./img/badges/glaseado.png",
  "./img/team-star/dark_crew.png",
  "./img/team-star/fire_crew.png",
  "./img/team-star/poison_crew.png",
  "./img/team-star/fairy_crew.png",
  "./img/team-star/fighting_crew.png",
  "./manifest.webmanifest"
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES)));
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cacheName) => cacheName !== CACHE_NAME)
          .map((cacheName) => caches.delete(cacheName))
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  if (new URL(event.request.url).origin !== self.location.origin) return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const responseCopy = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request);
      })
  );
});

self.addEventListener("message", (event) => {
  if (event.data === "skipWaiting") {
    self.skipWaiting();
  }
});
