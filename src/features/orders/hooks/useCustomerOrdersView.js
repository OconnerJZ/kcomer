import { useCallback, useMemo, useState } from "react";
import { useOrders } from "../context/useOrders";
import { createOrdersFeedback, getOrderEditingConflict } from "../model/customerOrdersView";

const EMPTY_FEEDBACK = createOrdersFeedback();

export const useCustomerOrdersView = (userId) => {
  const {
    getOrdersByUser,
    cancelOrder,
    editPendingOrder,
    loading,
    refreshOrders,
  } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [feedback, setFeedback] = useState(EMPTY_FEEDBACK);
  const userOrders = getOrdersByUser(userId);
  const editingConflict = useMemo(
    () => getOrderEditingConflict(editingOrder, userOrders),
    [editingOrder, userOrders],
  );

  const showFeedback = useCallback((message, severity = "success") => {
    setFeedback(createOrdersFeedback(message, severity));
  }, []);

  const toggleOrder = useCallback((orderId) => {
    setExpandedOrder((current) => current === orderId ? null : orderId);
  }, []);

  const toggleHistory = useCallback((orderId) => {
    setExpandedHistory((current) => current === orderId ? null : orderId);
  }, []);

  const openEditor = useCallback((order) => setEditingOrder({ ...order }), []);
  const closeEditor = useCallback(() => setEditingOrder(null), []);
  const requestCancellation = useCallback((orderId) => setCancelOrderId(orderId), []);
  const closeCancellation = useCallback(() => setCancelOrderId(null), []);

  const confirmCancellation = useCallback(async () => {
    if (!cancelOrderId) return;
    const result = await cancelOrder(cancelOrderId);
    setCancelOrderId(null);
    showFeedback(
      result?.success ? "Orden cancelada" : result?.error || "No fue posible cancelar la orden",
      result?.success ? "success" : "error",
    );
  }, [cancelOrder, cancelOrderId, showFeedback]);

  const saveEdit = useCallback(async (items) => {
    if (!editingOrder || editingConflict) return;
    const result = await editPendingOrder(editingOrder.id, items, editingOrder.version);

    if (result.success) {
      setEditingOrder(null);
      showFeedback("Orden actualizada");
      return;
    }

    if (Number(result.status) === 409) {
      setEditingOrder(null);
      await refreshOrders();
      showFeedback(
        "La orden cambió mientras la editabas. Se cargó la versión más reciente y tus cambios no sobrescribieron los nuevos datos.",
        "warning",
      );
      return;
    }

    showFeedback(result.error || "No fue posible modificar la orden", "error");
  }, [editPendingOrder, editingConflict, editingOrder, refreshOrders, showFeedback]);

  const closeFeedback = useCallback(() => {
    if (editingConflict) setEditingOrder(null);
    setFeedback((current) => ({ ...current, open: false }));
  }, [editingConflict]);

  return {
    userOrders,
    expandedOrder,
    expandedHistory,
    editingOrder: editingConflict ? null : editingOrder,
    cancelOrderId,
    feedback: editingConflict
      ? { open: true, message: editingConflict.message, severity: editingConflict.severity }
      : feedback,
    loading,
    toggleOrder,
    toggleHistory,
    openEditor,
    closeEditor,
    requestCancellation,
    closeCancellation,
    confirmCancellation,
    saveEdit,
    closeFeedback,
  };
};

export default useCustomerOrdersView;
