// [PT-BR]: Service Worker do MOZOK para cache offline e execução como PWA nativo.
// [EN-GB]: MOZOK Service Worker for offline caching and native PWA execution.
// [AI-CTX]: @llm-context: Network-first with cache fallback strategy for offline medical teaching and 3D simulation.
//           @llm-invariant: Caches essential neuroanatomy scripts, styles, and assets.
//           @llm-neuroscience: Ensures emergency and classroom offline accessibility in remote clinical/university regions.

const CACHE_NAME = 'mozok-v3.0-native';
const STATIC_ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './favicon.ico',
  './assets/icon-192.png',
  './assets/icon-512.png',
  './assets/icon.png',
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

// [PT-BR]: Estratégia Network-First: busca atualizações da rede e faz fallback para o cache offline
// [EN-GB]: Network-First strategy: fetches fresh updates from network and falls back to offline cache
self.addEventListener('fetch', (event) => {
  // Ignora requisições de áudio TTS de endpoints externos ou esquemas não-HTTP
  if (!event.request.url.startsWith(self.location.origin) && !event.request.url.startsWith('file:')) {
    return;
  }

  // Não intercepta requisições não-GET
  if (event.request.method !== 'GET') {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => {
        return caches.match(event.request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          if (event.request.destination === 'document' || event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
      })
  );
});
