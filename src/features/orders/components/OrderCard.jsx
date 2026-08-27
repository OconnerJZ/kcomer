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
            <Typography variant="caption" sx={{ color: "#999", display: "block" }}>
              {order.items.length} producto{order.items.length !== 1 ? "s" : ""} • {formatOrderDate(order.createdAt)}
            </Typography>
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
