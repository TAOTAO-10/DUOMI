const CACHE_NAME = "domi-pwa-v1";

const APP_FILES = [
  "./",
  "./index.html",
  "./about.html",
  "./timeline.html",
  "./gallery.html",
  "./profile.html",
  "./css/styles.css",
  "./js/main.js",
  "./manifest.webmanifest",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/photos/domi-crown.jpg",
  "./assets/photos/domi-curious.jpg",
  "./assets/photos/domi-explorer.jpg",
  "./assets/photos/domi-goodluck.jpg",
  "./assets/photos/domi-mealtime.jpg",
  "./assets/photos/domi-nap.jpg",
  "./assets/photos/domi-outfit.jpg",
  "./assets/photos/domi-peek.jpg",
  "./assets/photos/domi-sofa.jpg",
  "./assets/photos/domi-stretch.jpg",
  "./assets/photos/domi-toy.jpg"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(APP_FILES))
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(keys.map((key) => (key === CACHE_NAME ? null : caches.delete(key))))
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      if (cachedResponse) {
        return cachedResponse;
      }

      return fetch(event.request)
        .then((networkResponse) => {
          const responseCopy = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseCopy));
          return networkResponse;
        })
        .catch(() => {
          if (event.request.mode === "navigate") {
            return caches.match("./index.html");
          }
          return undefined;
        });
    })
  );
});
