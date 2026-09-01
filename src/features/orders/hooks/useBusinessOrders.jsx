import { useState, useCallback, useMemo } from "react";
import { useDispatch } from "react-redux";
import {
  useGetOrdersByBusinessQuery,
  useOrderUpdateStatusMutation,
  useOrderUpdateKitchenItemMutation,
} from "@Features/orders/api/orders.api";
import { api } from "@Shared/api/rtk/api";
import { normalizeOrders } from "@Features/orders/model/order";
import {
  patchKitchenItem,
  patchOrderStatus,
  patchTransferPayment,
  upsertOrder,
} from "@Features/orders/model/orderCache";
import { useSocketEvent } from "@Shared/hooks/useSocket";

export const useBusinessOrders = (businessId) => {
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const queryArg = useMemo(() => ({ businessId }), [businessId]);

  const {
    data: ordersResponse,
    isLoading: loading,
    isFetching,
    error: queryError,
    refetch: refreshOrders,
  } = useGetOrdersByBusinessQuery(queryArg, {
    skip: !businessId,
  });

  const [updateStatusMutation, { isLoading: updating }] = useOrderUpdateStatusMutation();
  const [updateKitchenItemMutation, { isLoading: updatingKitchen }] = useOrderUpdateKitchenItemMutation();

  const orders = useMemo(() => normalizeOrders(ordersResponse?.data || ordersResponse || []), [ordersResponse]);

  const updateOrderStatus = useCallback(async (orderId, newStatus, note = "") => {
    if (!orderId || !newStatus) throw new Error("Order ID y status son requeridos");

    setError(null);
    const timestamp = new Date().toISOString();
    const patch = dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      patchOrderStatus(draft, {
        orderId,
        status: newStatus,
        timestamp,
        note: note || `Estado cambiado a ${newStatus}`,
      });
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
      patchKitchenItem(draft, {
        orderId,
        detailId,
        status,
        promoteAcceptedToPreparing: true,
      });
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

  const roomOptions = {
    enabled: !!businessId,
    room: { type: "business", id: businessId },
  };

  useSocketEvent("order:new", (newOrder) => {
    if (!newOrder?.id) return;
    const eventBusinessId = newOrder.businessId ?? newOrder.business_id;
    if (eventBusinessId != null && String(eventBusinessId) !== String(businessId)) return;
    dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      upsertOrder(draft, newOrder, { prepend: true });
    }));
  }, roomOptions);

  useSocketEvent("order:updated", (updatedOrder) => {
    if (!updatedOrder?.id) return;
    const eventBusinessId = updatedOrder.businessId ?? updatedOrder.business_id;
    if (eventBusinessId != null && String(eventBusinessId) !== String(businessId)) return;
    dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      upsertOrder(draft, updatedOrder);
    }));
  }, roomOptions);

  useSocketEvent("order:kitchen_item_update", (payload) => {
    if (!payload?.orderId || !payload?.detailId) return;
    const eventBusinessId = payload.businessId;
    if (eventBusinessId != null && String(eventBusinessId) !== String(businessId)) return;

    dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      patchKitchenItem(draft, payload);
    }));
  }, roomOptions);

  useSocketEvent("order:transfer_payment_updated", (payload) => {
    if (!payload?.orderId) return;
    dispatch(api.util.updateQueryData("getOrdersByBusiness", queryArg, (draft) => {
      patchTransferPayment(draft, payload);
    }));
  }, roomOptions);

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
