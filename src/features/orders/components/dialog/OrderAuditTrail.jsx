import { Alert, Box, Button, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { HistoryToggleOffRounded, RefreshRounded } from "@mui/icons-material";
import { useGetOrderAuditQuery } from "@Features/orders/api/orders.api";
import { formatOrderDate } from "@Features/orders/model/orderFormatters";

const LABELS = {
  ORDER_CREATED: "Orden creada",
  ORDER_ITEMS_UPDATED: "Orden modificada",
  ORDER_STATUS_CHANGED: "Estado actualizado",
  ORDER_CANCELLED: "Orden cancelada",
  KITCHEN_ITEM_STATUS_CHANGED: "Producto actualizado en cocina",
  ORDER_EDIT_BLOCKED: "Edición bloqueada",
};

const ROLE_LABELS = {
  admin: "Administrador",
  owner: "Negocio",
  customer: "Cliente",
  system: "Sistema",
};

const STATUS_LABELS = {
  pending: "Pendiente",
  accepted: "Aceptada",
  preparing: "En preparación",
  ready: "Lista",
  in_delivery: "En camino",
  completed: "Completada",
  cancelled: "Cancelada",
};

const getErrorMessage = (error) => error?.data?.message || error?.data?.error || "No fue posible cargar la bitácora.";
const getTransitionLabel = (value) => STATUS_LABELS[value] || value;

export default function OrderAuditTrail({ orderId, enabled = true, compact = false }) {
  const { data, error, isError, isFetching, refetch } = useGetOrderAuditQuery({ id: orderId }, { skip: !enabled || !orderId });
  const events = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : [];

  const content = <>
    {isFetching && <Stack alignItems="center" py={2}><CircularProgress size={22} /></Stack>}
    {!isFetching && isError && (
      <Alert
        severity="error"
        action={<Button color="inherit" size="small" startIcon={<RefreshRounded />} onClick={refetch}>Reintentar</Button>}
      >
        {getErrorMessage(error)}
      </Alert>
    )}
    {!isFetching && !isError && !events.length && <Typography variant="body2" color="text.secondary">Aún no hay eventos auditables para esta orden.</Typography>}

    <Stack spacing={1.4}>
      {events.map((event) => (
        <Box key={event.id} sx={{ display: "grid", gridTemplateColumns: "12px minmax(0,1fr)", gap: 1.2, alignItems: "start" }}>
          <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: "primary.main", mt: .75 }} />
          <Box minWidth={0}>
            <Stack direction="row" spacing={.75} alignItems="center" justifyContent="space-between" flexWrap="wrap" useFlexGap>
              <Stack direction="row" spacing={.75} alignItems="center" flexWrap="wrap" useFlexGap>
                <Typography variant="body2" fontWeight={800}>{LABELS[event.action] || event.action}</Typography>
                {event.orderVersion != null && <Chip size="small" label={`v${event.orderVersion}`} sx={{ height: 20, fontSize: ".62rem" }} />}
              </Stack>
              <Typography variant="caption" color="text.secondary">
                {event.createdAt ? formatOrderDate(event.createdAt, true) : ""}
              </Typography>
            </Stack>
            <Typography variant="caption" color="text.secondary">
              {ROLE_LABELS[event.actorRole] || event.actorRole || "Sistema"}{event.actorUserId ? ` · usuario #${event.actorUserId}` : ""}
            </Typography>
            {event.metadata?.from && event.metadata?.to && (
              <Typography variant="caption" sx={{ display: "block", mt: .3 }}>{getTransitionLabel(event.metadata.from)} → {getTransitionLabel(event.metadata.to)}</Typography>
            )}
            {event.metadata?.itemName && (
              <Typography variant="caption" sx={{ display: "block", mt: .3 }}>{event.metadata.itemName}</Typography>
            )}
            {event.action === "ORDER_EDIT_BLOCKED" && (
              <Typography variant="caption" color="warning.main" sx={{ display: "block", mt: .3 }}>
                {event.metadata?.reason === "VERSION_CONFLICT"
                  ? `Conflicto de versión: editor v${event.metadata?.expectedVersion ?? "?"}, orden v${event.metadata?.actualVersion ?? "?"}`
                  : `Orden bloqueada en estado ${getTransitionLabel(event.metadata?.currentStatus || "desconocido")}`}
              </Typography>
            )}
          </Box>
        </Box>
      ))}
    </Stack>
  </>;

  if (compact) return <Box sx={{ pt: .5 }}>{content}</Box>;

  return (
    <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: "10px", p: { xs: 2, sm: 2.5 }, bgcolor: "rgba(255,255,255,.82)" }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".64rem" }}>AUDITORÍA</Typography>
          <Typography variant="subtitle1" fontWeight={800}>Bitácora de actividad</Typography>
        </Box>
        <HistoryToggleOffRounded color="action" />
      </Stack>
      {content}
    </Box>
  );
}
