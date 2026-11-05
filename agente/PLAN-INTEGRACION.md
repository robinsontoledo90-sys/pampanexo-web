# PAMPANEXO · Contrato de integración del agente (experimental)

## Estado
Diseño únicamente. No desplegar ni conectar a datos reales hasta completar pruebas de autorización.

## Fuentes existentes
- `px_profiles`: roles `pending`, `admin`, `technician` y campo `active`.
- `px_orders`: órdenes y códigos de seguimiento.
- `px_clients`, `px_devices`, `px_order_events`, `px_passport_entries`.
- Todas las tablas tienen RLS.
- `px_public_tracking(p_code)` devuelve una vista pública limitada por código.

## Acciones autorizadas
| Acción | Público | Cliente verificado | Técnico activo | Administrador activo |
| --- | --- | --- | --- | --- |
| Consultar servicios y diagnóstico orientativo | Sí | Sí | Sí | Sí |
| Consultar seguimiento por código | Sí, limitado | Sí, limitado | Sí, limitado | Sí |
| Consultar todas las órdenes | No | No | No | Sí |
| Consultar órdenes asignadas | No | No | Sí | Sí |
| Cambiar estado de orden | No | No | Solo asignadas | Sí |
| Ver informes generales | No | No | No | Sí |

**Nota:** no existe aún un rol de cliente en `px_profiles`. El acceso a una orden propia mediante sesión requiere diseñar una vinculación de identidad; no inferir propiedad por el código ni por el email.

## Backend propuesto
1. Cloudflare Worker verifica el JWT con Supabase Auth; jamás acepta `role` o `user_id` declarados por el navegador como autorización.
2. Consulta `px_profiles` y verifica `active` y rol antes de cada acción privilegiada.
3. Usa token del usuario y RLS cuando corresponda; no expone `service_role` al cliente.
4. Herramientas permitidas por lista explícita, validación de argumentos, límites de solicitudes y auditoría.
5. El modelo de IA no ejecuta SQL arbitrario ni decide sus propios permisos.
6. Operaciones de escritura requieren confirmación y se registran.
7. Seguimiento público limita respuesta, tasa y exposición de códigos.
8. Revisar advertencias de funciones `SECURITY DEFINER` antes de habilitar operaciones reales.

## Pruebas necesarias
- Usuario anónimo no puede listar órdenes ni clientes.
- Técnico no puede acceder a órdenes ajenas.
- Usuario pendiente o inactivo no puede ejecutar acciones privilegiadas.
- Administrador activo puede consultar lo permitido.
- Código inválido o inexistente no revela datos.
- Intentos de prompt injection no alteran permisos.
- La interfaz de laboratorio no afecta `main` ni producción.

## Próxima entrega
Worker de solo lectura con respuestas simuladas y tests; después, integración autenticada en un entorno de prueba.
