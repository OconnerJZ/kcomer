import { useState, useMemo } from "react";

export const useOrderFilters = (orders) => {
  const [filterStatus, setFilterStatus] = useState("all");

  const filteredOrders = useMemo(() => {
    if (filterStatus === "all") {
      return orders;
    }
    return orders.filter((order) => order.status === filterStatus);
  }, [orders, filterStatus]);

  return {
    filterStatus,
    setFilterStatus,
    filteredOrders,
  };
};
