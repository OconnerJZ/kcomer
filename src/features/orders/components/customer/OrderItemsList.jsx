import { Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, RestaurantRounded, StickyNote2 } from "@mui/icons-material";

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

const ModifierSummary = ({ modifiers = [] }) => {
  if (!modifiers.length) return null;

  const selected = modifiers.filter((modifier) => modifier.state !== "removed");
  const removed = modifiers.filter((modifier) => modifier.state === "removed");

  return (
    <Stack spacing={0.35} sx={{ mt: 0.65 }}>
      {selected.length > 0 && (
        <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.4 }}>
          {selected.map((modifier) => modifier.name).filter(Boolean).join(" · ")}
        </Typography>
      )}
      {removed.length > 0 && (
        <Typography variant="caption" sx={{ color: "warning.dark", lineHeight: 1.4 }}>
          Sin {removed.map((modifier) => modifier.name).filter(Boolean).join(" · sin ")}
        </Typography>
      )}
    </Stack>
  );
};

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

      <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", overflow: "hidden", borderRadius: 2.5, bgcolor: "rgba(255,255,255,.76)" }}>
        {order.items.map((item, idx) => {
          const kitchenStatus = item.kitchenStatus || "pending";
          return (
            <Box key={item.detailId || `${order.id}-${idx}`} sx={{ p: 1.25, borderBottom: idx < order.items.length - 1 ? "1px solid" : "none", borderColor: "divider" }}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                <Stack direction="row" alignItems="flex-start" gap={1.2} flex={1} minWidth={0}>
                  <Chip label={`${item.quantity}x`} size="small" sx={{ fontWeight: 800, minWidth: 38, height: 24, bgcolor: "rgba(255,75,69,.08)", color: "primary.main" }} />
                  <Box minWidth={0}>
                    <Typography variant="body2" sx={{ fontWeight: 750, lineHeight: 1.35 }}>{item.name}</Typography>
                    <ModifierSummary modifiers={item.modifiers} />
                    {item.note && (
                      <Stack direction="row" spacing={0.5} alignItems="flex-start" sx={{ mt: 0.65 }}>
                        <StickyNote2 sx={{ fontSize: 13, color: "text.disabled", mt: "2px" }} />
                        <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic" }}>{item.note}</Typography>
                      </Stack>
                    )}
                  </Box>
                </Stack>

                <Stack spacing={0.65} alignItems="flex-end">
                  <Typography variant="body2" sx={{ fontWeight: 800, whiteSpace: "nowrap" }}>${Number(item.subtotal || item.price * item.quantity || 0).toFixed(2)}</Typography>
                  {showKitchen && (
                    <Chip
                      size="small"
                      color={KITCHEN_COLORS[kitchenStatus]}
                      variant={kitchenStatus === "ready" ? "filled" : "outlined"}
                      icon={kitchenStatus === "ready" ? <CheckCircleRounded /> : undefined}
                      label={KITCHEN_LABELS[kitchenStatus] || kitchenStatus}
                      sx={{ height: 23, fontWeight: 700, fontSize: ".67rem" }}
                    />
                  )}
                </Stack>
              </Stack>
            </Box>
          );
        })}
        <Box sx={{ p: 1.6, bgcolor: "rgba(248,248,248,.76)", borderTop: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" sx={{ fontWeight: 750 }}>Total del pedido</Typography>
            <Typography variant="subtitle1" sx={{ fontWeight: 900 }}>${Number(order.total || 0).toFixed(2)}</Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
