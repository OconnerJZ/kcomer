import {
  Alert,
  Box,
  Button,
  ButtonGroup,
  Snackbar,
  Stack,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ViewList, ViewKanban } from "@mui/icons-material";
import { useEffect, useMemo, useState } from "react";
import useBusinessOrders from "@Features/orders/hooks/useBusinessOrders";
import { useOrderFilters } from "@Features/orders/hooks/useOrderFilters";
import { useOrderDialog } from "@Features/orders/hooks/useOrderDialog";
import OrderFilters from "@Features/orders/components/OrderFilters";
import OrderOperationsSummary from "@Features/orders/components/OrderOperationsSummary";
import OrderTable from "@Features/orders/components/OrderTable";
import OrderCard from "@Features/orders/components/OrderCard";
import OrderDialog from "@Features/orders/components/OrderDialog";
import KitchenBoard from "@Features/orders/components/KitchenBoard";
import EmptyState from "@Features/orders/components/EmptyState";
import { ORDER_STATUS } from "@Features/orders/model/orderStatus";
import { getOrderUrgency } from "@Features/orders/model/orderPriority";
import { getOrderCapabilities } from "@Features/auth/model/businessPermissions";

const matchesOperationalFilter = (order, filter, now) => {
  if (!filter) return true;
  if (filter === "new") return order.status === "pending" && getOrderUrgency(order, now).level === "new";
  if (filter === "preparing") return ["accepted", "preparing"].includes(order.status);
  if (filter === "ready") return order.status === "ready";
  if (filter === "overdue") return getOrderUrgency(order, now).level === "overdue";
  return true;
};

const PRODUCTION_STATUSES = ["accepted", "preparing", "ready"];

const OwnerOrders = ({ businessId, focusedOrderId = null, onFocusHandled, permissions = [], isAdmin = false }) => {
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const [highlightedOrderId, setHighlightedOrderId] = useState(null);
  const [operationalFilter, setOperationalFilter] = useState(null);
  const [viewMode, setViewMode] = useState("list");
  const [now, setNow] = useState(() => Date.now());

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const { canAcceptOrders, canViewKitchen, canUpdateKitchen } = getOrderCapabilities(permissions, { isAdmin });
  const displayedViewMode = canViewKitchen ? viewMode : "list";

  const { orders, loading, updateOrderStatus, updateKitchenItemStatus, refreshOrders } = useBusinessOrders(businessId);
  const { filterStatus, setFilterStatus, filteredOrders: statusFilteredOrders } = useOrderFilters(orders);

  useEffect(() => {
    const interval = window.setInterval(() => setNow(Date.now()), 60000);
    return () => window.clearInterval(interval);
  }, []);

  const operationalCounts = useMemo(() => ({
    new: orders.filter((order) => matchesOperationalFilter(order, "new", now)).length,
    preparing: orders.filter((order) => matchesOperationalFilter(order, "preparing", now)).length,
    ready: orders.filter((order) => matchesOperationalFilter(order, "ready", now)).length,
    overdue: orders.filter((order) => matchesOperationalFilter(order, "overdue", now)).length,
  }), [orders, now]);

  const filteredOrders = useMemo(
    () => statusFilteredOrders.filter((order) => matchesOperationalFilter(order, operationalFilter, now)),
    [statusFilteredOrders, operationalFilter, now],
  );

  const productionOrders = useMemo(() => orders.filter((order) => PRODUCTION_STATUSES.includes(order.status)), [orders]);
  const { isOpen, order: selectedOrderSnapshot, openDialog, closeDialog } = useOrderDialog();
  const selectedOrder = useMemo(
    () => selectedOrderSnapshot ? orders.find((order) => String(order.id) === String(selectedOrderSnapshot.id)) || selectedOrderSnapshot : null,
    [orders, selectedOrderSnapshot],
  );

  useEffect(() => {
    if (focusedOrderId == null || loading || orders.length === 0) return;
    const targetOrder = orders.find((order) => String(order.id) === String(focusedOrderId));
    if (!targetOrder) return;
    setViewMode("list");
    setFilterStatus("all");
    setOperationalFilter(null);
    setHighlightedOrderId(targetOrder.id);
    openDialog(targetOrder);
    onFocusHandled?.();
    const timeout = window.setTimeout(() => setHighlightedOrderId(null), 4500);
    return () => window.clearTimeout(timeout);
  }, [focusedOrderId, loading, orders, openDialog, onFocusHandled, setFilterStatus]);

  const handleOperationalFilter = (filter) => {
    setViewMode("list");
    setOperationalFilter(filter);
    if (filter) setFilterStatus("all");
  };

  const handleStatusFilter = (status) => {
    setViewMode("list");
    setFilterStatus(status);
    setOperationalFilter(null);
  };

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });

  const handleUpdateStatus = async (orderId, newStatus, note = "") => {
    try {
      const result = await updateOrderStatus(orderId, newStatus, note);
      if (result.success) {
        showSnackbar(`Orden actualizada a ${ORDER_STATUS[newStatus]?.label || newStatus}`, "success");
        closeDialog();
      }
    } catch (error) {
      showSnackbar(error.message, "error");
      throw error;
    }
  };

  const handleUpdateKitchenStatus = async (orderId, detailId, status) => {
    try {
      await updateKitchenItemStatus(orderId, detailId, status);
      showSnackbar(status === "ready" ? "Producto marcado como listo" : "Preparación iniciada", "success");
    } catch (error) {
      showSnackbar(error?.message || "No pudimos actualizar el producto", "error");
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
      <OrderOperationsSummary counts={operationalCounts} activeKey={operationalFilter} onSelect={handleOperationalFilter} />

      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.5} sx={{ mb: 1 }}>
        <Box sx={{ flex: 1 }}>
          {displayedViewMode === "list" && <OrderFilters filterStatus={filterStatus} onFilterChange={handleStatusFilter} orderCount={filteredOrders.length} onRefresh={handleRefresh} loading={loading} />}
        </Box>
        <ButtonGroup size="small" variant="outlined" aria-label="vista de órdenes" sx={{ alignSelf: { xs: "flex-end", sm: "center" } }}>
          <Button startIcon={<ViewList />} variant={displayedViewMode === "list" ? "contained" : "outlined"} onClick={() => setViewMode("list")} sx={{ textTransform: "none" }}>Lista</Button>
          {canViewKitchen && <Button startIcon={<ViewKanban />} variant={displayedViewMode === "production" ? "contained" : "outlined"} onClick={() => setViewMode("production")} sx={{ textTransform: "none" }}>Producción</Button>}
        </ButtonGroup>
      </Stack>

      {displayedViewMode === "production" ? (
        productionOrders.length > 0 ? <KitchenBoard orders={productionOrders} now={now} onViewOrder={openDialog} onUpdateStatus={canAcceptOrders ? handleUpdateStatus : undefined} /> : <EmptyState />
      ) : (
        <>
          {filteredOrders.length === 0 && <EmptyState />}
          {!isMobile && filteredOrders.length > 0 && <OrderTable orders={filteredOrders} onViewOrder={openDialog} onUpdateStatus={canAcceptOrders ? handleUpdateStatus : undefined} isSmall={isSmall} highlightedOrderId={highlightedOrderId} now={now} />}
          {isMobile && filteredOrders.length > 0 && (
            <Stack spacing={{ xs: 0, sm: 2 }}>
              {filteredOrders.map((order) => <OrderCard key={order.id} order={order} onViewOrder={openDialog} onUpdateStatus={canAcceptOrders ? handleUpdateStatus : undefined} isSmall={isSmall} highlighted={String(order.id) === String(highlightedOrderId)} now={now} />)}
            </Stack>
          )}
        </>
      )}

      <OrderDialog open={isOpen} order={selectedOrder} onClose={closeDialog} onUpdateStatus={canAcceptOrders ? handleUpdateStatus : undefined} onUpdateKitchenStatus={canUpdateKitchen ? handleUpdateKitchenStatus : undefined} isSmall={isSmall} />

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={() => setSnackbar((current) => ({ ...current, open: false }))} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={() => setSnackbar((current) => ({ ...current, open: false }))}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerOrders;
