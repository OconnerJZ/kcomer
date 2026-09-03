import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, PlayArrowRounded, RestaurantRounded } from "@mui/icons-material";
import PropTypes from "prop-types";
import OrderProductList from "@Features/orders/components/items/OrderProductList";

const kitchenMeta = {
  pending: { label: "Pendiente", color: "default" },
  preparing: { label: "Preparando", color: "warning" },
  ready: { label: "Listo", color: "success" },
};

const KitchenAction = ({ item, enabled, onUpdate }) => {
  const status = item.kitchenStatus || "pending";
  if (!enabled) return <Chip size="small" label={kitchenMeta[status]?.label || status} color={kitchenMeta[status]?.color || "default"} variant="outlined" />;

  if (status === "ready") {
    return <Chip size="small" icon={<CheckCircleRounded />} label="Listo" color="success" sx={{ fontWeight: 800 }} />;
  }

  const next = status === "pending" ? "preparing" : "ready";
  const label = status === "pending" ? "Iniciar" : "Marcar listo";
  const Icon = status === "pending" ? PlayArrowRounded : CheckCircleRounded;

  return (
    <Button
      size="small"
      variant={status === "preparing" ? "contained" : "outlined"}
      color={status === "preparing" ? "warning" : "inherit"}
      startIcon={<Icon />}
      onClick={() => onUpdate?.(item.detailId, next)}
      sx={{ textTransform: "none", borderRadius: 999, fontWeight: 800, whiteSpace: "nowrap" }}
    >
      {label}
    </Button>
  );
};

KitchenAction.propTypes = {
  item: PropTypes.object.isRequired,
  enabled: PropTypes.bool,
  onUpdate: PropTypes.func,
};

const OrderItems = ({ items = [], kitchenEnabled = false, onUpdateKitchenStatus }) => {
  const totalUnits = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const readyUnits = items.reduce((sum, item) => sum + (item.kitchenStatus === "ready" ? Number(item.quantity || 0) : 0), 0);
  const hasPendingProduction = kitchenEnabled && totalUnits > 0 && readyUnits < totalUnits;

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: "10px", p: { xs: 2, sm: 2.5 }, bgcolor: "rgba(255,255,255,.86)" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1.2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".64rem" }}>PEDIDO</Typography>
          <Typography variant="subtitle1" fontWeight={800}>Productos</Typography>
          {items.some((item) => item.participantLabel) && <Typography variant="caption" color="text.secondary">Separados por selección para facilitar el empaquetado.</Typography>}
        </Box>
        <Stack direction="row" spacing={0.8} alignItems="center">
          {kitchenEnabled && <Chip icon={<RestaurantRounded />} size="small" label={`${readyUnits}/${totalUnits} listos`} color={readyUnits === totalUnits && totalUnits > 0 ? "success" : "default"} sx={{ fontWeight: 800 }} />}
          <Chip size="small" label={`${totalUnits} ${totalUnits === 1 ? "producto" : "productos"}`} variant="outlined" sx={{ fontWeight: 700 }} />
        </Stack>
      </Stack>

      {hasPendingProduction && <Box sx={{ mb: 1.2, px: 1.35, py: 1, borderRadius: "10px", bgcolor: "rgba(255,159,28,.08)", border: "1px solid rgba(255,159,28,.18)" }}><Typography variant="caption" color="warning.dark" fontWeight={800}>Avanza cada producto desde aquí para que ninguno se quede pendiente.</Typography></Box>}

      <OrderProductList
        items={items}
        groupBySelection={items.some((item) => item.participantLabel)}
        showTotal={false}
        renderActions={(item) => <KitchenAction item={item} enabled={kitchenEnabled} onUpdate={onUpdateKitchenStatus} />}
      />
    </Box>
  );
};

export default OrderItems;

OrderItems.propTypes = {
  items: PropTypes.arrayOf(PropTypes.object),
  kitchenEnabled: PropTypes.bool,
  onUpdateKitchenStatus: PropTypes.func,
};
