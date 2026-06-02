import { useState, useEffect, useCallback, useMemo } from "react";
import { 
  useGetOrdersByBusinessQuery,
  useOrderUpdateStatusMutation,
} from "@Api/orders.api";
import socketService from "@Services/socketService";

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
      pollingInterval: 30000, // Refetch cada 30 segundos
    }
  );

  const [updateStatusMutation, { isLoading: updating }] = useOrderUpdateStatusMutation();

  const orders = useMemo(() => {
    return ordersResponse?.data || ordersResponse || [];
  }, [ordersResponse]);

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
          body: { 
            status: newStatus,
            note: note || undefined,
          },
        }).unwrap();

        return { success: true };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al actualizar estado";
        setError(errorMessage);
        throw new Error(errorMessage);
      }
    },
    [businessId, updateStatusMutation]
  );

  useEffect(() => {
    if (!socketService.isConnected()) return;
    if (!businessId) return;

    console.log("[useBusinessOrders] Setting up listener for business:", businessId);

    const socket = socketService.socket;
    if (!socket) {
      console.error("[useBusinessOrders] Socket not available");
      return;
    }

    // Unirse a sala del negocio
    socketService.joinBusiness(businessId);

    // Handler para NUEVAS órdenes
    const handleNewOrder = (newOrder) => {
      console.log("🔔 [useBusinessOrders] Nueva orden:", newOrder);

      if (!newOrder?.id) return;
      refreshOrders();
    };

    socket.on("order:new", handleNewOrder);

    console.log("✅ [useBusinessOrders] Listener registered");

    return () => {
      console.log("[useBusinessOrders] Cleaning up");
      socket.off("order:new", handleNewOrder);
    };
  }, [businessId, refreshOrders]);

  // ============================================================================
  // SELECTORS
  // ============================================================================

  const selectors = useMemo(() => ({
    getOrderById: (orderId) => 
      orders.find((order) => order.id === orderId),

    getOrdersByStatus: (status) =>
      orders.filter((order) => order.status === status),

    getPendingOrders: () =>
      orders.filter((order) => order.status === "pending"),

    getAcceptedOrders: () =>
      orders.filter((order) => order.status === "accepted"),

    getPreparingOrders: () =>
      orders.filter((order) => order.status === "preparing"),

    getReadyOrders: () =>
      orders.filter((order) => order.status === "ready"),

    getInDeliveryOrders: () =>
      orders.filter((order) => order.status === "in_delivery"),

    getActiveOrders: () =>
      orders.filter(
        (order) =>
          !["completed", "cancelled", "rejected"].includes(order.status)
      ),

    getCompletedOrders: () =>
      orders.filter(
        (order) =>
          order.status === "completed" || 
          order.status === "cancelled" || 
          order.status === "rejected"
      ),

    getTotalOrders: () => orders.length,

    hasOrders: () => orders.length > 0,

    hasPendingOrders: () => 
      orders.some((order) => order.status === "pending"),
  }), [orders]);

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