export const DASHBOARD_TABS = Object.freeze([
  { id: 0, label: "Órdenes", mobileLabel: "Órdenes", icon: "dashboard" },
  { id: 1, label: "Menú", mobileLabel: "Menú", icon: "restaurant" },
  { id: 2, label: "Reportes", mobileLabel: "Reportes", icon: "assessment" },
  { id: 3, label: "Configuración", mobileLabel: "Config", icon: "settings" },
]);

export const getVisibleDashboardTabs = (allowedTabs = [0, 1, 2, 3], pendingOrders = 0) =>
  DASHBOARD_TABS
    .filter((tab) => allowedTabs.includes(tab.id))
    .map((tab) => ({ ...tab, badge: tab.id === 0 ? pendingOrders : 0 }));
