import {
  Box,
  Snackbar,
  Alert,
  useMediaQuery,
  useTheme,
  Stack,
} from "@mui/material";
import { useState } from "react";
import useBusinessOrders from "@Hooks/generales/useBusinessOrders";
import { useOrderFilters } from "@Hooks/generales/useOrderFilters";
import { useOrderDialog } from "@Hooks/generales/useOrderDialog";
import OrderFilters from "@Components/orders/OrderFilters";
import OrderTable from "@Components/orders/OrderTable";
import OrderCard from "@Components/orders/OrderCard";
import OrderDialog from "@Components/orders/dialog/OrderDialog";
import EmptyState from "@Components/orders/EmptyState";
import { ORDER_STATUS } from "@Const/orderStatus";

const OwnerOrders = ({ businessId }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  const { orders, loading, updateOrderStatus, loadOrders } = useBusinessOrders(businessId);

  const { filterStatus, setFilterStatus, filteredOrders } =
    useOrderFilters(orders);

  const {
    isOpen,
    order: selectedOrder,
    openDialog,
    closeDialog,
  } = useOrderDialog();

  // Handlers
  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const result = await updateOrderStatus(orderId, newStatus);
      if (result.success) {
        showSnackbar(
          `Orden actualizada a ${ORDER_STATUS[newStatus].label}`,
          "success"
        );
        closeDialog();
      }
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  const handleRefresh = async () => {
    try {
      await loadOrders();
      showSnackbar("Órdenes actualizadas", "success");
    } catch (error) {
      showSnackbar(error.message, "error");
    }
  };

  return (
    <Box>
      {/* Filtros */}
      <OrderFilters
        filterStatus={filterStatus}
        onFilterChange={setFilterStatus}
        orderCount={filteredOrders.length}
        onRefresh={handleRefresh}
        loading={loading}
      />

      {/* Empty State */}
      {filteredOrders.length === 0 && <EmptyState />}

      {/* Desktop: Tabla */}
      {!isMobile && filteredOrders.length > 0 && (
        <OrderTable
          orders={filteredOrders}
          onViewOrder={openDialog}
          onUpdateStatus={handleUpdateStatus}
          isSmall={isSmall}
        />
      )}

      {/* Mobile: Cards */}
      {isMobile && filteredOrders.length > 0 && (
        <Stack spacing={{ xs: 0, sm: 2 }}>
          {filteredOrders.map((order) => (
            <OrderCard
              key={order.id}
              order={order}
              onViewOrder={openDialog}
              onUpdateStatus={handleUpdateStatus}
              isSmall={isSmall}
            />
          ))}
        </Stack>
      )}

      {/* Dialog */}
      <OrderDialog
        open={isOpen}
        order={selectedOrder}
        onClose={closeDialog}
        onUpdateStatus={handleUpdateStatus}
        isSmall={isSmall}
      />

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
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