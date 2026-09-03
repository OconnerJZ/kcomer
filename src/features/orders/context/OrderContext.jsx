import {
  useState,
  useMemo,
  useCallback,
} from "react";
import { useDispatch } from "react-redux";
import PropTypes from "prop-types";
import {
  useCreateOrdersMutation,
  useOrderEditPendingItemsMutation,
  useOrderUpdateStatusMutation,
  useGetOrdersByUserQuery,
} from "@Features/orders/api/orders.api";
import { normalizeOrders } from "@Features/orders/model/order";
import {
  patchKitchenItem,
  patchOrderStatus,
  patchTransferPayment,
  upsertOrder,
} from "@Features/orders/model/orderCache";
import useAuth from "@Features/auth/context/useAuth";
import { useSocketEvent } from "@Shared/hooks/useSocket";
import { api } from "@Shared/api/rtk/api";
import { ORDER_STATUS_VALUES, STATUS_LABELS } from "@Features/orders/model/orderStatus";
import { OrdersContext } from "@Features/orders/context/useOrders";

const validateOrderData = (orderData) => {
  if (!orderData) throw new Error("Datos de orden no proporcionados");
  if (!orderData.businessId) throw new Error("ID de negocio requerido");
  if (!Array.isArray(orderData.items)) throw new Error("Items de orden requeridos");
  if (orderData.items.length === 0) throw new Error("La orden debe contener al menos un item");
};

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth();
  const userId = user?.id;
  const userName = user?.name;
  const dispatch = useDispatch();
  const queryArg = useMemo(() => ({ userId }), [userId]);
  const {
    data: ordersResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshOrders,
  } = useGetOrdersByUserQuery(queryArg, { skip: !userId });

  const [createOrderMutation, { isLoading: creating }] = useCreateOrdersMutation();
  const [editPendingItemsMutation, { isLoading: editing }] = useOrderEditPendingItemsMutation();
  const [updateStatusMutation, { isLoading: updating }] = useOrderUpdateStatusMutation();
  const [error, setError] = useState(null);

  const orders = useMemo(() => normalizeOrders(ordersResponse?.data || ordersResponse || []), [ordersResponse]);
  const hasUserRealtimeRoom = Boolean(userId);

  useSocketEvent("order:status_update", (data) => {
    if (!data?.orderId) return;
    dispatch(api.util.updateQueryData("getOrdersByUser", queryArg, (draft) => {
      patchOrderStatus(draft, data);
    }));
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: userId } });

  useSocketEvent("order:kitchen_item_update", (data) => {
    if (!data?.orderId || !data?.detailId) return;
    dispatch(api.util.updateQueryData("getOrdersByUser", queryArg, (draft) => {
      patchKitchenItem(draft, data);
    }));
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: userId } });

  useSocketEvent("order:updated", (data) => {
    if (!data?.id) return;
    dispatch(api.util.updateQueryData("getOrdersByUser", queryArg, (draft) => {
      upsertOrder(draft, data);
    }));
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: userId } });

  useSocketEvent("order:transfer_payment_updated", (data) => {
    if (!data?.orderId) return;
    dispatch(api.util.updateQueryData("getOrdersByUser", queryArg, (draft) => {
      patchTransferPayment(draft, data);
    }));
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: userId } });

  const createOrder = useCallback(async (orderData) => {
    setError(null);
    try {
      validateOrderData(orderData);
      const payload = { ...orderData, userId, customerName: orderData.customerName || userName || "Cliente" };
      const result = await createOrderMutation(payload).unwrap();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al crear orden";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [createOrderMutation, userId, userName]);

  const editPendingOrder = useCallback(async (orderId, items, expectedVersion) => {
    if (!orderId) throw new Error("ID de orden requerido");
    if (!Array.isArray(items) || items.length === 0) throw new Error("La orden debe conservar al menos un producto");
    if (!Number.isInteger(Number(expectedVersion)) || Number(expectedVersion) < 1) throw new Error("Versión de orden requerida");
    setError(null);
    try {
      const response = await editPendingItemsMutation({
        id: orderId,
        userId,
        body: { items, expectedVersion: Number(expectedVersion) },
      }).unwrap();
      return { success: true, data: response?.data || response };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "No fue posible modificar la orden";
      setError(errorMessage);
      return { success: false, error: errorMessage, status: err?.status };
    }
  }, [editPendingItemsMutation, userId]);

  const updateOrderStatus = useCallback(async (orderId, status, note = "") => {
    if (!orderId) throw new Error("ID de orden requerido");
    if (!status) throw new Error("Estado requerido");
    setError(null);
    try {
      await updateStatusMutation({ id: orderId, userId, body: { status, note: note || undefined } }).unwrap();
      return { success: true };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar estado";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [updateStatusMutation, userId]);

  const cancelOrder = useCallback(
    (orderId, reason = "Orden cancelada por el usuario") => updateOrderStatus(orderId, ORDER_STATUS_VALUES.CANCELLED, reason),
    [updateOrderStatus],
  );

  const selectors = useMemo(() => ({
    getOrdersByUser: (requestedUserId) => String(requestedUserId) === String(userId) ? orders : orders.filter((order) => String(order.userId) === String(requestedUserId)),
    getOrdersByBusiness: (businessId) => orders.filter((order) => order.businessId === businessId),
    getOrdersByStatus: (status) => orders.filter((order) => order.status === status),
    getOrderById: (orderId) => orders.find((order) => order.id === orderId),
    getPendingOrders: () => orders.filter((order) => order.status === ORDER_STATUS_VALUES.PENDING),
    getActiveOrders: () => orders.filter((order) => ![ORDER_STATUS_VALUES.COMPLETED, ORDER_STATUS_VALUES.CANCELLED].includes(order.status)),
    getCompletedOrders: () => orders.filter((order) => [ORDER_STATUS_VALUES.COMPLETED, ORDER_STATUS_VALUES.CANCELLED].includes(order.status)),
  }), [orders, userId]);

  const value = useMemo(() => ({
    orders,
    loading: loading || creating || editing || updating,
    error: error || queryError?.message,
    createOrder,
    editPendingOrder,
    updateOrderStatus,
    cancelOrder,
    refreshOrders,
    ...selectors,
    ORDER_STATUS: ORDER_STATUS_VALUES,
    STATUS_LABELS,
  }), [orders, loading, creating, editing, updating, error, queryError, createOrder, editPendingOrder, updateOrderStatus, cancelOrder, refreshOrders, selectors]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

OrdersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default OrdersProvider;
