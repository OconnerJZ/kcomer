import {
  Dialog,
  DialogContent,
  Box,
  Stack,
  Typography,
  IconButton,
  Grid,
  Button,
  Fade,
  Chip,
  Divider,
} from "@mui/material";
import {
  Close,
  LocalShipping,
  PaidRounded,
  Payments,
  Storefront,
} from "@mui/icons-material";
import { ORDER_STATUS } from "@Features/orders/model/orderStatus";
import { formatCurrency, formatOrderDate, getStatusColor } from "@Features/orders/model/orderFormatters";
import CustomerInfo from "./dialog/CustomerInfo";
import DeliveryInfo from "./dialog/DeliveryInfo";
import OrderItems from "./dialog/OrderItems";
import OrderAuditTrail from "./dialog/OrderAuditTrail";
import ActionButton from "./ActionButton";
import TransferPaymentReviewPanel from "@Features/payments/components/TransferPaymentReviewPanel";

const SummaryPill = ({ icon: Icon, label, value }) => (
  <Box sx={{ px: 1.4, py: 1.1, border: "1px solid", borderColor: "divider", borderRadius: 2.5, bgcolor: "rgba(255,255,255,.78)" }}>
    <Stack direction="row" spacing={1} alignItems="center">
      <Icon sx={{ fontSize: 17, color: "text.secondary" }} />
      <Box minWidth={0}>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", lineHeight: 1.15 }}>{label}</Typography>
        <Typography variant="body2" fontWeight={800} noWrap>{value}</Typography>
      </Box>
    </Stack>
  </Box>
);

const StatusHistory = ({ history = [] }) => {
  if (!history?.length) return null;
  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: "rgba(255,255,255,.82)" }}>
      <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".64rem" }}>SEGUIMIENTO</Typography>
      <Typography variant="subtitle1" fontWeight={800} sx={{ mb: 2 }}>Historial de la orden</Typography>
      <Stack spacing={0}>
        {history.map((entry, index) => (
          <Box key={entry.id ?? `${entry.status}-${entry.createdAt || index}`} sx={{ display: "grid", gridTemplateColumns: "18px minmax(0,1fr) auto", gap: 1.25, alignItems: "start", pb: index === history.length - 1 ? 0 : 1.8 }}>
            <Box sx={{ position: "relative", display: "flex", justifyContent: "center", pt: .55 }}>
              <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: index === history.length - 1 ? "primary.main" : "grey.400", zIndex: 1 }} />
              {index !== history.length - 1 && <Box sx={{ position: "absolute", top: 12, width: 1.5, height: 28, bgcolor: "divider" }} />}
            </Box>
            <Box>
              <Typography variant="body2" fontWeight={750}>{ORDER_STATUS[entry.status]?.label || entry.status}</Typography>
              {(entry.note || entry.not) && <Typography variant="caption" color="text.secondary">{entry.note || entry.not}</Typography>}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>{entry.createdAt ? formatOrderDate(entry.createdAt, true) : ""}</Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

const OrderDialog = ({ open, order, onClose, onUpdateStatus, onUpdateKitchenStatus, canReviewPayments = false, isSmall }) => {
  if (!order) return null;
  const statusColor = getStatusColor(order.status);
  const typeLabel = order.orderType === "delivery" ? "Delivery" : "Recoger";
  const kitchenEnabled = Boolean(onUpdateKitchenStatus) && ["accepted", "preparing", "ready"].includes(order.status);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth fullScreen={isSmall} TransitionComponent={Fade}
      PaperProps={{ elevation: 0, sx: { borderRadius: isSmall ? 0 : 4, overflow: "hidden", border: "1px solid", borderColor: "divider", boxShadow: "0 28px 80px rgba(0,0,0,.18)", bgcolor: "rgba(250,250,250,.97)", backdropFilter: "blur(18px)" } }}>
      <DialogContent sx={{ p: 0 }}>
        <Box sx={{ px: { xs: 2, sm: 3 }, pt: { xs: 2, sm: 2.6 }, pb: 2.2, background: "linear-gradient(135deg, rgba(255,75,69,.08), rgba(255,255,255,.96) 52%)" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start" spacing={2}>
            <Box minWidth={0}>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontSize: ".64rem" }}>DETALLE DE ORDEN</Typography>
              <Stack direction="row" spacing={1.2} alignItems="center" flexWrap="wrap" useFlexGap sx={{ mt: .2 }}>
                <Typography variant="h4" fontWeight={900}>#{order.id}</Typography>
                <Chip size="small" label={ORDER_STATUS[order.status]?.label || order.status} sx={{ borderRadius: 999, fontWeight: 800, bgcolor: `${statusColor}14`, color: statusColor, border: `1px solid ${statusColor}45` }} />
                {order.version && <Chip size="small" variant="outlined" label={`v${order.version}`} sx={{ borderRadius: 999, fontWeight: 700 }} />}
              </Stack>
              <Typography variant="body2" color="text.secondary" sx={{ mt: .55 }}>{formatOrderDate(order.createdAt, true)}</Typography>
            </Box>
            <IconButton onClick={onClose} size="small" aria-label="cerrar detalle de orden" sx={{ bgcolor: "rgba(255,255,255,.75)", border: "1px solid", borderColor: "divider" }}><Close fontSize="small" /></IconButton>
          </Stack>

          <Typography variant="body2" fontWeight={800} sx={{ mt: .9 }}>{order.customerName || "Cliente"}</Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,minmax(0,1fr))" }, gap: 1.1, mt: 1.6 }}>
            <SummaryPill icon={order.orderType === "delivery" ? LocalShipping : Storefront} label="Entrega" value={typeLabel} />
            <SummaryPill icon={Payments} label="Pago" value={order.paymentMethod || "Efectivo"} />
            <SummaryPill icon={PaidRounded} label="Total" value={formatCurrency(order.total)} />
          </Box>
        </Box>

        <Box sx={{ p: { xs: 2, sm: 3 } }}>
          <Grid container spacing={2}>
            <Grid item xs={12}><OrderItems items={order.items} kitchenEnabled={kitchenEnabled} onUpdateKitchenStatus={(detailId, status) => onUpdateKitchenStatus?.(order.id, detailId, status)} /></Grid>
            <Grid item xs={12} md={6}><CustomerInfo order={order} /></Grid>
            <Grid item xs={12} md={6}><DeliveryInfo order={order} /></Grid>
            {order.paymentMethod === "transfer" && canReviewPayments && <Grid item xs={12}><TransferPaymentReviewPanel order={order} /></Grid>}
            {order.statusHistory?.length > 0 && <Grid item xs={12}><StatusHistory history={order.statusHistory} /></Grid>}
            <Grid item xs={12}><OrderAuditTrail orderId={order.id} enabled={open} /></Grid>
          </Grid>

          <Divider sx={{ my: 2.5 }} />
          <Stack direction={{ xs: "column-reverse", sm: "row" }} spacing={1.5} justifyContent="flex-end" alignItems={{ xs: "stretch", sm: "center" }}>
            <Button variant="text" onClick={onClose} fullWidth={isSmall} sx={{ textTransform: "none", color: "text.secondary", fontWeight: 700, px: 2.5 }}>Cerrar</Button>
            <Box sx={{ width: isSmall ? "100%" : "auto" }}><ActionButton order={order} onClick={onUpdateStatus} isSmall={isSmall} /></Box>
          </Stack>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDialog;
