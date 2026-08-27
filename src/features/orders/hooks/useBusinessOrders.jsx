import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  useGetOrdersByBusinessQuery,
  useOrderUpdateStatusMutation,
  useOrderUpdateKitchenItemMutation,
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

const recalcKitchenProgress = (order) => {
  const items = order?.items || [];
  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const ready = items.reduce((sum, item) => sum + (item.kitchenStatus === "ready" ? Number(item.quantity || 0) : 0), 0);
  order.kitchenProgress = { ready, total };
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
  const [updateKitchenItemMutation, { isLoading: updatingKitchen }] = useOrderUpdateKitchenItemMutation();

  const orders = useMemo(() => normalizeOrders(ordersResponse?.data || ordersResponse || []), [ordersResponse]);

  const updateOrderStatus = useCallback(async (orderId, newStatus, note = "") => {
    if (!orderId || !newStatus) throw new Error("Order ID y status son requeridos");

    setError(null);
    const timestamp = new Date().toISOString();
    const patch = dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      const items = getDraftOrders(draft);
      if (!items) return;
      const order = items.find((item) => String(item.id) === String(orderId));
      if (!order) return;
      order.status = newStatus;
      order.updatedAt = timestamp;
      if (Array.isArray(order.statusHistory)) {
        order.statusHistory.push({ status: newStatus, timestamp, note: note || `Estado cambiado a ${newStatus}`, optimistic: true });
      }
    }));

    try {
      await updateStatusMutation({ id: orderId, businessId, body: { status: newStatus, note: note || undefined } }).unwrap();
      return { success: true };
    } catch (err) {
      patch.undo();
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar estado";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [businessId, dispatch, queryArg, updateStatusMutation]);

  const updateKitchenItemStatus = useCallback(async (orderId, detailId, status) => {
    if (!orderId || !detailId || !status) throw new Error("Orden, producto y estado son requeridos");
    setError(null);

    const patch = dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      const items = getDraftOrders(draft);
      if (!items) return;
      const order = items.find((item) => String(item.id) === String(orderId));
      if (!order) return;
      const target = order.items?.find((item) => String(item.detailId) === String(detailId));
      if (!target) return;
      target.kitchenStatus = status;
      recalcKitchenProgress(order);
    }));

    try {
      const response = await updateKitchenItemMutation({ id: orderId, detailId, businessId, body: { status } }).unwrap();
      return { success: true, data: response?.data || response };
    } catch (err) {
      patch.undo();
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar producto";
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  }, [businessId, dispatch, queryArg, updateKitchenItemMutation]);

  useSocketEvent("order:new", (newOrder) => {
    if (!newOrder?.id) return;
    const eventBusinessId = newOrder.businessId ?? newOrder.business_id;
    if (eventBusinessId != null && String(eventBusinessId) !== String(businessId)) return;
    refreshOrders();
  }, {
    enabled: !!businessId,
    room: hasGlobalRealtimeScope ? undefined : { type: "business", id: businessId },
  });

  useSocketEvent("order:kitchen_item_update", (payload) => {
    if (!payload?.orderId || !payload?.detailId) return;
    const eventBusinessId = payload.businessId;
    if (eventBusinessId != null && String(eventBusinessId) !== String(businessId)) return;

    dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      const items = getDraftOrders(draft);
      if (!items) return;
      const order = items.find((item) => String(item.id) === String(payload.orderId));
      if (!order) return;
      const target = order.items?.find((item) => String(item.detailId) === String(payload.detailId));
      if (target) target.kitchenStatus = payload.status;
      if (payload.kitchenProgress) order.kitchenProgress = payload.kitchenProgress;
      else recalcKitchenProgress(order);
    }));
  }, {
    enabled: !!businessId,
    room: hasGlobalRealtimeScope ? undefined : { type: "business", id: businessId },
  });

  const selectors = useMemo(() => ({
    getOrderById: (orderId) => orders.find((order) => String(order.id) === String(orderId)),
    getOrdersByStatus: (status) => orders.filter((order) => order.status === status),
    getPendingOrders: () => orders.filter((order) => order.status === "pending"),
    getAcceptedOrders: () => orders.filter((order) => order.status === "accepted"),
    getPreparingOrders: () => orders.filter((order) => order.status === "preparing"),
    getReadyOrders: () => orders.filter((order) => order.status === "ready"),
    getInDeliveryOrders: () => orders.filter((order) => order.status === "in_delivery"),
    getActiveOrders: () => orders.filter((order) => !["completed", "cancelled"].includes(order.status)),
    getCompletedOrders: () => orders.filter((order) => ["completed", "cancelled"].includes(order.status)),
    getTotalOrders: () => orders.length,
    hasOrders: () => orders.length > 0,
    hasPendingOrders: () => orders.some((order) => order.status === "pending"),
  }), [orders]);

  return {
    orders,
    loading: loading || isFetching || updating || updatingKitchen,
    error: error || queryError?.data?.message || queryError?.message,
    updateOrderStatus,
    updateKitchenItemStatus,
    refreshOrders,
    clearError: () => setError(null),
    ...selectors,
  };
};

export default useBusinessOrders;
