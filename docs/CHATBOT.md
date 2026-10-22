# Continuación del chatbot · 22-10-2026

## Punto de partida
Rama base: `main`, commit `68379418bcea70ee0617b062dd30bedb3f54f688` (botón visible para abrir asistente).
No se alteran los contenidos corporativos, logos ni secciones aprobadas de `index.html`.
No hay compilador: el proyecto es HTML, CSS y JavaScript nativo, publicado como sitio estático en GitHub Pages.

## Componentes
- `index.html`: portada corporativa y botón `data-px-open-assistant`; carga `asistente-embebido.js`.
- `asistente-embebido.js`: chatbot flotante con respuestas locales basadas en reglas; no usa modelos externos ni consulta Supabase. El historial vive únicamente en el DOM de la pestaña; el botón «Borrar conversación» lo elimina. No se escriben mensajes a localStorage.
- `demo-chatbot.html`: demostración técnica completa y módulos de equipos/inventario/estadísticas *de demostración*; su almacenamiento local de equipos **no está cifrado**. Usar exclusivamente alias y datos ficticios. No está conectado al panel de órdenes reales.
- `gestion.html`: panel con autenticación y autorización de Supabase, exclusivamente online.
- `seguimiento.html`: consulta autenticada por un código de seguimiento de cliente mediante RPC de Supabase; requiere red; no se almacena en la caché.
- `sin-conexion.html`: borradores de trabajo locales cifrados, sincronización manual con autenticación de administrador cuando hay internet. Independiente de la demo.
- `sw.js` y `actualizacion.js`: precarga y refresco de archivos públicos de la misma fuente para navegador y PWA. `manifest.webmanifest` define instalación y accesos directos.

## Mejoras de esta fase
1. Priorización de humo, chispas y riesgos eléctricos, antes de reciclaje, seguimiento u otras respuestas.
2. Señalización real del modo local sin conexión en ambos asistentes, sin dejar de responder preguntas técnicas.
3. En la ventana flotante, bloqueo explicativo de enlaces a seguimiento y contacto cuando no hay red. El enlace a la demo local continúa disponible.
4. Borrado explícito del historial temporal del chat y explicación de privacidad.
5. Armonización de respuestas sobre reciclaje, reutilización, Pasaporte Tecnológico y funcionamiento sin red entre las dos experiencias.
6. Restricción de recomendaciones de manipulación eléctrica peligrosa en la demostración.
7. Renovación de caché a `pampanexo-public-v7-chat-20261022` y descripción/acceso directo del manifiesto.

## Protección de datos y permisos
El chatbot es **orientativo por reglas**. No hay un endpoint de IA generativa ni persistencia de sus mensajes. No hereda el acceso administrativo de Supabase.
Las credenciales no deben registrarse en la conversación. No almacenar `gestion.html`, `seguimiento.html`, respuestas a APIs o tokens en Cache Storage. `sw.js` solo maneja recursos estáticos públicos.
El proyecto Supabase `qzulvugtstkqohxcsbqf` dispone de seis tablas públicas con RLS activado. La comprobación de permisos real depende de las políticas de la base, no de ocultar botones.
Los avisos de seguridad de Supabase detectados deben revisarse aparte sin cambiar esta publicación: funciones `SECURITY DEFINER` expuestas intencionalmente a roles públicos/autenticados y protección contra contraseñas filtradas desactivada. Verificar que cada función valida roles y limita los datos devueltos, especialmente `px_public_tracking`.

## Pruebas
Automatizadas: ejecutar `node --test tests/chatbot.test.mjs` con Node 22. GitHub Actions (`.github/workflows/chatbot.yml`) ejecuta esas pruebas al publicar cambios.

Comprobación manual **en un navegador real**:
1. Abrir `index.html`, pulsar «Asistente técnico» y confirmar que responde sin errores de consola. Probar «no enciende», «reutilizar», «seguimiento» y «humo».
2. Verificar que «Borrar conversación» limpia la pantalla. Recargar y comprobar que la conversación anterior no se recupera.
3. Abrir la demo completa, probar orientación y navegación de pestañas. Registrar **solo datos ficticios** para verificar inventario y estadísticas.
4. Instalar la PWA (HTTPS), abrirla una vez con red y comprobar en DevTools > Application > Cache Storage la caché `pampanexo-public-v7-chat-20261022`. Usar la opción de actualización al reconectar.
5. Activar el modo Offline en DevTools, cerrar/abrir la PWA y repetir las preguntas de los pasos 1 y 3.
6. Sin conexión, probar que consultar orden/contacto desde el chatbot informa que necesita red; el enlace a demo sigue disponible. Las pantallas de gestión y seguimiento real no deben mostrar datos antiguos cacheados.
7. Sin conexión, abrir `sin-conexion.html` y guardar/desbloquear un borrador de prueba; no transmitirlo sin autorización. Al volver a conectarse, revisar que el contenido público se actualiza sin eliminar borradores cifrados.
8. Verificar diseño en móvil, teclado y lector de pantalla; no modificar imágenes, tamaños de logo ni estilos de portada aprobados.

**Nota:** la prueba automatizada es una validación de lógica/caché; no reemplaza la prueba manual en un dispositivo instalando la PWA.

## Archivos de esta entrega
- Modificados: `asistente-embebido.js`, `demo-chatbot.html`, `sw.js`, `manifest.webmanifest`, `README.md`.
- Nuevos: `tests/chatbot.test.mjs`, `.github/workflows/chatbot.yml`, `docs/CHATBOT.md`.

## Despliegue
Integrar a `main` tras revisar las pruebas, dejar que GitHub Pages publique los cambios y abrir la web con internet para descargar la caché nueva. La PWA instalada deberá recibir la actualización al reconectarse y revisitar la aplicación; **sin internet no puede descargar código nuevo**.
No hay nuevas variables de entorno, funciones de Supabase, tablas, claves ni permisos requeridos para este chatbot local.
