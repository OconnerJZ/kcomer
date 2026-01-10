// src/context/OrderContext.jsx
// REFACTORIZADO: Context con soporte de sockets para cliente

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
} from "react";
import PropTypes from "prop-types";
import { ordersAPI, handleApiError } from "@Api";
import { useAuth } from "./AuthContext";
import socketService from "@Services/socketService";

// ============================================================================
// CONSTANTS
// ============================================================================

const OrdersContext = createContext();
const ORDERS_STORAGE_KEY = "qscome_orders";

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
// STORAGE UTILITIES
// ============================================================================

const storage = {
  save: (orders) => {
    try {
      localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(orders));
    } catch (error) {
      console.error("Error saving orders to storage:", error);
    }
  },

  load: () => {
    try {
      const data = localStorage.getItem(ORDERS_STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error("Error loading orders from storage:", error);
      return [];
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(ORDERS_STORAGE_KEY);
    } catch (error) {
      console.error("Error clearing orders storage:", error);
    }
  },
};

// ============================================================================
// ORDER UTILITIES
// ============================================================================

const orderUtils = {
  createOfflineOrder: (orderData, userId) => ({
    id: `offline_${Date.now()}`,
    ...orderData,
    userId,
    status: ORDER_STATUS.PENDING,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    statusHistory: [
      {
        status: ORDER_STATUS.PENDING,
        note: "Orden creada offline",
        timestamp: new Date().toISOString(),
      },
    ],
  }),

  createStatusHistoryEntry: (status, note = "") => ({
    status,
    note: note || "(offline)",
    timestamp: new Date().toISOString(),
  }),

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

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // ============================================================================
  // SOCKET LISTENER - Solo para CLIENTES
  // ============================================================================
 const socket = socketService.socket;
  useEffect(() => {
    // Solo para clientes (no owners)
    if(!socketService.isConnected()) return;
    if (!user?.id || user?.role === 'owner' || user?.role === 'admin') {
      return;
    }

    console.log("[OrderContext] Setting up socket listener for user:", user.id);

   
    if (!socket) {
      console.error("[OrderContext] Socket not available");
      return;
    }
    
    socketService.joinUser(user.id)
    // Unirse a sala de usuario
    

    // Handler para actualizaciones de estado
    const handleStatusUpdate = (data) => {
      console.log("🔄 [OrderContext] Status update:", data);

      if (!data?.orderId) return;

      // Actualizar orden en la lista
      setOrders((prev) =>
        prev.map((order) =>
          order.id === data.orderId
            ? {
                ...order,
                status: data.status,
                statusHistory: data.statusHistory || order.statusHistory,
                updatedAt: new Date().toISOString(),
              }
            : order
        )
      );
    };

    // Registrar listener
    socket.on("order:status_update", handleStatusUpdate);

    console.log("✅ [OrderContext] Socket listener registered");
    console.log("   order:status_update listeners:", socket.listeners("order:status_update").length);

    // Cleanup
    return () => {
      console.log("[OrderContext] Cleaning up socket listener");
      socket.off("order:status_update", handleStatusUpdate);
    };
  }, [user?.id, user?.role, socketService.connected]);

  // ============================================================================
  // LOAD ORDERS
  // ============================================================================

  useEffect(() => {
    if (user?.id) {
      loadUserOrders(user.id);
    } else {
      setOrders([]);
      storage.clear();
    }
  }, [user?.id]);

  const loadUserOrders = useCallback(async (userId) => {
    setLoading(true);
    setError(null);

    try {
      const response = await ordersAPI.getByUser(userId);

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al cargar órdenes");
      }

      const ordersData = response.data.data || [];
      setOrders(ordersData);
      storage.save(ordersData);
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      
      // Load from cache as fallback
      const cachedOrders = storage.load();
      setOrders(cachedOrders);
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // CREATE ORDER
  // ============================================================================

  const createOrder = useCallback(async (orderData) => {
    setLoading(true);
    setError(null);

    try {
      // Validate order data
      orderUtils.validateOrderData(orderData);

      // Prepare payload
      const payload = {
        ...orderData,
        userId: user.id,
        customerName: orderData.customerName || user.name || "Cliente",
      };

      // Make API call
      const response = await ordersAPI.create(payload);

      if (!response.data.success) {
        throw new Error(response.data.message || "Error al crear orden");
      }

      const newOrder = response.data.data;

      // Update state and storage
      setOrders((prev) => {
        const updated = [newOrder, ...prev];
        storage.save(updated);
        return updated;
      });

      return { success: true, data: newOrder };
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);

      // Create offline order as fallback
      const offlineOrder = orderUtils.createOfflineOrder(orderData, user.id);

      setOrders((prev) => {
        const updated = [offlineOrder, ...prev];
        storage.save(updated);
        return updated;
      });

      return { success: false, data: offlineOrder, error: errorData.message };
    } finally {
      setLoading(false);
    }
  }, [user]);

  // ============================================================================
  // UPDATE ORDER STATUS
  // ============================================================================

  const updateOrderStatus = useCallback(async (orderId, status, note = "") => {
    if (!orderId) {
      throw new Error("ID de orden requerido");
    }
    if (!status) {
      throw new Error("Estado requerido");
    }

    setLoading(true);
    setError(null);

    // Optimistically update UI
    setOrders((prev) => {
      const updated = prev.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...(order.statusHistory || []),
                orderUtils.createStatusHistoryEntry(status, note),
              ],
            }
          : order
      );
      storage.save(updated);
      return updated;
    });

    try {
      await ordersAPI.updateStatus(orderId, status, note);
      return { success: true };
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      
      // UI already updated optimistically, keep changes
      return { success: false, error: errorData.message };
    } finally {
      setLoading(false);
    }
  }, []);

  // ============================================================================
  // CANCEL ORDER
  // ============================================================================

  const cancelOrder = useCallback(
    (orderId, reason = "Orden cancelada por el usuario") => {
      return updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, reason);
    },
    [updateOrderStatus]
  );

  // ============================================================================
  // REFRESH ORDERS
  // ============================================================================

  const refreshOrders = useCallback(() => {
    if (user?.id) {
      return loadUserOrders(user.id);
    }
  }, [user?.id, loadUserOrders]);

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

      getOrderById: (orderId) =>
        orders.find((order) => order.id === orderId),

      getPendingOrders: () =>
        orders.filter((order) => order.status === ORDER_STATUS.PENDING),

      getActiveOrders: () =>
        orders.filter(
          (order) =>
            ![ORDER_STATUS.COMPLETED, ORDER_STATUS.CANCELLED].includes(
              order.status
            )
        ),

      getCompletedOrders: () =>
        orders.filter(
          (order) =>
            order.status === ORDER_STATUS.COMPLETED ||
            order.status === ORDER_STATUS.CANCELLED
        ),
    }),
    [orders]
  );

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const value = useMemo(
    () => ({
      // State
      orders,
      loading,
      error,

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
      error,
      createOrder,
      updateOrderStatus,
      cancelOrder,
      refreshOrders,
      selectors,
    ]
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