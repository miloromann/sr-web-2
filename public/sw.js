/* Studio Romann — cache static assets + videos so they load once and reuse.
   Strategy: cache-first for media / Next build assets; network for HTML navigations.
*/
const VERSION = "sr-cache-v1";
const ASSET_CACHE = `${VERSION}-assets`;
const VIDEO_CACHE = `${VERSION}-videos`;

self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(caches.open(ASSET_CACHE).then(() => caches.open(VIDEO_CACHE)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys
          .filter((k) => k.startsWith("sr-cache-") && !k.startsWith(VERSION))
          .map((k) => caches.delete(k)),
      );
      await self.clients.claim();
    })(),
  );
});

function isVideo(url) {
  return /\.(mp4|webm|ogg)(\?|$)/i.test(url.pathname);
}

function isStaticAsset(url) {
  if (url.pathname.startsWith("/_next/static/")) return true;
  return /\.(png|jpe?g|gif|webp|svg|ico|woff2?|css|js)(\?|$)/i.test(url.pathname);
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  const res = await fetch(request);
  if (res.ok) {
    cache.put(request, res.clone());
  }
  return res;
}

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  let url;
  try {
    url = new URL(req.url);
  } catch {
    return;
  }

  // Same-origin only
  if (url.origin !== self.location.origin) return;

  if (isVideo(url)) {
    event.respondWith(cacheFirst(req, VIDEO_CACHE));
    return;
  }

  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(req, ASSET_CACHE));
  }
});
