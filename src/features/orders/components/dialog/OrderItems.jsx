import { Box, Button, Chip, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, LocalDining, PlayArrowRounded, RestaurantRounded, StickyNote2 } from "@mui/icons-material";
import { formatCurrency } from "@Features/orders/model/orderFormatters";

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

const ModifierSummary = ({ modifiers = [] }) => {
  if (!modifiers.length) return null;
  const grouped = modifiers.reduce((acc, modifier) => {
    const key = modifier.group || "Personalización";
    if (!acc[key]) acc[key] = [];
    acc[key].push(modifier);
    return acc;
  }, {});

  return (
    <Stack spacing={0.35} sx={{ mt: 0.7 }}>
      {Object.entries(grouped).map(([group, choices]) => (
        <Typography key={group} variant="caption" color="text.secondary" sx={{ lineHeight: 1.45 }}>
          <Box component="span" sx={{ fontWeight: 800 }}>{group}: </Box>
          {choices.map((choice) => choice.state === "removed" ? `sin ${choice.name}` : choice.name).join(" · ")}
        </Typography>
      ))}
    </Stack>
  );
};

const OrderItems = ({ items = [], kitchenEnabled = false, onUpdateKitchenStatus }) => {
  const totalUnits = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const readyUnits = items.reduce((sum, item) => sum + (item.kitchenStatus === "ready" ? Number(item.quantity || 0) : 0), 0);

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: "rgba(255,255,255,.86)" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "center" }} gap={1.2} sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".64rem" }}>PEDIDO</Typography>
          <Typography variant="subtitle1" fontWeight={800}>Productos</Typography>
        </Box>
        <Stack direction="row" spacing={0.8} alignItems="center">
          {kitchenEnabled && <Chip icon={<RestaurantRounded />} size="small" label={`${readyUnits}/${totalUnits} listos`} color={readyUnits === totalUnits && totalUnits > 0 ? "success" : "default"} sx={{ fontWeight: 800 }} />}
          <Chip size="small" label={`${totalUnits} ${totalUnits === 1 ? "producto" : "productos"}`} variant="outlined" sx={{ fontWeight: 700 }} />
        </Stack>
      </Stack>

      <Stack spacing={0}>
        {items.map((item, index) => {
          const subtotal = Number(item.subtotal ?? (Number(item.price || 0) * Number(item.quantity || 0)));
          return (
            <Box
              key={item.detailId || item.id || `${item.name}-${index}`}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "auto minmax(0,1fr)", sm: "auto minmax(0,1fr) auto" },
                gap: 1.5,
                alignItems: "start",
                py: 1.6,
                borderTop: index === 0 ? "none" : "1px solid",
                borderColor: "divider",
              }}
            >
              <Box sx={{ width: 38, height: 38, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: item.kitchenStatus === "ready" ? "rgba(46,125,50,.1)" : "rgba(255,75,69,.08)", color: item.kitchenStatus === "ready" ? "success.main" : "primary.main", fontWeight: 800 }}>
                {item.kitchenStatus === "ready" ? <CheckCircleRounded fontSize="small" /> : `${item.quantity}×`}
              </Box>

              <Box minWidth={0}>
                <Stack direction="row" spacing={0.75} alignItems="center">
                  <LocalDining sx={{ fontSize: 16, color: "text.disabled" }} />
                  <Typography variant="body2" fontWeight={800}>{item.quantity}× {item.name}</Typography>
                </Stack>
                {item.price != null && <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>{formatCurrency(Number(item.price))} c/u</Typography>}
                <ModifierSummary modifiers={item.modifiers} />
                {item.note && (
                  <Stack direction="row" spacing={0.6} alignItems="flex-start" sx={{ mt: 0.7 }}>
                    <StickyNote2 sx={{ fontSize: 14, color: "text.disabled", mt: "2px" }} />
                    <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", lineHeight: 1.45 }}>{item.note}</Typography>
                  </Stack>
                )}

                <Box sx={{ display: { xs: "block", sm: "none" }, mt: 1.1 }}>
                  <KitchenAction item={item} enabled={kitchenEnabled} onUpdate={onUpdateKitchenStatus} />
                </Box>
              </Box>

              <Stack alignItems="flex-end" spacing={0.8} sx={{ display: { xs: "none", sm: "flex" } }}>
                <Typography variant="body2" fontWeight={850} sx={{ whiteSpace: "nowrap", pt: 0.2 }}>{formatCurrency(subtotal)}</Typography>
                <KitchenAction item={item} enabled={kitchenEnabled} onUpdate={onUpdateKitchenStatus} />
              </Stack>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
};

export default OrderItems;
