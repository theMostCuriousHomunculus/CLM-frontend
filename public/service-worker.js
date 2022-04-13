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

self.addEventListener('notificationclick', function (event) {
  const { action, notification } = event;

  async function pullUpApp() {
    const allClients = await clients.matchAll();
    const hiddenApp = allClients.find(
      (client) => client.url === notification.data.url && client.visibilityState === 'hidden'
    );

    if (hiddenApp) {
      hiddenApp.focus();
    } else {
      if (allClients.length === 0) {
        const newWindow = await clients.openWindow(notification.data.url);
        newWindow?.focus();
      } else {
        allClients[0].navigate(notification.data.url);
      }
    }

    notification.close();
  }

  event.waitUntil(pullUpApp());
});

self.addEventListener('push', async function (event) {
  async function show() {
    let data = {
      body: "Oh boy it's probably awesome!",
      title: "Something's happening on Cube Level Midnight",
      url: 'http://localhost:3000'
      // url: "https://cubelevelmidnight.com"
    };

    if (event.data) {
      data = JSON.parse(event.data.text());
    }

    const allClients = await clients.matchAll();
    const visibleApp = allClients.find((client) => {
      return client.url === data.url && client.visibilityState === 'visible';
    });

    if (!visibleApp) {
      self.registration.showNotification(data.title, {
        badge: '/images/icon.png',
        body: data.body,
        data: {
          url: data.url
        },
        icon: data.icon ?? '/images/icon.png'
      });
    }
  }

  event.waitUntil(show());
});
