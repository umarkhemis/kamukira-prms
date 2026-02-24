/* Service Worker for Kamukira PRMS - Offline Support */
const CACHE_NAME = 'kamukira-prms-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/static/js/main.chunk.js',
  '/static/js/bundle.js',
  '/manifest.json',
];

const API_CACHE_NAME = 'kamukira-api-v1';
const OFFLINE_QUEUE_KEY = 'offline-queue';

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {});
    })
  );
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== API_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Handle API requests
  if (url.pathname.startsWith('/api/')) {
    if (request.method === 'GET') {
      event.respondWith(
        fetch(request)
          .then((response) => {
            const responseClone = response.clone();
            caches.open(API_CACHE_NAME).then((cache) => {
              cache.put(request, responseClone);
            });
            return response;
          })
          .catch(() => {
            return caches.match(request);
          })
      );
    } else if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(request.method)) {
      event.respondWith(
        fetch(request).catch(() => {
          return request.clone().json().then((body) => {
            const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
            queue.push({
              url: request.url,
              method: request.method,
              body: body,
              timestamp: Date.now(),
            });
            localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(queue));
            return new Response(
              JSON.stringify({ status: 'queued', message: 'Request queued for offline sync' }),
              { headers: { 'Content-Type': 'application/json' }, status: 202 }
            );
          });
        })
      );
    }
    return;
  }

  // For static assets
  event.respondWith(
    caches.match(request).then((cached) => {
      return cached || fetch(request).catch(() => caches.match('/index.html'));
    })
  );
});

// Background sync
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-offline-queue') {
    event.waitUntil(syncOfflineQueue());
  }
});

async function syncOfflineQueue() {
  const queue = JSON.parse(localStorage.getItem(OFFLINE_QUEUE_KEY) || '[]');
  const remaining = [];
  for (const item of queue) {
    try {
      await fetch(item.url, {
        method: item.method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item.body),
      });
    } catch {
      remaining.push(item);
    }
  }
  localStorage.setItem(OFFLINE_QUEUE_KEY, JSON.stringify(remaining));
}
