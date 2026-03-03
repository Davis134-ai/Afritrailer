const CACHE_NAME = 'afritrailer-v1';
const ASSETS = [
    '/home.html',
    '/task.html',
    '/level.html',
    '/profile.html',
    '/invest.html',
    '/recharge.html',
    '/withdraw.html',
    '/style.css',
    '/img-logo.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(cached => {
            return cached || fetch(event.request);
        })
    );
});