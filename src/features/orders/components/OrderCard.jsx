import {
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
  Chip,
} from "@mui/material";
import StatusChip from "./StatusChip";
import ActionButton from "./ActionButton";
import PendingOrderActions from "./PendingOrderActions";
import {
  formatOrderDate,
  formatCurrency,
} from "@Features/orders/model/orderFormatters";
import { getOrderUrgency } from "@Features/orders/model/orderPriority";

const ProductionReminder = ({ order }) => {
  if (!["accepted", "preparing"].includes(order.status)) return null;
  const ready = Number(order.kitchenProgress?.ready || 0);
  const total = Number(order.kitchenProgress?.total || 0);
  if (!total || ready >= total) return null;
  return <Box sx={{ px: 1.2, py: .8, borderRadius: 1.5, bgcolor: "rgba(237,108,2,.07)", border: "1px solid rgba(237,108,2,.16)" }}><Typography variant="caption" color="warning.dark" fontWeight={800}>{order.status === "accepted" ? "Inicia los productos de esta orden" : `Avanza productos · ${ready} de ${total} listos`}</Typography></Box>;
};

const urgencyChip = {
  overdue: { color: "error", variant: "filled" },
  warning: { color: "warning", variant: "filled" },
  new: { color: "success", variant: "outlined" },
  normal: { color: "default", variant: "outlined" },
};

const OrderCard = ({ order, onViewOrder, onUpdateStatus, isSmall, highlighted = false, now = Date.now() }) => {
  const urgency = getOrderUrgency(order, now);
  const chip = urgencyChip[urgency.level] || urgencyChip.normal;

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: highlighted ? "rgba(255, 75, 69, 0.08)" : { xs: "rgba(255,255,255,0.4)", sm: "rgba(255,255,255,0.6)" },
        backdropFilter: "blur(1.6px)",
        border: { xs: "", sm: highlighted ? "1px solid rgba(255, 75, 69, 0.55)" : "1px solid #e0e0e0" },
        borderBottom: { xs: highlighted ? "2px solid rgba(255, 75, 69, 0.75)" : "1px solid #c0c0c0" },
        borderLeft: highlighted ? "4px solid rgba(255, 75, 69, 0.9)" : undefined,
        borderRadius: { xs: 0, sm: 1 },
        transition: "border-color 0.2s, background-color 0.2s",
        "&:hover": { borderColor: highlighted ? "rgba(255, 75, 69, 0.8)" : "#1a1a1a41" },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}>#{order.id}</Typography>
              <Typography variant="button" sx={{ fontWeight: 400, fontSize: "0.825rem" }}>{order.orderType}</Typography>
            </Stack>
            <Stack spacing={0.75} alignItems="flex-end">
              <StatusChip status={order.status} />
              <Chip size="small" label={urgency.label} color={chip.color} variant={chip.variant} />
            </Stack>
          </Stack>

          <Divider sx={{ borderColor: "#f0f0f0" }} />

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>{order.customerName}</Typography>
            <Typography variant="caption" sx={{ color: "#999", display: "block", mb: 1 }}>{formatOrderDate(order.createdAt)}</Typography>
            <Stack spacing={.35} sx={{ mb: 1 }}>
              {order.items.slice(0, 3).map((item) => <Typography key={item.detailId || item.id || item.name} variant="body2"><Box component="span" fontWeight={850}>{item.quantity}×</Box> {item.name}</Typography>)}
              {order.items.length > 3 && <Typography variant="caption" color="text.secondary">+{order.items.length - 3} productos más</Typography>}
            </Stack>
            <ProductionReminder order={order} />
            <Typography variant="body2" sx={{ fontWeight: 700, mt: 0.75 }}>{formatCurrency(order.total)}</Typography>
          </Box>

          <Stack spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onViewOrder(order)}
              sx={{ borderColor: "#e0e0e0", color: "#1a1a1a", textTransform: "none", fontWeight: 500, borderRadius: 1, fontSize: "0.813rem", "&:hover": { borderColor: "#1a1a1a", bgcolor: "transparent" } }}
            >
              Ver detalles
            </Button>
            {order.status === "pending" ? (
              <PendingOrderActions order={order} onUpdateStatus={onUpdateStatus} fullWidth />
            ) : (
              <ActionButton order={order} onClick={onUpdateStatus} isSmall={isSmall} />
            )}
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
