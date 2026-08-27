import { Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { HistoryToggleOffRounded } from "@mui/icons-material";
import { useGetOrderAuditQuery } from "@Features/orders/api/orders.api";
import { formatOrderDate } from "@Features/orders/model/orderFormatters";

const LABELS = {
  ORDER_CREATED: "Orden creada",
  ORDER_ITEMS_UPDATED: "Orden modificada",
  ORDER_STATUS_CHANGED: "Estado actualizado",
  ORDER_CANCELLED: "Orden cancelada",
  KITCHEN_ITEM_STATUS_CHANGED: "Producto actualizado en cocina",
};

export default function OrderAuditTrail({ orderId, enabled = true }) {
  const { data, isFetching } = useGetOrderAuditQuery({ id: orderId }, { skip: !enabled || !orderId });
  const events = data?.data || data || [];

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: "rgba(255,255,255,.82)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".64rem" }}>AUDITORÍA</Typography>
          <Typography variant="subtitle1" fontWeight={800}>Bitácora de actividad</Typography>
        </Box>
        <HistoryToggleOffRounded color="action" />
      </Stack>

      {isFetching && <Stack alignItems="center" py={2}><CircularProgress size={22} /></Stack>}
      {!isFetching && !events.length && <Typography variant="body2" color="text.secondary">Aún no hay eventos auditables para esta orden.</Typography>}

      <Stack spacing={1.4}>
        {events.map((event) => (
          <Box key={event.id} sx={{ display: "grid", gridTemplateColumns: "12px minmax(0,1fr) auto", gap: 1.2, alignItems: "start" }}>
            <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", mt: .75 }} />
            <Box minWidth={0}>
              <Stack direction="row" spacing={.75} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body2" fontWeight={800}>{LABELS[event.action] || event.action}</Typography>
                {event.orderVersion && <Chip size="small" label={`v${event.orderVersion}`} sx={{ height: 20, fontSize: ".62rem" }} />}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {event.actorRole || "sistema"}{event.actorUserId ? ` · usuario #${event.actorUserId}` : ""}
              </Typography>
              {event.metadata?.from && event.metadata?.to && (
                <Typography variant="caption" sx={{ display: "block", mt: .3 }}>{event.metadata.from} → {event.metadata.to}</Typography>
              )}
              {event.metadata?.itemName && (
                <Typography variant="caption" sx={{ display: "block", mt: .3 }}>{event.metadata.itemName}</Typography>
              )}
            </Box>
            <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
              {event.createdAt ? formatOrderDate(event.createdAt, true) : ""}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
}
