import { ORDER_STATUS, COLOR_MAP } from "./orderStatus";

export const getStatusColor = (status) => {
  const statusConfig = ORDER_STATUS[status];
  return COLOR_MAP[statusConfig?.color] || COLOR_MAP.default;
};

export const formatOrderDate = (date, useFullDate = false) => {
  if (useFullDate) {
    return new Date(date).toLocaleDateString("es-MX", {
      dateStyle: "full",
    });
  }

  return new Date(date).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount) => `$${Number(amount || 0).toFixed(2)}`;
