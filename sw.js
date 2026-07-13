const CACHE_NAME = "bicho-capricho-v33-20260713";
const ASSETS = [
  "./",
  "./index.html",
  "./dist/styles.min.css?v=20260713-v33",
  "./dist/catalogo.min.js?v=20260713-v33",
  "./supabase-config.js",
  "./manifest.json",
  "./assets/favicon-32.png",
  "./assets/favicon-180.png"
];

// Instalar Service Worker y cachear assets base
self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Activar y limpiar cachés viejas
self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptar peticiones (Estrategia: Stale-While-Revalidate)
self.addEventListener("fetch", (e) => {
  // Solo interceptar peticiones GET locales
  if (e.request.method !== "GET" || !e.request.url.startsWith(self.location.origin)) {
    return;
  }

  const url = new URL(e.request.url);
  const mustBeFresh = e.request.mode === "navigate" || /\.(html|css|js)$/i.test(url.pathname);

  if (mustBeFresh) {
    e.respondWith(
      fetch(e.request).then((networkResponse) => {
        if (networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(e.request, responseClone));
        }
        return networkResponse;
      }).catch(() => caches.match(e.request))
    );
    return;
  }

  e.respondWith(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.match(e.request).then((cachedResponse) => {
        const fetchPromise = fetch(e.request).then((networkResponse) => {
          // Guardar respuesta actualizada en caché
          if (networkResponse.status === 200) {
            cache.put(e.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Si falla la red, retornar la respuesta en caché si existe
          return cachedResponse;
        });

        return cachedResponse || fetchPromise;
      });
    })
  );
});
