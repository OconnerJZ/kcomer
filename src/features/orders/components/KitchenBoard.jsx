import { Box, Button, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { ArrowForward, CheckCircleRounded, RestaurantRounded, Visibility } from "@mui/icons-material";
import { getOrderUrgency } from "@Features/orders/model/orderPriority";
import { formatCurrency } from "@Features/orders/model/orderFormatters";
import { getNextStatus, getActionLabels } from "@Features/orders/model/orderStatus";

const COLUMNS = [
  { key: "accepted", title: "Por iniciar", hint: "Órdenes aceptadas" },
  { key: "preparing", title: "Preparando", hint: "En cocina" },
  { key: "ready", title: "Listas", hint: "Para entregar" },
];

const urgencyProps = {
  overdue: { color: "error", variant: "filled" },
  warning: { color: "warning", variant: "outlined" },
  new: { color: "success", variant: "outlined" },
  normal: { color: "default", variant: "outlined" },
};

const PreparationProgress = ({ order }) => {
  const ready = Number(order.kitchenProgress?.ready || 0);
  const total = Number(order.kitchenProgress?.total || 0);
  const progress = total > 0 ? (ready / total) * 100 : 0;
  const complete = total > 0 && ready >= total;

  return (
    <Box sx={{ p: 1.15, borderRadius: "8px", bgcolor: complete ? "rgba(95,120,100,.08)" : "rgba(168,117,60,.07)", border: "1px solid", borderColor: complete ? "rgba(95,120,100,.18)" : "rgba(168,117,60,.18)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: .7 }}>
        <Stack direction="row" spacing={.7} alignItems="center">
          {complete ? <CheckCircleRounded sx={{ fontSize: 16, color: "success.main" }} /> : <RestaurantRounded sx={{ fontSize: 16, color: "secondary.dark" }} />}
          <Typography variant="caption" fontWeight={600}>{complete ? "Todos listos" : "Preparación"}</Typography>
        </Stack>
        <Typography variant="caption" fontWeight={700} color={complete ? "success.main" : "text.secondary"}>{ready}/{total}</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={progress} color={complete ? "success" : "primary"} sx={{ height: 5, borderRadius: "6px", bgcolor: "rgba(0,0,0,.055)" }} />
    </Box>
  );
};

const ProductionCard = ({ order, now, onViewOrder, onUpdateStatus }) => {
  const urgency = getOrderUrgency(order, now);
  const nextStatus = getNextStatus(order.status, order.orderType);
  const actionLabel = getActionLabels(order.orderType)?.[nextStatus];
  const chip = urgencyProps[urgency.level] || urgencyProps.normal;

  return (
    <Paper elevation={0} sx={{ p: 2, border: "1px solid", borderColor: urgency.level === "overdue" ? "error.light" : "divider", borderRadius: "8px", bgcolor: "background.paper", transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease", "&:hover": { transform: "translateY(-1px)", boxShadow: "0 3px 10px rgba(0,0,0,.06)" } }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box><Typography sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "1rem" }}>#{order.id}</Typography><Typography variant="caption" color="text.secondary">{order.customerName}</Typography></Box>
          <Chip size="small" label={urgency.label} color={chip.color} variant={chip.variant} />
        </Stack>

        <Box>
          {order.items.slice(0, 3).map((item) => (
            <Stack key={item.detailId ?? item.id ?? `${item.name}-${item.quantity}`} direction="row" justifyContent="space-between" spacing={1} sx={{ py: .15 }}>
              <Typography variant="body2" sx={{ lineHeight: 1.55 }}><Box component="span" sx={{ fontWeight: 600, mr: 0.75 }}>{item.quantity || 1}×</Box>{item.name}</Typography>
              <Box sx={{ width: 8, height: 8, mt: .8, flex: "0 0 auto", borderRadius: "50%", bgcolor: item.kitchenStatus === "ready" ? "success.main" : item.kitchenStatus === "preparing" ? "warning.main" : "grey.300" }} />
            </Stack>
          ))}
          {order.items.length > 3 && <Typography variant="caption" color="text.secondary">+{order.items.length - 3} productos más</Typography>}
        </Box>

        <PreparationProgress order={order} />

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={700}>{formatCurrency(order.total)}</Typography>
          <Button size="small" startIcon={<Visibility />} onClick={() => onViewOrder(order)} sx={{ textTransform: "none", color: "text.secondary" }}>Detalle</Button>
        </Stack>

        {onUpdateStatus && nextStatus && actionLabel && (
          <Button fullWidth variant="contained" disableElevation endIcon={<ArrowForward />} onClick={() => onUpdateStatus(order.id, nextStatus)} sx={{ textTransform: "none", borderRadius: "8px", fontWeight: 700, py: 0.9 }}>
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default function KitchenBoard({ orders = [], now, onViewOrder, onUpdateStatus }) {
  return (
    <Box sx={{ pb: 1 }}>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(3, minmax(0, 1fr))" }, gap: { xs: 2.5, md: 2 } }}>
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((order) => order.status === column.key);
          return (
            <Box key={column.key}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 0.5 }}>
                <Box><Typography variant="subtitle1" fontWeight={600}>{column.title}</Typography><Typography variant="caption" color="text.secondary">{column.hint}</Typography></Box>
                <Typography variant="h5" fontWeight={300} color="text.secondary">{columnOrders.length}</Typography>
              </Stack>
              <Stack spacing={1.25}>
                {columnOrders.length === 0 ? (
                  <Box sx={{ py: 5, px: 2, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: "8px" }}><Typography variant="body2" color="text.secondary">Sin órdenes</Typography></Box>
                ) : columnOrders.map((order) => <ProductionCard key={order.id} order={order} now={now} onViewOrder={onViewOrder} onUpdateStatus={onUpdateStatus} />)}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
