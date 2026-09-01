import PropTypes from "prop-types";
import { Alert, Box, Snackbar, useMediaQuery, useTheme } from "@mui/material";
import OrderDialog from "@Features/orders/components/OrderDialog";
import OrderOperationsSummary from "@Features/orders/components/OrderOperationsSummary";
import { getOrderCapabilities } from "@Features/auth/model/businessPermissions";
import OwnerOrdersContent from "../components/orders/OwnerOrdersContent";
import OwnerOrdersToolbar from "../components/orders/OwnerOrdersToolbar";
import { useFocusedOrderDialog } from "../hooks/useFocusedOrderDialog";
import { useOwnerOrderActions } from "../hooks/useOwnerOrderActions";
import { useOwnerOrdersView } from "../hooks/useOwnerOrdersView";

const OwnerOrders = ({
  ordersState,
  focusedOrderId = null,
  onFocusHandled,
  permissions = [],
  isAdmin = false,
}) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const {
    canAcceptOrders,
    canViewKitchen,
    canUpdateKitchen,
    canReviewPayments,
  } = getOrderCapabilities(permissions, { isAdmin });
  const {
    orders,
    loading,
    updateOrderStatus,
    updateKitchenItemStatus,
    refreshOrders,
  } = ordersState;

  const view = useOwnerOrdersView(orders, canViewKitchen);
  const dialog = useFocusedOrderDialog({
    orders,
    loading,
    focusedOrderId,
    onFocusHandled,
    resetView: view.resetForFocusedOrder,
  });
  const actions = useOwnerOrderActions({
    updateOrderStatus,
    updateKitchenItemStatus,
    refreshOrders,
    closeDialog: dialog.closeDialog,
  });
  const allowedStatusUpdate = canAcceptOrders ? actions.updateStatus : undefined;

  return (
    <Box>
      <OrderOperationsSummary
        counts={view.operationalCounts}
        activeKey={view.operationalFilter}
        onSelect={view.selectOperationalFilter}
      />
      <OwnerOrdersToolbar
        viewMode={view.displayedViewMode}
        canViewKitchen={canViewKitchen}
        filterStatus={view.filterStatus}
        orderCount={view.filteredOrders.length}
        loading={loading}
        onViewModeChange={view.setViewMode}
        onFilterChange={view.selectStatusFilter}
        onRefresh={actions.refresh}
      />
      <OwnerOrdersContent
        viewMode={view.displayedViewMode}
        filteredOrders={view.filteredOrders}
        productionOrders={view.productionOrders}
        isMobile={isMobile}
        isSmall={isSmall}
        highlightedOrderId={dialog.highlightedOrderId}
        now={view.now}
        onViewOrder={dialog.openDialog}
        onUpdateStatus={allowedStatusUpdate}
      />

      <OrderDialog
        open={dialog.isOpen}
        order={dialog.selectedOrder}
        onClose={dialog.closeDialog}
        onUpdateStatus={allowedStatusUpdate}
        onUpdateKitchenStatus={canUpdateKitchen ? actions.updateKitchenStatus : undefined}
        canReviewPayments={canReviewPayments}
        isSmall={isSmall}
      />

      <Snackbar
        open={actions.snackbar.open}
        autoHideDuration={4000}
        onClose={actions.closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={actions.snackbar.severity} onClose={actions.closeSnackbar}>
          {actions.snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

OwnerOrders.propTypes = {
  ordersState: PropTypes.shape({
    orders: PropTypes.arrayOf(PropTypes.object).isRequired,
    loading: PropTypes.bool.isRequired,
    updateOrderStatus: PropTypes.func.isRequired,
    updateKitchenItemStatus: PropTypes.func.isRequired,
    refreshOrders: PropTypes.func.isRequired,
  }).isRequired,
  focusedOrderId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  onFocusHandled: PropTypes.func,
  permissions: PropTypes.arrayOf(PropTypes.string),
  isAdmin: PropTypes.bool,
};

export default OwnerOrders;
