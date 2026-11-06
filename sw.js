/* Minimal cross-origin-isolation shim (based on coi-serviceworker, MIT).
   GitHub Pages cannot send COOP/COEP headers, and SharedArrayBuffer needs them. */
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (e) => e.waitUntil(self.clients.claim()));

function withHeaders(response, headers) {
  if (!response) return response;
  const r = new Response(response.body, response);
  for (const [k, v] of Object.entries(headers)) r.headers.set(k, v);
  return r;
}

self.addEventListener('fetch', (event) => {
  if (event.request.cache === 'only-if-cached' && event.request.mode !== 'same-origin') return;
  event.respondWith(
    fetch(event.request)
      .then((r) => withHeaders(r, {
        'Cross-Origin-Opener-Policy': 'same-origin',
        'Cross-Origin-Embedder-Policy': 'require-corp',
        'Cross-Origin-Resource-Policy': 'cross-origin',
      }))
      .catch(() => caches.match(event.request))
  );
});
