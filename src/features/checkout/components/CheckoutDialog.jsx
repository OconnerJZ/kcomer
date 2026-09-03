import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import ContactSection from "./ContactSection";
import DeliveryAddressSection from "./DeliveryAddressSection";
import OrderTypeSelector from "./OrderTypeSelector";
import PaymentMethodSelector from "./PaymentMethodSelector";

export default function CheckoutDialog({
  open,
  onClose,
  onConfirm,
  currentBusiness,
  orderType,
  setOrderType,
  addressType,
  setAddressType,
  form,
  errors,
  addresses,
  handleChange,
  handleNewAddressChange,
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const paymentMethods = currentBusiness?.paymentMethods || [];
  const activePaymentMethods = paymentMethods.filter((method) => method.active !== false);
  const validPaymentMethod = activePaymentMethods.some(
    (method) => method.method === form.paymentMethod,
  );

  useEffect(() => {
    if (!currentBusiness) return;
    if (validPaymentMethod) return;

    const fallback = activePaymentMethods[0]?.method || "cash";
    if (form.paymentMethod !== fallback) {
      handleChange("paymentMethod", fallback);
    }
  }, [
    activePaymentMethods,
    currentBusiness,
    form.paymentMethod,
    handleChange,
    validPaymentMethod,
  ]);

  if (!currentBusiness) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isSmall} PaperProps={{ sx: { borderRadius: isSmall ? 0 : "10px" } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={400}>Confirmar pedido</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <OrderTypeSelector orderType={orderType} onChange={setOrderType} />
          <ContactSection form={form} errors={errors} onChange={handleChange} />
          <PaymentMethodSelector
            paymentMethod={form.paymentMethod}
            methods={paymentMethods}
            onChange={(value) => handleChange("paymentMethod", value)}
          />
          {orderType === "delivery" && (
            <DeliveryAddressSection
              addressType={addressType}
              onAddressTypeChange={setAddressType}
              form={form}
              errors={errors}
              addresses={addresses}
              onChange={handleChange}
              onNewAddressChange={handleNewAddressChange}
            />
          )}
          <Divider />
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={.5}>
            <Typography variant="h6">Total a pagar:</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ${currentBusiness.total.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: { xs: 2, sm: 3 }, pb: { xs: 2, sm: 3 }, flexDirection: { xs: "column-reverse", sm: "row" } }}>
        <Button onClick={onClose} fullWidth={isSmall} sx={{ textTransform: "none" }}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" fullWidth={isSmall} sx={{ textTransform: "none", px: 3 }}>Confirmar Pedido</Button>
      </DialogActions>
    </Dialog>
  );
}
