// Service Worker for PWA - 파트너즈 증권 거래소
const CACHE_NAME = 'partners-stock-v2';
const STATIC_CACHE = 'partners-static-v2';
const DYNAMIC_CACHE = 'partners-dynamic-v2';

// 캐시할 정적 파일들
const urlsToCache = [
  './',
  './index.html',
  './main.js',
  './main.css',
  './manifest.json',
  './favicon.ico',
  './PRX_LOGO.png',
  './PRX_STOCKMARKET_LOGO.png',
  './config.js'
];

// 설치 이벤트
self.addEventListener('install', function(event) {
  console.log('Service Worker 설치 중...');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(function(cache) {
        console.log('정적 파일 캐시 중...');
        return cache.addAll(urlsToCache);
      })
      .then(function() {
        console.log('Service Worker 설치 완료');
        return self.skipWaiting();
      })
  );
});

// 활성화 이벤트
self.addEventListener('activate', function(event) {
  console.log('Service Worker 활성화 중...');
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.map(function(cacheName) {
          if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
            console.log('오래된 캐시 삭제:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(function() {
      console.log('Service Worker 활성화 완료');
      return self.clients.claim();
    })
  );
});

// fetch 이벤트
self.addEventListener('fetch', function(event) {
  const request = event.request;
  const url = new URL(request.url);
  
  // Socket.IO, API, Supabase 요청은 네트워크 우선
  if (request.url.includes('socket.io') ||
      request.url.includes('/api/') ||
      request.url.includes('supabase.co') ||
      request.url.includes('supabase.com') ||
      request.method !== 'GET') {
    
    event.respondWith(
      fetch(request, {
        cache: 'no-cache',
        mode: 'cors'
      }).catch(function() {
        // 네트워크 실패 시에만 캐시 사용
        return caches.match(request);
      })
    );
    return;
  }
  
  // 정적 파일은 캐시 우선
  event.respondWith(
    caches.match(request)
      .then(function(response) {
        if (response) {
          return response;
        }
        
        // 캐시에 없으면 네트워크에서 가져와서 동적 캐시에 저장
        return fetch(request).then(function(response) {
          if (response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE)
              .then(function(cache) {
                cache.put(request, responseClone);
              });
          }
          return response;
        });
      })
  );
});

// 백그라운드 동기화 (선택사항)
self.addEventListener('sync', function(event) {
  if (event.tag === 'background-sync') {
    console.log('백그라운드 동기화 실행');
    // 여기에 오프라인에서 저장된 데이터를 동기화하는 로직 추가 가능
  }
});

// 푸시 알림 (선택사항)
self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: './PRX_LOGO.png',
      badge: './favicon.ico',
      vibrate: [100, 50, 100],
      data: {
        dateOfArrival: Date.now(),
        primaryKey: 1
      },
      actions: [
        {
          action: 'explore',
          title: '확인하기',
          icon: './PRX_LOGO.png'
        },
        {
          action: 'close',
          title: '닫기',
          icon: './favicon.ico'
        }
      ]
    };
    
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
