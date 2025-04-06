
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('bmi-cache').then(cache => {
      return cache.addAll([
        'index.html',
        'style.css',
        'script.js',
        'manifest.json',
        'icon-192.png',
        'icon-512.png'
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(resp => {
      return resp || fetch(event.request);
    })
  );
});
