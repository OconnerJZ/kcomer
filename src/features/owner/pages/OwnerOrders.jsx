import {
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import useBusinessOrders from "@Features/orders/hooks/useBusinessOrders";
import { useOrderFilters } from "@Features/orders/hooks/useOrderFilters";
import { useOrderDialog } from "@Features/orders/hooks/useOrderDialog";
import OrderFilters from "@Features/orders/components/OrderFilters";
import OrderOperationsSummary from "@Features/orders/components/OrderOperationsSummary";
import OrderTable from "@Features/orders/components/OrderTable";
import OrderCard from "@Features/orders/components/OrderCard";
import OrderDialog from "@Features/orders/components/OrderDialog";
import EmptyState from "@Features/orders/components/EmptyState";
import { ORDER_STATUS } from "@Features/orders/model/orderStatus";
import { getOrderUrgency } from "@Features/orders/model/orderPriority";

const matchesOperationalFilter = (order, filter, now) => {
  if (!filter) return true;

  if (filter === "new") {
    return order.status === "pending" && getOrderUrgency(order, now).level === "new";
  }

  if (filter === "preparing") {
    return ["accepted", "preparing"].includes(order.status);
  }

  if (filter === "ready") {
    return order.status === "ready";
  }

  if (filter === "overdue") {
    return getOrderUrgency(order, now).level === "overdue";
  }

  return true;
};

const OwnerOrders = ({ businessId, focusedOrderId = null, onFocusHandled }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [operationalFilter, setOperationalFilter] = useState(null);
  const [now, setNow] = useState(() => Date.now());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const {
    orders,
    loading,
    updateOrderStatus,
    refreshOrders,
  } = useBusinessOrders(businessId);

  const { filterStatus, setFilterStatus, filteredOrders: statusFilteredOrders } = useOrderFilters(orders);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const operationalCounts = useMemo(
    () => ({
      new: orders.filter((order) => matchesOperationalFilter(order, "new", now)).length,
      preparing: orders.filter((order) => matchesOperationalFilter(order, "preparing", now)).length,
      ready: orders.filter((order) => matchesOperationalFilter(order, "ready", now)).length,
      overdue: orders.filter((order) => matchesOperationalFilter(order, "overdue", now)).length,
    }),
    [orders, now],
  );

  const filteredOrders = useMemo(
    () => statusFilteredOrders.filter((order) => matchesOperationalFilter(order, operationalFilter, now)),
    [statusFilteredOrders, operationalFilter, now],
  );

  const {
    isOpen,
    order: selectedOrder,
    openDialog,
    closeDialog,
  } = useOrderDialog();

  useEffect(() => {
    if (focusedOrderId == null || loading || orders.length === 0) return;

    const targetOrder = orders.find(
      (order) => String(order.id) === String(focusedOrderId),
    );

    if (!targetOrder) return;

    setFilterStatus("all");
    setOperationalFilter(null);
    setHighlightedOrderId(targetOrder.id);
    openDialog(targetOrder);
    onFocusHandled?.();

    const timeout = window.setTimeout(() => {
      setHighlightedOrderId(null);
    }, 4500);

    return () => window.clearTimeout(timeout);
  }, [focusedOrderId, loading, orders, openDialog, onFocusHandled, setFilterStatus]);

  const handleOperationalFilter = (filter) => {
    setOperationalFilter(filter);
    if (filter) setFilterStatus("all");
  };

  const handleStatusFilter = (status) => {
    setFilterStatus(status);
    setOperationalFilter(null);
  };

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpdateStatus = async (orderId, newStatus, note = "") => {
    try {
      const result = await updateOrderStatus(orderId, newStatus, note);
      if (result.success) {
        const label = ORDER_STATUS[newStatus]?.label || newStatus;
        showSnackbar(`Orden actualizada a ${label}`, "success");
        closeDialog();
      }
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
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
      <OrderOperationsSummary
        counts={operationalCounts}
        activeKey={operationalFilter}
        onSelect={handleOperationalFilter}
      />

      <OrderFilters
        filterStatus={filterStatus}
        onFilterChange={handleStatusFilter}
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
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerOrders;
