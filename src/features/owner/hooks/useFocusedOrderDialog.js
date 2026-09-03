import { useEffect, useMemo, useState } from "react";
import { useOrderDialog } from "@Features/orders/hooks/useOrderDialog";

export const useFocusedOrderDialog = ({
  orders,
  loading,
  focusedOrderId,
  onFocusHandled,
  resetView,
}) => {
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const { isOpen, order: selectedOrderSnapshot, openDialog, closeDialog } = useOrderDialog();
  const selectedOrder = useMemo(
    () => selectedOrderSnapshot
      ? orders.find((order) => String(order.id) === String(selectedOrderSnapshot.id))
        || selectedOrderSnapshot
      : null,
    [orders, selectedOrderSnapshot],
  );

  useEffect(() => {
    if (focusedOrderId == null || loading || orders.length === 0) return undefined;
    const targetOrder = orders.find((order) => String(order.id) === String(focusedOrderId));
    if (!targetOrder) return undefined;

    let highlightTimeout;
    const focusTimeout = window.setTimeout(() => {
      resetView();
      setHighlightedOrderId(targetOrder.id);
      openDialog(targetOrder);
      onFocusHandled?.();
      highlightTimeout = window.setTimeout(() => setHighlightedOrderId(null), 4500);
    }, 0);

    return () => {
      window.clearTimeout(focusTimeout);
      if (highlightTimeout) window.clearTimeout(highlightTimeout);
    };
  }, [focusedOrderId, loading, onFocusHandled, openDialog, orders, resetView]);

  return {
    isOpen,
    selectedOrder,
    highlightedOrderId,
    openDialog,
    closeDialog,
  };
};

export default useFocusedOrderDialog;
