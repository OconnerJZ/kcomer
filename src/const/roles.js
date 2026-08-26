// src/const/roles.js
// Fuente única de verdad para los roles y los helpers de permisos.
// Evita las comprobaciones sueltas tipo `role === "customer"` que dejaban
// pasar roles no contemplados (ej: "user") a vistas de owner.

export const ROLES = {
  CUSTOMER: "customer",
  USER: "user",
  OWNER: "owner",
  ADMIN: "admin",
};

// Roles que pueden administrar un negocio.
export const OWNER_ROLES = [ROLES.OWNER, ROLES.ADMIN];

// Roles tratados como cliente final.
export const CUSTOMER_ROLES = [ROLES.CUSTOMER, ROLES.USER];

export const isOwner = (user) => !!user && OWNER_ROLES.includes(user.role);

export const isCustomer = (user) => !!user && !isOwner(user);