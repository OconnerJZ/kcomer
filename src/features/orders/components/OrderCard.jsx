import {
  Card,
  CardContent,
  Stack,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { ArrowForwardRounded, RestaurantMenuRounded } from "@mui/icons-material";
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
  return <Box sx={{ px: 1.2, py: .8, borderRadius: "8px", bgcolor: "rgba(168,117,60,.08)", border: "1px solid rgba(168,117,60,.18)" }}><Typography variant="caption" color="warning.dark" fontWeight={600}>{order.status === "accepted" ? "Inicia los productos de esta orden" : `Avanza productos · ${ready} de ${total} listos`}</Typography></Box>;
};

const OrderCard = ({ order, onViewOrder, onUpdateStatus, isSmall, highlighted = false, now = Date.now() }) => {
  const urgency = getOrderUrgency(order, now);
  const itemUnits = order.items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const urgencyColor = urgency.level === "overdue" ? "error.main" : urgency.level === "warning" ? "warning.dark" : "text.secondary";

  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: highlighted ? "rgba(198,90,80,.065)" : "background.paper",
        border: "1px solid",
        borderColor: highlighted ? "rgba(198,90,80,.48)" : "divider",
        borderLeft: highlighted ? "4px solid rgba(198,90,80,.9)" : undefined,
        borderRadius: "8px",
        transition: "border-color .18s ease, transform .18s ease, box-shadow .18s ease",
        "&:hover": { borderColor: highlighted ? "rgba(198,90,80,.8)" : "rgba(0,0,0,.2)", transform: "translateY(-1px)", boxShadow: "0 3px 10px rgba(0,0,0,.06)" },
      }}
    >
      <CardContent sx={{ p: 2.1, "&:last-child": { pb: 2.1 } }}>
        <Stack spacing={1.45}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
            <Box><Typography variant="caption" color="text.secondary" sx={{ letterSpacing: ".08em" }}>ORDEN</Typography><Typography variant="subtitle1" sx={{ fontFamily: "monospace", fontWeight: 700, lineHeight: 1.15 }}>#{order.id}</Typography></Box>
            <StatusChip status={order.status} />
          </Stack>

          <Stack direction="row" justifyContent="space-between" alignItems="flex-end" gap={2}>
            <Box minWidth={0}><Typography variant="body2" fontWeight={600} noWrap>{order.customerName || "Cliente"}</Typography><Typography variant="caption" color="text.secondary">{order.orderType === "delivery" ? "Delivery" : "Recoger"} · {formatOrderDate(order.createdAt)}</Typography></Box>
            <Typography variant="subtitle1" fontWeight={700} whiteSpace="nowrap">{formatCurrency(order.total)}</Typography>
          </Stack>

          {urgency.level !== "normal" && <Typography variant="caption" color={urgencyColor} fontWeight={600}>{urgency.label}</Typography>}

          <Button fullWidth onClick={() => onViewOrder(order)} startIcon={<RestaurantMenuRounded />} endIcon={<ArrowForwardRounded />} sx={{ justifyContent: "space-between", px: 1.4, py: 1.05, borderRadius: "8px", textTransform: "none", color: "text.primary", bgcolor: "rgba(0,0,0,.032)", border: "1px solid", borderColor: "rgba(0,0,0,.055)", "&:hover": { bgcolor: "rgba(198,90,80,.055)", borderColor: "rgba(198,90,80,.18)" } }}>
            <Box sx={{ textAlign: "left", flex: 1 }}><Typography variant="body2" fontWeight={600}>Ver productos y detalle</Typography><Typography variant="caption" color="text.secondary">{itemUnits} {itemUnits === 1 ? "producto" : "productos"}</Typography></Box>
          </Button>

          <ProductionReminder order={order} />

          <Stack spacing={1}>
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
