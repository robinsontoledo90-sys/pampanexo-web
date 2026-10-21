# PAMPANEXO · Sitio web y aplicación instalable

## Regla permanente de publicación

**Cada mejora a las páginas públicas debe actualizar tanto la versión online como la versión instalada para uso sin conexión.**

La portada `index.html`, la demostración `demo-chatbot.html` y el modo cifrado de preparación de órdenes `sin-conexion.html` se ofrecen también a través del Service Worker `sw.js`.

- `actualizacion.js` verifica la conexión, registra/actualiza `sw.js` y solicita renovar los archivos públicos al abrir la aplicación o recuperar internet.
- `sw.js` usa caché de archivos públicos exclusivamente; jamás almacena el panel `gestion.html`, consultas privadas `seguimiento.html`, credenciales ni respuestas de Supabase.
- El Service Worker nunca elimina el almacenamiento local cifrado de borradores.
- Las nuevas funcionalidades offline deben funcionar sin llamadas a la red para preparar borradores; la sincronización requiere autorización y conexión.
- Si se añaden nuevas páginas públicas que deban funcionar sin conexión, incluir sus rutas en `ASSETS` y `PUBLIC_PAGES` de `sw.js`.
- Cuando se cambie de forma importante el contenido en caché o el esquema, actualizar `CACHE_NAME` y mantener el mecanismo común de actualización.
- **Sin conexión no pueden recibirse actualizaciones**: se descargan al recuperar internet, sin forzar recarga si hay formularios abiertos.

## Sitio público

https://robinsontoledo90-sys.github.io/pampanexo-web/

## Gestión de servicios

- `gestion.html`: panel autenticado en Supabase, requiere conexión.
- `seguimiento.html`: consulta real con código, requiere conexión.
- `sin-conexion.html`: borradores cifrados locales con sincronización manual al recuperar internet.
