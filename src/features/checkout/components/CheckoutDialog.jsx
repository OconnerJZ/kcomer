import { useEffect } from "react";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Divider, Stack, Typography } from "@mui/material";
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
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
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
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">Total a pagar:</Typography>
            <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
              ${currentBusiness.total.toFixed(2)}
            </Typography>
          </Stack>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 3 }}>
        <Button onClick={onClose} sx={{ textTransform: "none" }}>Cancelar</Button>
        <Button onClick={onConfirm} variant="contained" sx={{ textTransform: "none", px: 3 }}>Confirmar Pedido</Button>
      </DialogActions>
    </Dialog>
  );
}
