import { useCallback, useState } from "react";
import { ORDER_STATUS } from "@Features/orders/model/orderStatus";

export const useOwnerOrderActions = ({
  updateOrderStatus,
  updateKitchenItemStatus,
  refreshOrders,
  closeDialog,
}) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const notify = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((current) => ({ ...current, open: false }));
  }, []);

  const updateStatus = useCallback(async (orderId, newStatus, note = "") => {
    try {
      const result = await updateOrderStatus(orderId, newStatus, note);
      if (result.success) {
        notify(`Orden actualizada a ${ORDER_STATUS[newStatus]?.label || newStatus}`);
        closeDialog();
      }
      return result;
    } catch (error) {
      notify(error?.message || "No pudimos actualizar la orden", "error");
      throw error;
    }
  }, [closeDialog, notify, updateOrderStatus]);

  const updateKitchenStatus = useCallback(async (orderId, detailId, status) => {
    try {
      const result = await updateKitchenItemStatus(orderId, detailId, status);
      notify(status === "ready" ? "Producto marcado como listo" : "Preparación iniciada");
      return result;
    } catch (error) {
      notify(error?.message || "No pudimos actualizar el producto", "error");
      return null;
    }
  }, [notify, updateKitchenItemStatus]);

  const refresh = useCallback(async () => {
    try {
      const result = await refreshOrders();
      notify("Órdenes actualizadas");
      return result;
    } catch (error) {
      notify(error?.message || "Error al actualizar", "error");
      return null;
    }
  }, [notify, refreshOrders]);

  return {
    snackbar,
    closeSnackbar,
    updateStatus,
    updateKitchenStatus,
    refresh,
  };
};

export default useOwnerOrderActions;
