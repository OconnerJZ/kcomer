import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  useGetOrdersByBusinessQuery,
  useOrderUpdateStatusMutation,
} from "@Features/orders/api/orders.api";
import { api } from "@Shared/api/rtk/api";
import { normalizeOrders } from "@Features/orders/model/order";
import { useAuth } from "@Features/auth/context/AuthContext";
import { hasGlobalBusinessRealtimeScope } from "@Features/auth/model/roles";
import { useSocketEvent } from "@Shared/hooks/useSocket";

const getDraftOrders = (draft) => {
  if (Array.isArray(draft)) return draft;
  if (Array.isArray(draft?.data)) return draft.data;
  return null;
};

export const useBusinessOrders = (businessId) => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [error, setError] = useState(null);
  const hasGlobalRealtimeScope = hasGlobalBusinessRealtimeScope(user);
  const queryArg = useMemo(() => ({ businessId }), [businessId]);

  const {
    data: ordersResponse,
    isLoading: loading,
    isFetching,
    error: queryError,
    refetch: refreshOrders,
  } = useGetOrdersByBusinessQuery(queryArg, {
    skip: !businessId,
    pollingInterval: 30000,
  });

  const [updateStatusMutation, { isLoading: updating }] = useOrderUpdateStatusMutation();

  const orders = useMemo(() => {
    const rawOrders = ordersResponse?.data || ordersResponse || [];
    return normalizeOrders(rawOrders);
  }, [ordersResponse]);

  const updateOrderStatus = useCallback(
    async (orderId, newStatus, note = "") => {
      if (!orderId || !newStatus) {
        throw new Error("Order ID y status son requeridos");
      }

      setError(null);
      const timestamp = new Date().toISOString();
      const patch = dispatch(
        api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
          const items = getDraftOrders(draft);
          if (!items) return;

          const order = items.find((item) => String(item.id) === String(orderId));
          if (!order) return;

          order.status = newStatus;
          order.updatedAt = timestamp;

          if (Array.isArray(order.statusHistory)) {
            order.statusHistory.push({
              status: newStatus,
              timestamp,
              note: note || `Estado cambiado a ${newStatus}`,
              optimistic: true,
            });
          }
        }),
      );

      try {
        await updateStatusMutation({
          id: orderId,
          businessId,
          body: { status: newStatus, note: note || undefined },
        }).unwrap();
        return { success: true };
      } catch (err) {
        patch.undo();
        const errorMessage =
          err?.data?.message || err?.message || "Error al actualizar estado";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [businessId, dispatch, queryArg, updateStatusMutation],
  );

  useSocketEvent(
    "order:new",
    (newOrder) => {
      if (!newOrder?.id) return;
      const eventBusinessId = newOrder.businessId ?? newOrder.business_id;
      if (eventBusinessId != null && String(eventBusinessId) !== String(businessId)) return;
      refreshOrders();
    },
    {
      enabled: !!businessId,
      room: hasGlobalRealtimeScope
        ? undefined
        : { type: "business", id: businessId },
    },
  );

  const selectors = useMemo(
    () => ({
      getOrderById: (orderId) => orders.find((order) => String(order.id) === String(orderId)),
      getOrdersByStatus: (status) => orders.filter((order) => order.status === status),
      getPendingOrders: () => orders.filter((order) => order.status === "pending"),
      getAcceptedOrders: () => orders.filter((order) => order.status === "accepted"),
      getPreparingOrders: () => orders.filter((order) => order.status === "preparing"),
      getReadyOrders: () => orders.filter((order) => order.status === "ready"),
      getInDeliveryOrders: () => orders.filter((order) => order.status === "in_delivery"),
      getActiveOrders: () =>
        orders.filter((order) => !["completed", "cancelled"].includes(order.status)),
      getCompletedOrders: () =>
        orders.filter((order) => ["completed", "cancelled"].includes(order.status)),
      getTotalOrders: () => orders.length,
      hasOrders: () => orders.length > 0,
      hasPendingOrders: () => orders.some((order) => order.status === "pending"),
    }),
    [orders],
  );

  return {
    orders,
    loading: loading || isFetching || updating,
    error: error || queryError?.data?.message || queryError?.message,
    updateOrderStatus,
    refreshOrders,
    clearError: () => setError(null),
    ...selectors,
  };
};

export default useBusinessOrders;
