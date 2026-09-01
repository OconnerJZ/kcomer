import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import {
  useCreateOrdersMutation,
  useOrderEditPendingItemsMutation,
  useOrderUpdateStatusMutation,
  useGetOrdersByUserQuery,
} from "@Features/orders/api/orders.api";
import { normalizeOrders } from "@Features/orders/model/order";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useSocketEvent } from "@Shared/hooks/useSocket";

const OrdersContext = createContext();

export const ORDER_STATUS = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  IN_DELIVERY: "in_delivery",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
};

export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: "Pendiente",
  [ORDER_STATUS.ACCEPTED]: "Aceptada",
  [ORDER_STATUS.PREPARING]: "Preparando",
  [ORDER_STATUS.READY]: "Lista",
  [ORDER_STATUS.IN_DELIVERY]: "En camino",
  [ORDER_STATUS.COMPLETED]: "Completada",
  [ORDER_STATUS.CANCELLED]: "Cancelada",
};

const validateOrderData = (orderData) => {
  if (!orderData) throw new Error("Datos de orden no proporcionados");
  if (!orderData.businessId) throw new Error("ID de negocio requerido");
  if (!Array.isArray(orderData.items)) throw new Error("Items de orden requeridos");
  if (orderData.items.length === 0) throw new Error("La orden debe contener al menos un item");
};

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth();
  const {
    data: ordersResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshOrders,
  } = useGetOrdersByUserQuery({ userId: user?.id }, { skip: !user?.id });

  const [createOrderMutation, { isLoading: creating }] = useCreateOrdersMutation();
  const [editPendingItemsMutation, { isLoading: editing }] = useOrderEditPendingItemsMutation();
  const [updateStatusMutation, { isLoading: updating }] = useOrderUpdateStatusMutation();
  const [error, setError] = useState(null);

  const orders = useMemo(() => normalizeOrders(ordersResponse?.data || ordersResponse || []), [ordersResponse]);
  const hasUserRealtimeRoom = Boolean(user?.id);

  useSocketEvent("order:status_update", (data) => {
    if (data?.orderId) refreshOrders();
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: user?.id } });

  useSocketEvent("order:kitchen_item_update", (data) => {
    if (data?.orderId && data?.detailId) refreshOrders();
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: user?.id } });

  useSocketEvent("order:updated", (data) => {
    if (data?.id) refreshOrders();
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: user?.id } });

  useSocketEvent("order:transfer_payment_updated", (data) => {
    if (data?.orderId) refreshOrders();
  }, { enabled: hasUserRealtimeRoom, room: { type: "user", id: user?.id } });

  const createOrder = useCallback(async (orderData) => {
    setError(null);
    try {
      validateOrderData(orderData);
      const payload = { ...orderData, userId: user.id, customerName: orderData.customerName || user.name || "Cliente" };
      const result = await createOrderMutation(payload).unwrap();
      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al crear orden";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user, createOrderMutation]);

  const editPendingOrder = useCallback(async (orderId, items, expectedVersion) => {
    if (!orderId) throw new Error("ID de orden requerido");
    if (!Array.isArray(items) || items.length === 0) throw new Error("La orden debe conservar al menos un producto");
    if (!Number.isInteger(Number(expectedVersion)) || Number(expectedVersion) < 1) throw new Error("Versión de orden requerida");
    setError(null);
    try {
      const response = await editPendingItemsMutation({
        id: orderId,
        userId: user?.id,
        body: { items, expectedVersion: Number(expectedVersion) },
      }).unwrap();
      await refreshOrders();
      return { success: true, data: response?.data || response };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "No fue posible modificar la orden";
      setError(errorMessage);
      return { success: false, error: errorMessage, status: err?.status };
    }
  }, [editPendingItemsMutation, refreshOrders, user?.id]);

  const updateOrderStatus = useCallback(async (orderId, status, note = "") => {
    if (!orderId) throw new Error("ID de orden requerido");
    if (!status) throw new Error("Estado requerido");
    setError(null);
    try {
      await updateStatusMutation({ id: orderId, userId: user?.id, body: { status, note: note || undefined } }).unwrap();
      return { success: true };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar estado";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [user?.id, updateStatusMutation]);

  const cancelOrder = useCallback(
    (orderId, reason = "Orden cancelada por el usuario") => updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason),
    [updateOrderStatus],
  );

  const selectors = useMemo(() => ({
    getOrdersByUser: (userId) => String(userId) === String(user?.id) ? orders : orders.filter((order) => String(order.userId) === String(userId)),
    getOrdersByBusiness: (businessId) => orders.filter((order) => order.businessId === businessId),
    getOrdersByStatus: (status) => orders.filter((order) => order.status === status),
    getOrderById: (orderId) => orders.find((order) => order.id === orderId),
    getPendingOrders: () => orders.filter((order) => order.status === ORDER_STATUS.PENDING),
    getActiveOrders: () => orders.filter((order) => ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(order.status)),
    getCompletedOrders: () => orders.filter((order) => [ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(order.status)),
  }), [orders, user?.id]);

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
    ORDER_STATUS,
    STATUS_LABELS,
  }), [orders, loading, creating, editing, updating, error, queryError, createOrder, editPendingOrder, updateOrderStatus, cancelOrder, refreshOrders, selectors]);

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return context;
};

export default useOrders;
