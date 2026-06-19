const CACHE_NAME = "fiori-sales-v19062026_1";

console.log("Service Worker:", CACHE_NAME);

const urlsToCache = [
  "./",
  "./index.html",
  "./style.css",
  "./app.js",
  "./logo.png",
  "./flowers-bottom.png",
  "./icon-192.png",
  "./icon-512.png"
];

self.addEventListener("install", event => {

    console.log("Installing:", CACHE_NAME);

    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => cache.addAll(urlsToCache))
        .then(() => self.skipWaiting())
    );

});

self.addEventListener("activate", event => {

    console.log("Activated:",CACHE_NAME)

    event.waitUntil(
        caches.keys()
        .then(cacheNames => Promise.all(
            cacheNames
            .filter(cacheName => cacheName !== CACHE_NAME)
            .map(cacheName => caches.delete(cacheName))
        ))
        .then(() => self.clients.claim())
    ); 

});

self.addEventListener("fetch", event => {

  if (
    event.request.url.includes("app.js")
    ||
    event.request.url.includes("style.css")
    ||
    event.request.url.includes("index.html")
  ) {

    event.respondWith(

      fetch(event.request)
        .catch(() =>
          caches.match(event.request)
        )

    );

    return;

  }

  event.respondWith(

    caches.match(event.request)
      .then(response =>
        response || fetch(event.request)
      )

  );

});
