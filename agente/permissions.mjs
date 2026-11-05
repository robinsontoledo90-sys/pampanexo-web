// PAMPANEXO · Contrato de autorización para el futuro backend.
// Sin credenciales, llamadas de red ni datos reales.
export const ACTIONS = Object.freeze({
  PUBLIC_SERVICES: "public.services",
  PUBLIC_DIAGNOSIS: "public.diagnosis",
  CUSTOMER_ORDER: "customer.order.read",
  ADMIN_ORDERS: "admin.orders.list",
  ADMIN_ORDER_UPDATE: "admin.order.update",
  ADMIN_REPORT: "admin.report.generate"
});
export function authorize({action, user, orderOwnerId}) {
  if (typeof action !== "string") return false;
  if (action === ACTIONS.PUBLIC_SERVICES || action === ACTIONS.PUBLIC_DIAGNOSIS) return true;
  // El servidor debe obtener user de un token verificado, nunca del cuerpo de la solicitud.
  if (!user || user.verified !== true || typeof user.id !== "string" || !user.id) return false;
  if (action === ACTIONS.CUSTOMER_ORDER) {
    return typeof orderOwnerId === "string" && orderOwnerId.length > 0 && user.id === orderOwnerId;
  }
  if ([ACTIONS.ADMIN_ORDERS, ACTIONS.ADMIN_ORDER_UPDATE, ACTIONS.ADMIN_REPORT].includes(action)) {
    return user.role === "admin" && user.adminVerified === true;
  }
  return false;
}
