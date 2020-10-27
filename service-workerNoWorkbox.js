const CACHE_NAME = "submission-2";
var urlsToCache = [
    "/",
    "/nav.html",
    "/index.html",
    "/teamDetail.html",
    "/manifest.json",
    "/pages/home.html",
    "/pages/saved.html",
    "/css/materialize.min.css",
    "/css/style.css",
    "/js/api.js",
    "/js/db.js",
    "/js/idb.js",
    "/js/nav.js",
    "/js/push.js",
    "/js/sw-register.js",
    "/js/materialize.min.js",
    "/icon-144x144.png",
    "/icon-192x192.png",
    "/icon-512x512.png",
    "/custom-icon.png",
    "/apple-icon.png",
    "https://fonts.googleapis.com/icon?family=Material+Icons",
    "https://fonts.gstatic.com/s/materialicons/v55/flUhRq6tzZclQEJ-Vdg-IuiaDsNcIhQ8tQ.woff2"
];

// Mendaftarkan CACHE_NAME
self.addEventListener("install", (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener("fetch", (event) => {
    var base_url = "https://api.football-data.org/v2/";
    if (event.request.url.indexOf(base_url) > -1) {
        event.respondWith(
            caches.open(CACHE_NAME).then((cache) => {
                return fetch(event.request).then((response) => {
                    cache.put(event.request.url, response.clone());
                    return response;
                })
            })
        );
    } else {
        event.respondWith(
            caches.match(event.request, { ignoreSearch: true }).then((response) => {
                return response || fetch (event.request);
            })
        )
    }
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                if (cacheName !== CACHE_NAME && cacheName.startsWith("submission-2")) {
                    return caches.delete(cacheName);
                }
                })
            );
        })
    );
});


// Action saat ada notification
self.addEventListener('notificationclick', (event) => {
    if (!event.action) {
        // Penguna menyentuh area notifikasi diluar action
        console.log('Notification Click.');
        return;
    }
    switch (event.action) {
        case 'yes-action':
            console.log('Pengguna memilih action yes.');
            // buka tab baru
            clients.openWindow('https://google.com');
            break;
        case 'no-action':
            console.log('Pengguna memilih action no');
            break;
        default:
            console.log(`Action yang dipilih tidak dikenal: '${event.action}'`);
            break;
    }
});

self.addEventListener('push', (event) => {
    var body;
    if (event.data) {
        body = event.data.text();
    } else {
        body = 'Push message no payload';
    }
    var options = {
        body: body,
        icon: '/custom-icon.png',
        vibrate: [100, 50, 100],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        }
    };
    event.waitUntil(
        self.registration.showNotification('Push Notification', options)
    );
});