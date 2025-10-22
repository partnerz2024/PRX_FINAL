// Service Worker for PWA
const CACHE_NAME = 'partners-stock-v1';
const urlsToCache = [
  '/',
  '/main.js',
  '/main.css',
  '/index.html',
  '/socket-config.js',
  '/manifest.json'
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', function(event) {
  // Socket.IO, API, 동적 콘텐츠는 완전히 우회
  if (event.request.url.includes('socket.io') ||
      event.request.url.includes('/api/') ||
      event.request.url.includes('manifest.json') ||
      event.request.url.includes('.png') ||
      event.request.url.includes('.jpg') ||
      event.request.url.includes('.jpeg') ||
      event.request.url.includes('.gif') ||
      event.request.url.includes('.svg') ||
      event.request.url.includes('localhost:3001') ||
      event.request.url.includes('127.0.0.1:3001')) {
    // 네트워크 우선, 캐시 무시
    event.respondWith(
      fetch(event.request, {
        cache: 'no-cache',
        mode: 'cors'
      }).catch(function() {
        // 네트워크 실패 시에만 캐시 사용
        return caches.match(event.request);
      })
    );
    return;
  }
  
  // 정적 파일은 캐시에서 먼저 찾기
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        if (response) {
          return response;
        }
        return fetch(event.request);
      }
    )
  );
});
