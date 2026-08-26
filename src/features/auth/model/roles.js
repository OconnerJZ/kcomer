export const ROLES = {
  CUSTOMER: "customer",
  USER: "user",
  OWNER: "owner",
  ADMIN: "admin",
};

export const OWNER_ROLES = [ROLES.OWNER, ROLES.ADMIN];
export const CUSTOMER_ROLES = [ROLES.CUSTOMER, ROLES.USER];

export const isOwner = (user) => !!user && OWNER_ROLES.includes(user.role);
export const isCustomer = (user) => !!user && !isOwner(user);
