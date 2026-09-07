import { useState } from "react";
import { Box } from "@mui/material";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import useAuth from "@Features/auth/context/useAuth";
import CancelOrderDialog from "@Features/orders/components/customer/CancelOrderDialog";
import CustomerOrdersFeedback from "@Features/orders/components/customer/CustomerOrdersFeedback";
import CustomerOrdersGrid from "@Features/orders/components/customer/CustomerOrdersGrid";
import EditPendingOrderDialog from "@Features/orders/components/customer/EditPendingOrderDialog";
import EmptyCustomerOrders from "@Features/orders/components/customer/EmptyCustomerOrders";
import CustomerLoyaltySummary from "@Features/loyalty/components/CustomerLoyaltySummary";
import ReviewOrderDialog from "@Features/reviews/components/ReviewOrderDialog";
import useCustomerOrdersView from "@Features/orders/hooks/useCustomerOrdersView";

const MyOrders = () => {
  const { user } = useAuth();
  const view = useCustomerOrdersView(user?.id);
  const [reviewingOrder, setReviewingOrder] = useState(null);

  if (view.userOrders.length === 0) {
    return (
      <GeneralContent title="Mis Órdenes">
        <EmptyCustomerOrders />
      </GeneralContent>
    );
  }

  return (
    <GeneralContent title="Mis Órdenes">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2.5 } }}>
        <CustomerLoyaltySummary />
        <CustomerOrdersGrid
          orders={view.userOrders}
          expandedOrder={view.expandedOrder}
          expandedHistory={view.expandedHistory}
          onToggleOrder={view.toggleOrder}
          onToggleHistory={view.toggleHistory}
          onCancel={view.requestCancellation}
          onEdit={view.openEditor}
          onReview={setReviewingOrder}
        />
      </Box>

      <EditPendingOrderDialog
        open={Boolean(view.editingOrder)}
        order={view.editingOrder}
        onClose={view.closeEditor}
        onSave={view.saveEdit}
        saving={view.loading}
      />

      <CancelOrderDialog
        open={Boolean(view.cancelOrderId)}
        onClose={view.closeCancellation}
        onConfirm={view.confirmCancellation}
      />

      <ReviewOrderDialog
        open={Boolean(reviewingOrder)}
        order={reviewingOrder}
        onClose={() => setReviewingOrder(null)}
      />

      <CustomerOrdersFeedback feedback={view.feedback} onClose={view.closeFeedback} />
    </GeneralContent>
  );
};

export default MyOrders;
