import { Box, Button, Chip, Paper, Stack, Typography } from "@mui/material";
import { ArrowForward, Visibility } from "@mui/icons-material";
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

const ProductionCard = ({ order, now, onViewOrder, onUpdateStatus }) => {
  const urgency = getOrderUrgency(order, now);
  const nextStatus = getNextStatus(order.status);
  const actionLabel = getActionLabels(order.orderType)?.[nextStatus];
  const chip = urgencyProps[urgency.level] || urgencyProps.normal;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2,
        border: "1px solid",
        borderColor: urgency.level === "overdue" ? "error.light" : "divider",
        borderRadius: 2,
        bgcolor: "background.paper",
        transition: "transform .16s ease, box-shadow .16s ease, border-color .16s ease",
        "&:hover": { transform: "translateY(-1px)", boxShadow: "0 8px 24px rgba(0,0,0,.06)" },
      }}
    >
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
          <Box>
            <Typography sx={{ fontFamily: "monospace", fontWeight: 800, fontSize: "1rem" }}>#{order.id}</Typography>
            <Typography variant="caption" color="text.secondary">{order.customerName}</Typography>
          </Box>
          <Chip size="small" label={urgency.label} color={chip.color} variant={chip.variant} />
        </Stack>

        <Box>
          {order.items.slice(0, 3).map((item) => (
            <Typography key={item.id ?? `${item.name}-${item.quantity}`} variant="body2" sx={{ lineHeight: 1.65 }}>
              <Box component="span" sx={{ fontWeight: 800, mr: 0.75 }}>{item.quantity || 1}×</Box>
              {item.name}
            </Typography>
          ))}
          {order.items.length > 3 && (
            <Typography variant="caption" color="text.secondary">+{order.items.length - 3} productos más</Typography>
          )}
        </Box>

        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="body2" fontWeight={700}>{formatCurrency(order.total)}</Typography>
          <Button size="small" startIcon={<Visibility />} onClick={() => onViewOrder(order)} sx={{ textTransform: "none", color: "text.secondary" }}>
            Detalle
          </Button>
        </Stack>

        {nextStatus && actionLabel && (
          <Button
            fullWidth
            variant="contained"
            disableElevation
            endIcon={<ArrowForward />}
            onClick={() => onUpdateStatus(order.id, nextStatus)}
            sx={{ textTransform: "none", borderRadius: 1.5, fontWeight: 700, py: 0.9 }}
          >
            {actionLabel}
          </Button>
        )}
      </Stack>
    </Paper>
  );
};

export default function KitchenBoard({ orders = [], now = Date.now(), onViewOrder, onUpdateStatus }) {
  return (
    <Box sx={{ overflowX: { xs: "auto", lg: "visible" }, pb: 1 }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "repeat(3, minmax(280px, 1fr))", lg: "repeat(3, minmax(0, 1fr))" },
          gap: 2,
          minWidth: { xs: 880, lg: 0 },
        }}
      >
        {COLUMNS.map((column) => {
          const columnOrders = orders.filter((order) => order.status === column.key);
          return (
            <Box key={column.key}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 1.5, px: 0.5 }}>
                <Box>
                  <Typography variant="subtitle1" fontWeight={800}>{column.title}</Typography>
                  <Typography variant="caption" color="text.secondary">{column.hint}</Typography>
                </Box>
                <Typography variant="h5" fontWeight={300} color="text.secondary">{columnOrders.length}</Typography>
              </Stack>

              <Stack spacing={1.25}>
                {columnOrders.length === 0 ? (
                  <Box sx={{ py: 5, px: 2, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 2 }}>
                    <Typography variant="body2" color="text.secondary">Sin órdenes</Typography>
                  </Box>
                ) : (
                  columnOrders.map((order) => (
                    <ProductionCard
                      key={order.id}
                      order={order}
                      now={now}
                      onViewOrder={onViewOrder}
                      onUpdateStatus={onUpdateStatus}
                    />
                  ))
                )}
              </Stack>
            </Box>
          );
        })}
      </Box>
    </Box>
  );
}
