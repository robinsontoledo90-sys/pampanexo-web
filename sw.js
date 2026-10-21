/* PAMPANEXO · caché pública de lectura sin conexión.
   No almacenar APIs de Supabase, datos autenticados ni páginas internas. */
const CACHE_NAME = "pampanexo-public-v1-20261021";
const CACHE_PREFIX = "pampanexo-public-";
const SCOPE = new URL(self.registration.scope);
const ASSETS = [
  "./",
  "./index.html",
  "./demo-chatbot.html",
  "./qr.min.js",
  "./manifest.webmanifest",
  "./offline.html",
  "./icon-192.png",
  "./icon-512.png"
];
const CACHED_PATHS = new Set(ASSETS.map(s => new URL(s, SCOPE).pathname));
const PUBLIC_PAGES = new Set([
  new URL("./", SCOPE).pathname,
  new URL("./index.html", SCOPE).pathname,
  new URL("./demo-chatbot.html", SCOPE).pathname
]);
const FALLBACK = new URL("./offline.html", SCOPE).href;
self.addEventListener("install", event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ASSETS.map(path => new URL(path, SCOPE).href));
    await self.skipWaiting();
  })());
});
self.addEventListener("activate", event => {
  event.waitUntil((async () => {
    const names = await caches.keys();
    await Promise.all(names
      .filter(name => name.startsWith(CACHE_PREFIX) && name !== CACHE_NAME)
      .map(name => caches.delete(name)));
    await self.clients.claim();
  })());
});
self.addEventListener("fetch", event => {
  const request = event.request;
  if (request.method !== "GET") return;
  const url = new URL(request.url);
  if (url.origin !== SCOPE.origin || !url.pathname.startsWith(SCOPE.pathname)) return;
  const isNavigation = request.mode === "navigate";
  if (!isNavigation && !CACHED_PATHS.has(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    if (isNavigation && !PUBLIC_PAGES.has(url.pathname)) {
      // No se almacena el panel de gestión ni el seguimiento real.
      try { return await fetch(request); }
      catch { return (await cache.match(FALLBACK)) || Response.error(); }
    }
    try {
      const response = await fetch(request);
      if (response.ok && response.type !== "opaque") {
        const canonical = new URL(url.pathname, SCOPE.origin).href;
        await cache.put(canonical, response.clone());
      }
      return response;
    } catch (_) {
      const cached = await cache.match(request, {ignoreSearch:true});
      if (cached) return cached;
      return (await cache.match(FALLBACK)) || Response.error();
    }
  })());
});
