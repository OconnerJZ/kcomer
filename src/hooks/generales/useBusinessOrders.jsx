// src/hooks/useBusinessOrders.jsx
// Hook para OWNER/ADMIN - MEJORADO con actualizaciones optimistas

import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import socketService from "@Services/socketService";
import { ordersAPI, handleApiError } from "@Api";

export const useBusinessOrders = (businessId) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const mountedRef = useRef(true);
  const loadingRef = useRef(false);

  // ============================================================================
  // LOAD ORDERS
  // ============================================================================

  const loadOrders = useCallback(async () => {
    if (!businessId) return;
    if (loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await ordersAPI.getByBusiness(businessId);

      if (!response?.data?.success) {
        throw new Error(response?.data?.message || "Error al cargar órdenes");
      }

      const loadedOrders = response.data.data || [];

      if (mountedRef.current) {
        setOrders(loadedOrders);
      }

      return { success: true, data: loadedOrders };
    } catch (err) {
      console.error("[useBusinessOrders] Error:", err);
      const errorMessage = handleApiError(err).message;
      if (mountedRef.current) {
        setError(errorMessage);
      }
      return { success: false, error: errorMessage };
    } finally {
      loadingRef.current = false;
      if (mountedRef.current) {
        setLoading(false);
      }
    }
  }, [businessId]);

  // ============================================================================
  // UPDATE ORDER STATUS - CON ACTUALIZACIÓN OPTIMISTA
  // ============================================================================

  const updateOrderStatus = useCallback(
    async (orderId, newStatus, additionalData = {}) => {
      if (!orderId || !newStatus) {
        throw new Error("Order ID y status son requeridos");
      }

      setError(null);

      // ✅ Guardar estado anterior para rollback
      const previousOrders = orders;

      // ✅ ACTUALIZACIÓN OPTIMISTA - UI se actualiza inmediatamente
      setOrders((prev) =>
        prev.map((order) =>
          order.id === orderId
            ? {
                ...order,
                status: newStatus,
                ...additionalData,
                updatedAt: new Date().toISOString(),
                statusHistory: [
                  ...(order.statusHistory || []),
                  {
                    status: newStatus,
                    note: additionalData.note || "",
                    timestamp: new Date().toISOString(),
                  },
                ],
              }
            : order
        )
      );

      try {
        const response = await ordersAPI.updateStatus(
          orderId,
          newStatus,
          additionalData
        );

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || "Error al actualizar");
        }

        const updatedOrder = response.data.data;
        if (updatedOrder) {
          setOrders((prev) =>
            prev.map((order) =>
              order.id === orderId ? { ...order, ...updatedOrder } : order
            )
          );
        }

        return { success: true, data: updatedOrder };
      } catch (err) {
        console.error("[useBusinessOrders] Error updating:", err);

        setOrders(previousOrders);

        const errorMessage = handleApiError(err).message;
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [orders]
  );

  // ============================================================================
  // SOCKET LISTENER - Solo para NUEVAS órdenes
  // ============================================================================

  const socket = socketService.socket;

  useEffect(() => {
    if(!socketService.isConnected()) return;
    if (!businessId) return;

    console.log(
      "[useBusinessOrders] Setting up listener for business:",
      businessId
    );

    if (!socket) {
      console.error("[useBusinessOrders] Socket not available");
      return;
    }

    socketService.joinBusiness(businessId)

    // Handler para NUEVAS órdenes
    const handleNewOrder = (newOrder) => {
      console.log("🔔 [useBusinessOrders] Nueva orden:", newOrder);

      if (!newOrder?.id) return;

      // ✅ Agregar orden a la lista sin flicker
      setOrders((prev) => {
        // Evitar duplicados
        const exists = prev.some((order) => order.id === newOrder.id);
        if (exists) {
          // Si ya existe, actualizar
          return prev.map((order) =>
            order.id === newOrder.id ? { ...order, ...newOrder } : order
          );
        }
        // Agregar al inicio
        return [newOrder, ...prev];
      });
    };

    // Registrar listener
    socket.on("order:new", handleNewOrder);

    console.log("✅ [useBusinessOrders] Listener registered");
    console.log(
      "   order:new listeners:",
      socket.listeners("order:new").length
    );

    // Cleanup
    return () => {
      console.log("[useBusinessOrders] Cleaning up");
      socket.off("order:new", handleNewOrder);
    };
  }, [businessId, socketService.connected]);

  // ============================================================================
  // AUTO LOAD ON MOUNT
  // ============================================================================

  useEffect(() => {
    if (businessId) {
      loadOrders();
    }
  }, [businessId, loadOrders]);

  // ============================================================================
  // SELECTORS MEMOIZADOS (para mejor performance)
  // ============================================================================

  const selectors = useMemo(
    () => ({
      getOrderById: (orderId) => orders.find((order) => order.id === orderId),

      getOrdersByStatus: (status) =>
        orders.filter((order) => order.status === status),

      getPendingOrders: () =>
        orders.filter((order) => order.status === "pending"),

      getActiveOrders: () =>
        orders.filter(
          (order) =>
            !["completed", "cancelled", "rejected"].includes(order.status)
        ),

      getTotalOrders: () => orders.length,

      hasOrders: () => orders.length > 0,
    }),
    [orders]
  );

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    orders,
    loading,
    error,

    // Actions
    loadOrders,
    updateOrderStatus,
    clearError: () => setError(null),

    // Selectors
    ...selectors,
  };
};

export default useBusinessOrders;
