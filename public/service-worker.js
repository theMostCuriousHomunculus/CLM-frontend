// self.addEventListener('install', function (event) {
//   console.log('[ServiceWorker] Installing service worker...', event);
// });

// self.addEventListener('activate', function (event) {
//   console.log('[ServiceWorker] Activating service worker...', event);
//   return self.clients.claim();
// });

self.addEventListener('fetch', function (event) {
  event.respondWith(fetch(event.request));
});
