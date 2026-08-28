import { useState } from "react";
import {
  Box,
  Button,
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

const VIEW_OPTIONS = [
  { label: "Pedidos", value: "pedidos" },
  { label: "Ordenes", value: "ordenes" },
];

export default function CheckoutPage() {
  const [view, setView] = useState("pedidos");
  const checkout = useCheckoutController();

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
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Segmented
          value={view}
          onChange={setView}
          options={VIEW_OPTIONS}
        />

        {view === "pedidos" && <SharedOrderLauncher />}

        {view === "ordenes" && <MyOrders />}

        {view === "pedidos" && checkout.businesses.length === 0 && (
          <EmptyCartState />
        )}

        {view === "pedidos" && checkout.currentBusiness && (
          <Box sx={{ maxWidth: 900, mx: "auto", mt: { xs: 2, sm: 4 }, px: 2 }}>
            <CartBusinessTabs
              businesses={checkout.businesses}
              cart={checkout.cart}
              activeTab={checkout.activeTab}
              onChange={checkout.changeTab}
            />

            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">
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
