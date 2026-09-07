import { useEffect } from "react";
import {
  Alert,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
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
  loyalty,
  loyaltyLoading,
  canRedeemLoyalty,
  useLoyaltyReward,
  setUseLoyaltyReward,
}) {
  const theme = useTheme();
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));
  const paymentMethods = currentBusiness?.paymentMethods || [];
  const activePaymentMethods = paymentMethods.filter((method) => method.active !== false);
  const validPaymentMethod = activePaymentMethods.some((method) => method.method === form.paymentMethod);

  useEffect(() => {
    if (!currentBusiness || validPaymentMethod) return;
    const fallback = activePaymentMethods[0]?.method || "cash";
    if (form.paymentMethod !== fallback) handleChange("paymentMethod", fallback);
  }, [activePaymentMethods, currentBusiness, form.paymentMethod, handleChange, validPaymentMethod]);

  if (!currentBusiness) return null;

  const subtotal = Number(currentBusiness.total || 0);
  const rewardPercent = Number(loyalty?.program?.rewardPercent || 0);
  const estimatedDiscount = useLoyaltyReward ? Number((subtotal * (rewardPercent / 100)).toFixed(2)) : 0;
  const estimatedTotal = Number(Math.max(0, subtotal - estimatedDiscount).toFixed(2));

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth fullScreen={isSmall} PaperProps={{ sx: { borderRadius: isSmall ? 0 : "10px" } }}>
      <DialogTitle sx={{ pb: 1 }}>
        <Typography variant="h5" fontWeight={400}>Confirmar pedido</Typography>
      </DialogTitle>

      <DialogContent sx={{ pt: 2 }}>
        <Stack spacing={3}>
          <OrderTypeSelector orderType={orderType} onChange={setOrderType} />
          <ContactSection form={form} errors={errors} onChange={handleChange} />
          <PaymentMethodSelector paymentMethod={form.paymentMethod} methods={paymentMethods} onChange={(value) => handleChange("paymentMethod", value)} />
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

          {!loyaltyLoading && canRedeemLoyalty && (
            <Alert severity="success" variant="outlined" sx={{ alignItems: "center" }}>
              <FormControlLabel
                control={<Checkbox checked={useLoyaltyReward} onChange={(event) => setUseLoyaltyReward(event.target.checked)} />}
                label={`Usar 1 recompensa de ${rewardPercent}% (${loyalty?.progress?.availableRewards || 0} disponible${loyalty?.progress?.availableRewards === 1 ? "" : "s"})`}
              />
              <Typography variant="caption" color="text.secondary" display="block">
                El descuento final se valida y calcula en el servidor al crear la orden.
              </Typography>
            </Alert>
          )}

          <Divider />
          <Stack spacing={0.75}>
            {useLoyaltyReward && canRedeemLoyalty && (
              <>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary">Subtotal</Typography>
                  <Typography>${subtotal.toFixed(2)}</Typography>
                </Stack>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="success.main">Recompensa {rewardPercent}%</Typography>
                  <Typography color="success.main">-${estimatedDiscount.toFixed(2)}</Typography>
                </Stack>
              </>
            )}
            <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={0.5}>
              <Typography variant="h6">Total a pagar:</Typography>
              <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                ${(useLoyaltyReward && canRedeemLoyalty ? estimatedTotal : subtotal).toFixed(2)}
              </Typography>
            </Stack>
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
