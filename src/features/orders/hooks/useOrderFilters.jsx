import { useEffect, useMemo, useState } from "react";
import { sortOrdersByOperationalPriority } from "@Features/orders/model/orderPriority";

export const useOrderFilters = (orders) => {
  const [filterStatus, setFilterStatus] = useState("all");
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const filteredOrders = useMemo(() => {
    const filtered =
      filterStatus === "all"
        ? orders
        : orders.filter((order) => order.status === filterStatus);

    return sortOrdersByOperationalPriority(filtered, now);
  }, [orders, filterStatus, now]);

  return { filterStatus, setFilterStatus, filteredOrders, now };
};
