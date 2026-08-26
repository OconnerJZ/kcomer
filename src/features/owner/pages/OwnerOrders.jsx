import {
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { useEffect, useState } from "react";
import useBusinessOrders from "@Features/orders/hooks/useBusinessOrders";
import { useOrderFilters } from "@Features/orders/hooks/useOrderFilters";
import { useOrderDialog } from "@Features/orders/hooks/useOrderDialog";
import OrderFilters from "@Features/orders/components/OrderFilters";
import OrderTable from "@Features/orders/components/OrderTable";
import OrderCard from "@Features/orders/components/OrderCard";
import OrderDialog from "@Features/orders/components/OrderDialog";
import EmptyState from "@Features/orders/components/EmptyState";
import { ORDER_STATUS } from "@Features/orders/model/orderStatus";

const OwnerOrders = ({ businessId, focusedOrderId = null, onFocusHandled }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { orders, loading, updateOrderStatus, refreshOrders } = useBusinessOrders(businessId);
  const { filterStatus, setFilterStatus, filteredOrders, now } = useOrderFilters(orders);
  const { isOpen, order: selectedOrder, openDialog, closeDialog } = useOrderDialog();

  useEffect(() => {
    if (focusedOrderId == null || loading || orders.length === 0) return;

    const targetOrder = orders.find((order) => String(order.id) === String(focusedOrderId));
    if (!targetOrder) return;

    setFilterStatus("all");
    setHighlightedOrderId(targetOrder.id);
    openDialog(targetOrder);
    onFocusHandled?.();

    const timeout = window.setTimeout(() => setHighlightedOrderId(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [focusedOrderId, loading, orders, openDialog, onFocusHandled, setFilterStatus]);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        showSnackbar(`Orden actualizada a ${ORDER_STATUS[newStatus].label}`, "success");
        closeDialog();
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleRefresh = async () => {
    try {
      await refreshOrders();
      showSnackbar("Órdenes actualizadas", "success");
    } catch (error) {
      showSnackbar(error?.message || "Error al actualizar", "error");
    }
  };

  return (
    <Box>
      <OrderFilters
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        orderCount={filteredOrders.length}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {filteredOrders.length === 0 && <EmptyState />}

      {!isMobile && filteredOrders.length > 0 && (
        <OrderTable
          orders={filteredOrders}
          onViewOrder={openDialog}
          onUpdateStatus={handleUpdateStatus}
          isSmall={isSmall}
          highlightedOrderId={highlightedOrderId}
          now={now}
        />
      )}

      {isMobile && filteredOrders.length > 0 && (
        <Stack spacing={{ xs: 0, sm: 2 }}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewOrder={openDialog}
              onUpdateStatus={handleUpdateStatus}
              isSmall={isSmall}
              highlighted={String(order.id) === String(highlightedOrderId)}
              now={now}
            />
          ))}
        </Stack>
      )}

      <OrderDialog
        open={isOpen}
        order={selectedOrder}
        onClose={closeDialog}
        onUpdateStatus={handleUpdateStatus}
        isSmall={isSmall}
      />

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar((current) => ({ ...current, open: false }))}
          sx={{ border: "1px solid #e0e0e0", borderRadius: 0, boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerOrders;
