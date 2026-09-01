export const DASHBOARD_STATE = Object.freeze({
  REGISTER_ACCESS: "register-access",
  LOADING: "loading",
  ERROR: "error",
  REGISTER_EMPTY: "register-empty",
  SELECTING: "selecting",
  READY: "ready",
});

export const getOwnerDashboardState = ({
  canAccess,
  loadingBusinesses,
  hasBusinesses,
  businessError,
  selectedBusiness,
}) => {
  if (!canAccess) return DASHBOARD_STATE.REGISTER_ACCESS;
  if (loadingBusinesses && !hasBusinesses) return DASHBOARD_STATE.LOADING;
  if (businessError) return DASHBOARD_STATE.ERROR;
  if (!hasBusinesses) return DASHBOARD_STATE.REGISTER_EMPTY;
  if (!selectedBusiness) return DASHBOARD_STATE.SELECTING;
  return DASHBOARD_STATE.READY;
};

export const getPendingOrdersCount = (orders = []) =>
  orders.filter((order) => order.status === "pending").length;

export const getDisplayedDashboardTab = (activeTab, allowedTabs = []) =>
  allowedTabs.includes(activeTab) ? activeTab : allowedTabs[0] ?? 0;

export const getNewestBusinessId = (refetchResult) => {
  const refreshed = refetchResult?.data?.data || refetchResult?.data || [];
  const businesses = Array.isArray(refreshed) ? refreshed : [];
  return businesses.at(-1)?.id ?? null;
};
