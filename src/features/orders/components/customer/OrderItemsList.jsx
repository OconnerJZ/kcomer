import { Box, Chip, LinearProgress, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, RestaurantRounded } from "@mui/icons-material";
import PropTypes from "prop-types";
import OrderProductList from "@Features/orders/components/items/OrderProductList";

const KITCHEN_LABELS = {
  pending: "Pendiente",
  preparing: "Preparando",
  ready: "Listo",
};

const KITCHEN_COLORS = {
  pending: "default",
  preparing: "warning",
  ready: "success",
};

const kitchenVisibleStatuses = new Set(["accepted", "preparing", "ready"]);

export default function OrderItemsList({ order }) {
  const progress = order.kitchenProgress || { ready: 0, total: 0 };
  const progressPercent = progress.total > 0 ? Math.round((progress.ready / progress.total) * 100) : 0;
  const showKitchen = kitchenVisibleStatuses.has(order.status) && progress.total > 0;

  return (
    <Box sx={{ mb: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={1.5}>
        <Stack direction="row" alignItems="center" gap={1.25}>
          <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: "rgba(255,75,69,.10)", display: "flex", alignItems: "center", justifyContent: "center", color: "primary.main" }}>
            <RestaurantRounded sx={{ fontSize: 18 }} />
          </Box>
          <Box>
            <Typography variant="body2" sx={{ fontWeight: 800 }}>Artículos del pedido</Typography>
            <Typography variant="caption" color="text.secondary">Detalle de preparación</Typography>
          </Box>
        </Stack>
        {showKitchen && (
          <Typography variant="caption" fontWeight={800} color={progress.ready === progress.total ? "success.main" : "text.secondary"}>
            {progress.ready}/{progress.total} listos
          </Typography>
        )}
      </Stack>

      {showKitchen && (
        <Box sx={{ mb: 1.5, px: 0.25 }}>
          <LinearProgress
            variant="determinate"
            value={progressPercent}
            color={progress.ready === progress.total ? "success" : "primary"}
            sx={{ height: 6, borderRadius: 999, bgcolor: "rgba(0,0,0,.055)" }}
          />
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.65 }}>
            {progress.ready === progress.total
              ? "Todos tus productos están preparados."
              : order.status === "accepted"
                ? "El negocio ya aceptó tu orden; la preparación comenzará en breve."
                : "Tu pedido se está preparando producto por producto."}
          </Typography>
        </Box>
      )}

      <OrderProductList
        items={order.items}
        groupBySelection={order.items.some((item) => item.participantLabel)}
        total={order.total}
        renderStatus={showKitchen ? (item) => {
          const kitchenStatus = item.kitchenStatus || "pending";
          return <Chip size="small" color={KITCHEN_COLORS[kitchenStatus]} variant={kitchenStatus === "ready" ? "filled" : "outlined"} icon={kitchenStatus === "ready" ? <CheckCircleRounded /> : undefined} label={KITCHEN_LABELS[kitchenStatus] || kitchenStatus} sx={{ height: 23, fontWeight: 700, fontSize: ".67rem" }} />;
        } : undefined}
      />
    </Box>
  );
}

OrderItemsList.propTypes = {
  order: PropTypes.object.isRequired,
};
