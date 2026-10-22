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

## Chatbot · continuación del 22 de octubre de 2026

El asistente flotante y su demostración completa mantienen la orientación técnica basada en reglas y funcionan con/sin conexión. El chatbot no es IA generativa, no accede a órdenes, no envía ni persiste mensajes y permite borrar el historial visible.

- Con conexión: mostrar orientación local y permitir acceso por enlaces a las consultas reales.
- Sin conexión: mostrar claramente ese estado, seguir resolviendo preguntas locales y explicar que seguimiento real, contacto y sincronización requieren internet.
- La versión instalable precarga los mismos archivos públicos mediante `sw.js` (`pampanexo-public-v7-chat-20261022`); al recuperar conexión, `actualizacion.js` solicita su renovación.
- La demo de inventario almacena registros de prueba sin cifrado en el navegador; utilizar **solo datos ficticios**, no información real de clientes.
- Ejecutar pruebas automatizadas con `node --test tests/chatbot.test.mjs`. La comprobación en móvil con una PWA realmente instalada sigue siendo un paso manual necesario.

Consulta [la auditoría y el procedimiento de pruebas del chatbot](docs/CHATBOT.md) para archivos modificados, seguridad, despliegue y limitaciones.
