const CACHE_NAME = 'kyuyaku-scanner-v1';

// オフラインでも動かすためにキャッシュしておくファイル群
const URLS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  // Tesseract.jsのプログラム本体もキャッシュする
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/tesseract.min.js',
  'https://cdn.jsdelivr.net/npm/tesseract.js@5/dist/worker.min.js',
  'https://cdn.jsdelivr.net/npm/tesseract.js-core@5/tesseract-core-simd-lstm.wasm.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Opened cache');
      return cache.addAll(URLS_TO_CACHE);
    })
  );
});

// 通信をインターセプトして、キャッシュがあればそれを返す（完全オフライン対応）
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      // キャッシュがあればそれを返す
      if (response) {
        return response;
      }
      // なければ通常通りネットワークへ
      return fetch(event.request);
    })
  );
});