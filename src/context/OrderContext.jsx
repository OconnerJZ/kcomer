import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import {
  useCreateOrdersMutation,
  useOrderUpdateStatusMutation,
  useGetOrdersByUserQuery,
} from "@Api/orders.api";
import { useAuth } from "./AuthContext";
import { useSocketEvent } from "@Hooks/components/useSocket";

// ============================================================================
// CONSTANTS
// ============================================================================

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

// ============================================================================
// ORDER UTILITIES
// ============================================================================

const orderUtils = {
  validateOrderData: (orderData) => {
    if (!orderData) {
      throw new Error("Datos de orden no proporcionados");
    }
    if (!orderData.businessId) {
      throw new Error("ID de negocio requerido");
    }
    if (!orderData.items || !Array.isArray(orderData.items)) {
      throw new Error("Items de orden requeridos");
    }
    if (orderData.items.length === 0) {
      throw new Error("La orden debe contener al menos un item");
    }
  },
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const OrdersProvider = ({ children }) => {
  const { user } = useAuth();

  // RTK Query hooks
  const {
    data: ordersResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshOrders,
  } = useGetOrdersByUserQuery(
    { userId: user?.id },
    {
      skip: !user?.id,
    },
  );

  const [createOrderMutation, { isLoading: creating }] =
    useCreateOrdersMutation();
  const [updateStatusMutation, { isLoading: updating }] =
    useOrderUpdateStatusMutation();

  const [error, setError] = useState(null);

  // Extraer orders del response
  const orders = useMemo(() => {
    return ordersResponse?.data || ordersResponse || [];
  }, [ordersResponse]);

  // ============================================================================
  // SOCKET LISTENER - Solo para CLIENTES
  // ============================================================================
  // Reactivo: se engancha en cuanto el socket conecta y se re-suscribe tras
  // cada reconexión. Sin race condition ni stale closures.

  const isCustomer =
    !!user?.id && user?.role !== "owner" && user?.role !== "admin";

  useSocketEvent(
    "order:status_update",
    (data) => {
      if (!data?.orderId) return;
      // La invalidación real de la cache la maneja RTK Query en el refetch.
      refreshOrders();
    },
    {
      enabled: isCustomer,
      room: { type: "user", id: user?.id },
    },
  );

  // ============================================================================
  // CREATE ORDER
  // ============================================================================

  const createOrder = useCallback(
    async (orderData) => {
      setError(null);

      try {
        orderUtils.validateOrderData(orderData);

        const payload = {
          ...orderData,
          userId: user.id,
          customerName: orderData.customerName || user.name || "Cliente",
        };

        const result = await createOrderMutation(payload).unwrap();

        return { success: true, data: result };
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.message || "Error al crear orden";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [user, createOrderMutation],
  );

  // ============================================================================
  // UPDATE ORDER STATUS
  // ============================================================================

  const updateOrderStatus = useCallback(
    async (orderId, status, note = "") => {
      if (!orderId) {
        throw new Error("ID de orden requerido");
      }
      if (!status) {
        throw new Error("Estado requerido");
      }

      setError(null);

      try {
        await updateStatusMutation({
          id: orderId,
          userId: user?.id, // Para cache correcta
          body: {
            status,
            note: note || undefined,
          },
        }).unwrap();

        return { success: true };
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.message || "Error al actualizar estado";
        setError(errorMessage);

        return {
          success: false,
          error: errorMessage,
        };
      }
    },
    [user?.id, updateStatusMutation],
  );

  // ============================================================================
  // CANCEL ORDER
  // ============================================================================

  const cancelOrder = useCallback(
    (orderId, reason = "Orden cancelada por el usuario") => {
      return updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason);
    },
    [updateOrderStatus],
  );

  // ============================================================================
  // SELECTORS
  // ============================================================================

  const selectors = useMemo(
    () => ({
      getOrdersByUser: (userId) =>
        orders.filter((order) => order.userId === userId),

      getOrdersByBusiness: (businessId) =>
        orders.filter((order) => order.businessId === businessId),

      getOrdersByStatus: (status) =>
        orders.filter((order) => order.status === status),

      getOrderById: (orderId) => orders.find((order) => order.id === orderId),

      getPendingOrders: () =>
        orders.filter((order) => order.status === ORDER_STATUS.PENDING),

      getActiveOrders: () =>
        orders.filter(
          (order) =>
            ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(
              order.status,
            ),
        ),

      getCompletedOrders: () =>
        orders.filter(
          (order) =>
            order.status === ORDER_STATUS.COMPLETED ||
            order.status === ORDER_STATUS.CANCELLED,
        ),
    }),
    [orders],
  );

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo(
    () => ({
      // State
      orders,
      loading: loading || creating || updating,
      error: error || queryError?.message,

      // Actions
      createOrder,
      updateOrderStatus,
      cancelOrder,
      refreshOrders,

      // Selectors
      ...selectors,

      // Constants
      ORDER_STATUS,
      STATUS_LABELS,
    }),
    [
      orders,
      loading,
      creating,
      updating,
      error,
      queryError,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      refreshOrders,
      selectors,
    ],
  );

  return (
    <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>
  );
};

OrdersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error("useOrders debe usarse dentro de OrdersProvider");
  }
  return context;
};

export default useOrders;