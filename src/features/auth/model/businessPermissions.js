export const hasBusinessMembership = (user) => Boolean(user?.businesses?.length);

export const hasBusinessPermission = (business, permission, { isAdmin = false } = {}) =>
  isAdmin || business?.membershipRole === "primary_owner" || business?.permissions?.includes(permission) === true;

export const getAllowedDashboardTabs = (business, { isAdmin = false } = {}) => {
  if (!business) return [];
  return [
    hasBusinessPermission(business, "orders.read", { isAdmin }) && 0,
    hasBusinessPermission(business, "menu.manage", { isAdmin }) && 1,
    hasBusinessPermission(business, "reports.read", { isAdmin }) && 2,
    (hasBusinessPermission(business, "settings.update", { isAdmin }) || hasBusinessPermission(business, "team.manage", { isAdmin })) && 3,
  ].filter((value) => value !== false);
};

export const getOrderCapabilities = (permissions = [], { isAdmin = false } = {}) => ({
  canAcceptOrders: isAdmin || permissions.includes("orders.accept"),
  canViewKitchen: isAdmin || permissions.includes("kitchen.read"),
  canUpdateKitchen: isAdmin || permissions.includes("kitchen.update"),
  canReviewPayments: isAdmin || permissions.includes("payments.review"),
});
