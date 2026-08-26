import { useState, useCallback, useMemo } from "react";
import {
  useGetOrdersByBusinessQuery,
  useOrderUpdateStatusMutation,
} from "@Features/orders/api/orders.api";
import { useSocketEvent } from "@Shared/hooks/useSocket";

export const useBusinessOrders = (businessId) => {
  const [error, setError] = useState(null);
  const {
    data: ordersResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshOrders,
  } = useGetOrdersByBusinessQuery(
    { businessId },
    {
      skip: !businessId,
      pollingInterval: 30000,
    },
  );

  const [updateStatusMutation, { isLoading: updating }] = useOrderUpdateStatusMutation();

  const orders = useMemo(
    () => ordersResponse?.data || ordersResponse || [],
    [ordersResponse],
  );

  const updateOrderStatus = useCallback(
    async (orderId, newStatus, note = "") => {
      if (!orderId || !newStatus) {
        throw new Error("Order ID y status son requeridos");
      }

      setError(null);
      try {
        await updateStatusMutation({
          id: orderId,
          businessId,
          body: { status: newStatus, note: note || undefined },
        }).unwrap();
        return { success: true };
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.message || "Error al actualizar estado";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [businessId, updateStatusMutation],
  );

  useSocketEvent(
    "order:new",
    (newOrder) => {
      if (!newOrder?.id) return;
      refreshOrders();
    },
    {
      enabled: !!businessId,
      room: { type: "business", id: businessId },
    },
  );

  const selectors = useMemo(
    () => ({
      getOrderById: (orderId) => orders.find((order) => order.id === orderId),
      getOrdersByStatus: (status) => orders.filter((order) => order.status === status),
      getPendingOrders: () => orders.filter((order) => order.status === "pending"),
      getAcceptedOrders: () => orders.filter((order) => order.status === "accepted"),
      getPreparingOrders: () => orders.filter((order) => order.status === "preparing"),
      getReadyOrders: () => orders.filter((order) => order.status === "ready"),
      getInDeliveryOrders: () => orders.filter((order) => order.status === "in_delivery"),
      getActiveOrders: () =>
        orders.filter(
          (order) => !["completed", "cancelled", "rejected"].includes(order.status),
        ),
      getCompletedOrders: () =>
        orders.filter((order) =>
          ["completed", "cancelled", "rejected"].includes(order.status),
        ),
      getTotalOrders: () => orders.length,
      hasOrders: () => orders.length > 0,
      hasPendingOrders: () => orders.some((order) => order.status === "pending"),
    }),
    [orders],
  );

  return {
    orders,
    loading: loading || updating,
    error: error || queryError?.message,
    updateOrderStatus,
    refreshOrders,
    clearError: () => setError(null),
    ...selectors,
  };
};

export default useBusinessOrders;
