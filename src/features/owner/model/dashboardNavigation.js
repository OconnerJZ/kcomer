export const DASHBOARD_TABS = Object.freeze([
  { id: 0, label: "Órdenes", mobileLabel: "Órdenes", icon: "dashboard" },
  { id: 1, label: "Menú", mobileLabel: "Menú", icon: "restaurant" },
  { id: 2, label: "Reportes", mobileLabel: "Reportes", icon: "assessment" },
  { id: 4, label: "Reseñas", mobileLabel: "Reseñas", icon: "reviews" },
  { id: 5, label: "Lealtad", mobileLabel: "Lealtad", icon: "loyalty" },
  { id: 6, label: "Marketing", mobileLabel: "Marketing", icon: "campaign" },
  { id: 3, label: "Configuración", mobileLabel: "Config", icon: "settings" },
]);

export const DASHBOARD_NAV_GROUPS = Object.freeze([
  {
    id: "operation",
    label: "Operación",
    mobileLabel: "Operación",
    icon: "dashboard",
    tabIds: [0, 1],
  },
  {
    id: "growth",
    label: "Crecimiento",
    mobileLabel: "Crecer",
    icon: "campaign",
    tabIds: [4, 5, 6],
  },
  {
    id: "management",
    label: "Gestión",
    mobileLabel: "Gestión",
    icon: "assessment",
    tabIds: [2, 3],
  },
]);

export const getVisibleDashboardTabs = (allowedTabs = [0, 1, 2, 4, 5, 6, 3], pendingOrders = 0) =>
  DASHBOARD_TABS
    .filter((tab) => allowedTabs.includes(tab.id))
    .map((tab) => ({ ...tab, badge: tab.id === 0 ? pendingOrders : 0 }));

export const getVisibleDashboardGroups = (
  allowedTabs = [0, 1, 2, 4, 5, 6, 3],
  pendingOrders = 0,
) => {
  const visibleTabs = getVisibleDashboardTabs(allowedTabs, pendingOrders);
  const tabsById = new Map(visibleTabs.map((tab) => [tab.id, tab]));

  return DASHBOARD_NAV_GROUPS
    .map((group) => {
      const items = group.tabIds.map((tabId) => tabsById.get(tabId)).filter(Boolean);
      return {
        ...group,
        items,
        badge: items.reduce((total, item) => total + Number(item.badge || 0), 0),
      };
    })
    .filter((group) => group.items.length > 0);
};
