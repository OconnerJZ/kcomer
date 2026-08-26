export const ROLES = {
  CUSTOMER: "customer",
  USER: "user",
  OWNER: "owner",
  ADMIN: "admin",
};

export const OWNER_ROLES = [ROLES.OWNER, ROLES.ADMIN];
export const CUSTOMER_ROLES = [ROLES.CUSTOMER, ROLES.USER];

// Owner/admin mantienen alcance global sobre todos sus negocios.
// Los futuros roles operativos (manager, cashier, kitchen, etc.) no deben
// agregarse aquí: su alcance realtime será únicamente el negocio asignado.
export const GLOBAL_BUSINESS_REALTIME_ROLES = [ROLES.OWNER, ROLES.ADMIN];

export const isOwner = (user) => !!user && OWNER_ROLES.includes(user.role);
export const isCustomer = (user) => !!user && !isOwner(user);
export const hasGlobalBusinessRealtimeScope = (user) =>
  !!user && GLOBAL_BUSINESS_REALTIME_ROLES.includes(user.role);
