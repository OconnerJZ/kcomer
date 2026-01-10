import { ORDER_STATUS } from "@Const/orderStatus"; 
import { COLOR_MAP } from "@Const/orderStatus"; 

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

  return new Date(date).toLocaleDateString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export const formatCurrency = (amount) => {
  return `$${amount.toFixed(2)}`;
};