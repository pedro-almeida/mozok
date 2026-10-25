// [PT-BR]: Service Worker do MOZOK para cache offline e execução como PWA nativo.
// [EN-GB]: MOZOK Service Worker for offline caching and native PWA execution.
// [AI-CTX]: @llm-context: Network-first with cache fallback strategy for offline medical teaching and 3D simulation.
//           @llm-invariant: Caches essential neuroanatomy scripts, styles, and assets.
//           @llm-neuroscience: Ensures emergency and classroom offline accessibility in remote clinical/university regions.

const CACHE_NAME = 'mozok-pwa-v2.0.0';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/apple-touch-icon.png',
  './js/mozok-adaptive-lod.js',
  './js/mozok-database.js',
  './js/mozok-i18n.js',
  './js/mozok-ai-narrator.js',
  './js/cns-anatomy-3d.js',
  './js/neural-microcosmos-3d.js',
  './js/pathology-engine.js',
  './js/tractography-3d.js',
  './js/scientific-atlas-meshes.js',
  './js/brain-mesh-data.js',
  './js/swc-neurons-data.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[MozokSW] Pré-carregando ativos offline do MOZOK...');
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn('[MozokSW] Aviso ao pré-carregar alguns ativos estáticos:', err);
      });
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((k) => {
          if (k !== CACHE_NAME) {
            console.log('[MozokSW] Removendo cache legado:', k);
            return caches.delete(k);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  // Ignora requisições de áudio TTS de endpoints externos ou extensões
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('file:')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request).then((response) => {
        if (!response || response.status !== 200 || response.type !== 'basic') {
          return response;
        }
        const responseToCache = response.clone();
        caches.open(CACHE_NAME).then((cache) => {
          cache.put(event.request, responseToCache);
        });
        return response;
      }).catch(() => {
        if (event.request.destination === 'document') {
          return caches.match('./index.html');
        }
      });
    })
  );
});
