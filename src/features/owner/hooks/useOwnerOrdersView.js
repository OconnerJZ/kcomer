import { useCallback, useMemo, useState } from "react";
import { useOrderFilters } from "@Features/orders/hooks/useOrderFilters";
import {
  filterOrdersByOperation,
  getOperationalCounts,
  getProductionOrders,
} from "../model/ownerOrders";

export const useOwnerOrdersView = (orders, canViewKitchen) => {
  const [operationalFilter, setOperationalFilter] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const { filterStatus, setFilterStatus, filteredOrders: statusFilteredOrders, now } =
    useOrderFilters(orders);

  const displayedViewMode = canViewKitchen ? viewMode : "list";
  const operationalCounts = useMemo(
    () => getOperationalCounts(orders, now),
    [orders, now],
  );
  const filteredOrders = useMemo(
    () => filterOrdersByOperation(statusFilteredOrders, operationalFilter, now),
    [statusFilteredOrders, operationalFilter, now],
  );
  const productionOrders = useMemo(() => getProductionOrders(orders), [orders]);

  const selectOperationalFilter = useCallback((filter) => {
    setViewMode("list");
    setOperationalFilter(filter);
    if (filter) setFilterStatus("all");
  }, [setFilterStatus]);

  const selectStatusFilter = useCallback((status) => {
    setViewMode("list");
    setFilterStatus(status);
    setOperationalFilter(null);
  }, [setFilterStatus]);

  const resetForFocusedOrder = useCallback(() => {
    setViewMode("list");
    setFilterStatus("all");
    setOperationalFilter(null);
  }, [setFilterStatus]);

  return {
    now,
    filterStatus,
    operationalFilter,
    operationalCounts,
    displayedViewMode,
    filteredOrders,
    productionOrders,
    setViewMode,
    selectOperationalFilter,
    selectStatusFilter,
    resetForFocusedOrder,
  };
};

export default useOwnerOrdersView;
