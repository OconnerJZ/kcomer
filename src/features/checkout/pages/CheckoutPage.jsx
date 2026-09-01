import { useState } from "react";
import {
  Box,
  Button,
  CircularProgress,
  Divider,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { DeleteSweep } from "@mui/icons-material";
import { Segmented } from "antd";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import CartBusinessTabs from "@Features/cart/components/CartBusinessTabs";
import CartItemList from "@Features/cart/components/CartItemList";
import EmptyCartState from "@Features/cart/components/EmptyCartState";
import MyOrders from "@Features/orders/pages/MyOrders";
import CheckoutDialog from "../components/CheckoutDialog";
import useCheckoutController from "../hooks/useCheckoutController";
import SharedOrderLauncher from "@Features/shared-orders/components/SharedOrderLauncher";
import SharedOrderPage from "@Features/shared-orders/pages/SharedOrderPage";
import { useGetActiveSharedOrderQuery } from "@Features/shared-orders/api/sharedOrders.api";
import useOrderTarget from "@Features/shared-orders/hooks/useOrderTarget";

const VIEW_OPTIONS = [
  { label: "Pedidos", value: "pedidos" },
  { label: "Ordenes", value: "ordenes" },
];

const ORDER_MODE_OPTIONS = [
  { label: "Orden compartida", value: "shared" },
  { label: "Pedido individual", value: "individual" },
];

export default function CheckoutPage() {
  const [view, setView] = useState("pedidos");
  const [orderTarget, setOrderTarget] = useOrderTarget();
  const checkout = useCheckoutController();
  const { data: activeSharedOrder, isLoading: loadingSharedOrder } = useGetActiveSharedOrderQuery();
  const sharedMode = Boolean(activeSharedOrder?.id);
  const orderMode = sharedMode ? orderTarget : "individual";
  const showIndividualOrder = !sharedMode || orderMode === "individual";

  const handleConfirm = async () => {
    const result = await checkout.confirmCheckout();
    if (!result?.success && result?.error) {
      window.alert(result.error);
    }
  };

  const handleClearBusiness = () => {
    if (window.confirm("¿Eliminar todos los items de este negocio?")) {
      checkout.clearCurrentBusiness();
    }
  };

  return (
    <GeneralContent title="Pedidos">
      <Box sx={{ py: { xs: 2, sm: 3 } }}>
        <Box sx={{ display: "flex", justifyContent: "center", px: 1.5 }}>
          <Segmented value={view} onChange={setView} options={VIEW_OPTIONS} />
        </Box>

        {view === "pedidos" && loadingSharedOrder && <Box sx={{ py: 7 }}><CircularProgress /></Box>}

        {view === "pedidos" && !loadingSharedOrder && sharedMode && (
          <Box sx={{ maxWidth: 900, mx: "auto", mt: 2, px: { xs: 1.5, sm: 2 } }}>
            <Segmented value={orderMode} onChange={setOrderTarget} options={ORDER_MODE_OPTIONS} block />
          </Box>
        )}

        {view === "pedidos" && !loadingSharedOrder && sharedMode && orderMode === "shared" && (
          <Box sx={{ mt: 2, textAlign: "left" }}>
            <SharedOrderPage embedded sessionIdOverride={activeSharedOrder.id} />
          </Box>
        )}

        {view === "pedidos" && !loadingSharedOrder && !sharedMode && <SharedOrderLauncher />}

        {view === "ordenes" && <MyOrders />}

        {view === "pedidos" && !loadingSharedOrder && showIndividualOrder && checkout.businesses.length === 0 && (
          <EmptyCartState />
        )}

        {view === "pedidos" && !loadingSharedOrder && showIndividualOrder && checkout.currentBusiness && (
          <Box sx={{ maxWidth: 900, mx: "auto", mt: { xs: 2, sm: 3 }, px: { xs: 1.5, sm: 2 } }}>
            <CartBusinessTabs
              businesses={checkout.businesses}
              cart={checkout.cart}
              activeTab={checkout.activeTab}
              onChange={checkout.changeTab}
            />

            <Paper elevation={0} sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems={{ xs: "flex-start", sm: "center" }}
                gap={1}
                sx={{ mb: 2 }}
              >
                <Typography variant="h6" sx={{ textAlign: "left", overflowWrap: "anywhere" }}>
                  {checkout.currentBusiness.businessName}
                </Typography>

                <IconButton color="default" onClick={handleClearBusiness}>
                  <DeleteSweep />
                </IconButton>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              <CartItemList
                businessId={checkout.currentBusinessId}
                items={checkout.currentBusiness.items}
                onRemove={checkout.removeFromCart}
                onQuantityChange={checkout.changeQuantity}
              />

              <Divider sx={{ my: 2 }} />

              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography
                    variant="h6"
                    color="success.main"
                    sx={{ fontWeight: 700 }}
                  >
                    ${checkout.currentBusiness.total.toFixed(2)}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={checkout.openCheckout}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Realizar Pedido
                </Button>
              </Stack>
            </Paper>
          </Box>
        )}
      </Box>

      <CheckoutDialog
        open={checkout.checkoutDialogOpen}
        onClose={checkout.closeCheckout}
        onConfirm={handleConfirm}
        currentBusiness={checkout.currentBusiness}
        orderType={checkout.orderType}
        setOrderType={checkout.setOrderType}
        addressType={checkout.addressType}
        setAddressType={checkout.setAddressType}
        form={checkout.form}
        errors={checkout.errors}
        addresses={checkout.addresses}
        handleChange={checkout.handleChange}
        handleNewAddressChange={checkout.handleNewAddressChange}
      />
    </GeneralContent>
  );
}
