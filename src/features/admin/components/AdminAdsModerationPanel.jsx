import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import SearchRounded from "@mui/icons-material/SearchRounded";
import {
  useGetAdminAdsQuery,
  useModerateAdminAdMutation,
  useUpdateAdminAdStatusMutation,
} from "../api/adminMarketing.api";
import {
  AD_MODERATION_LABELS,
  AD_STATUS_LABELS,
  formatAdminCurrency,
  formatAdminDateTime,
  statusColor,
} from "../model/adminMarketing";
import AdminMarketingActionDialog from "./AdminMarketingActionDialog";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";

export default function AdminAdsModerationPanel() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ q: "", status: "", moderation: "pending" });
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);
  const query = useGetAdminAdsQuery({ ...filters, limit: 50 });
  const ads = dataOf(query.data) || [];
  const [moderate, moderationState] = useModerateAdminAdMutation();
  const [updateStatus, statusState] = useUpdateAdminAdStatusMutation();
  const busy = moderationState.isLoading || statusState.isLoading;

  const openAction = (ad, kind, value) => {
    setPending({ ad, kind, value });
    setReason("");
    setFeedback(null);
  };

  const apply = async () => {
    if (!pending || reason.trim().length < 3) return;
    try {
      if (pending.kind === "moderation") {
        await moderate({
          adCampaignId: pending.ad.adCampaignId,
          decision: pending.value,
          reason: reason.trim(),
        }).unwrap();
      } else {
        await updateStatus({
          adCampaignId: pending.ad.adCampaignId,
          status: pending.value,
          reason: reason.trim(),
        }).unwrap();
      }
      const messages = {
        approved: "Campaña aprobada por moderación. Billing y serving permanecen deshabilitados.",
        rejected: "Campaña rechazada por moderación.",
        paused: "Campaña publicitaria pausada.",
        ended: "Campaña publicitaria finalizada.",
      };
      setFeedback({ severity: "success", message: messages[pending.value] || "Cambio aplicado." });
      setPending(null);
      setReason("");
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  const dialogCopy = () => {
    if (!pending) return { title: "", action: "", description: "", color: "primary" };
    const name = `${pending.ad.name} · ${pending.ad.businessName}`;
    if (pending.value === "approved") return {
      title: "Aprobar campaña publicitaria",
      action: "Aprobar",
      color: "success",
      description: `${name}. La aprobación únicamente completa moderación; no activa cobro ni publicación.`,
    };
    if (pending.value === "rejected") return {
      title: "Rechazar campaña publicitaria",
      action: "Rechazar",
      color: "error",
      description: `${name}. La campaña quedará pausada y el negocio podrá corregirla y volver a enviarla.`,
    };
    if (pending.value === "paused") return {
      title: "Pausar campaña publicitaria",
      action: "Pausar",
      color: "warning",
      description: `${name}. La intervención quedará registrada en auditoría.`,
    };
    return {
      title: "Finalizar campaña publicitaria",
      action: "Finalizar",
      color: "error",
      description: `${name}. Una campaña finalizada no podrá reanudarse desde el flujo actual.`,
    };
  };

  const copy = dialogCopy();

  return (
    <Stack spacing={2}>
      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" fontWeight={700}>Moderación de qsCome Ads</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Revisa anuncios enviados por negocios. Aprobar moderación nunca cambia una campaña a Activa: billing y serving siguen siendo gates independientes.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters((current) => ({ ...current, q: search.trim() }));
          }}
          sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) 180px 180px auto" }, gap: 1 }}
        >
          <TextField
            size="small"
            label="Buscar anuncio o negocio"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FormControl size="small">
            <InputLabel id="admin-ad-moderation-label">Moderación</InputLabel>
            <Select
              labelId="admin-ad-moderation-label"
              label="Moderación"
              value={filters.moderation}
              onChange={(event) => setFilters((current) => ({ ...current, moderation: event.target.value }))}
            >
              <MenuItem value="">Todas</MenuItem>
              {Object.entries(AD_MODERATION_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl size="small">
            <InputLabel id="admin-ad-status-label">Estado</InputLabel>
            <Select
              labelId="admin-ad-status-label"
              label="Estado"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(AD_STATUS_LABELS).map(([value, label]) => (
                <MenuItem key={value} value={value}>{label}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button type="submit" variant="contained" startIcon={<SearchRounded />}>Buscar</Button>
        </Box>

        {query.isLoading ? (
          <Box sx={{ py: 7, display: "grid", placeItems: "center" }}><CircularProgress /></Box>
        ) : query.error ? (
          <Alert severity="error" sx={{ m: 2 }} action={<Button color="inherit" onClick={query.refetch}>Reintentar</Button>}>
            {errorMessage(query.error)}
          </Alert>
        ) : (
          <Box>
            <Box sx={{ display: { xs: "none", lg: "grid" }, gridTemplateColumns: "minmax(220px,1.3fr) 135px 145px 155px minmax(205px,1fr) 230px", gap: 1.25, px: 2, py: 1.25, bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider" }}>
              {['ANUNCIO', 'MODERACIÓN', 'ESTADO', 'PRESUPUESTO', 'PERIODO', 'ACCIONES'].map((label) => <Typography key={label} variant="caption" fontWeight={700}>{label}</Typography>)}
            </Box>
            {ads.map((ad) => {
              const pendingModeration = ad.moderationStatus === "pending";
              const canPause = ["pending_billing", "ready", "active"].includes(ad.status);
              const canEnd = ad.status !== "ended";
              return (
                <Box
                  key={ad.adCampaignId}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", lg: "minmax(220px,1.3fr) 135px 145px 155px minmax(205px,1fr) 230px" },
                    gap: { xs: 1, lg: 1.25 },
                    alignItems: "center",
                    px: 2,
                    py: 1.6,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>{ad.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {ad.businessName} · #{ad.adCampaignId} · {ad.surface}
                    </Typography>
                  </Box>
                  <Box><Chip size="small" label={AD_MODERATION_LABELS[ad.moderationStatus] || ad.moderationStatus} color={statusColor(ad.moderationStatus)} variant="outlined" /></Box>
                  <Box><Chip size="small" label={AD_STATUS_LABELS[ad.status] || ad.status} color={statusColor(ad.status)} variant="outlined" /></Box>
                  <Box>
                    <Typography variant="body2">{formatAdminCurrency(ad.totalBudget)}</Typography>
                    <Typography variant="caption" color="text.secondary">{formatAdminCurrency(ad.dailyBudget)}/día</Typography>
                  </Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatAdminDateTime(ad.startsAt)} → {formatAdminDateTime(ad.endsAt)}
                  </Typography>
                  <Stack direction="row" spacing={0.6} flexWrap="wrap" useFlexGap>
                    {pendingModeration && <Button size="small" variant="contained" onClick={() => openAction(ad, "moderation", "approved")}>Aprobar</Button>}
                    {pendingModeration && <Button size="small" color="inherit" variant="outlined" onClick={() => openAction(ad, "moderation", "rejected")}>Rechazar</Button>}
                    {canPause && <Button size="small" variant="outlined" onClick={() => openAction(ad, "status", "paused")}>Pausar</Button>}
                    {canEnd && <Button size="small" color="inherit" onClick={() => openAction(ad, "status", "ended")}>Finalizar</Button>}
                    {!pendingModeration && !canPause && !canEnd && <Typography variant="caption" color="text.secondary">Sin acciones</Typography>}
                  </Stack>
                </Box>
              );
            })}
            {!ads.length && (
              <Box sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">No se encontraron campañas publicitarias.</Typography></Box>
            )}
          </Box>
        )}
      </Paper>

      <AdminMarketingActionDialog
        open={Boolean(pending)}
        title={copy.title}
        description={copy.description}
        actionLabel={copy.action}
        actionColor={copy.color}
        reason={reason}
        onReasonChange={setReason}
        onClose={() => { if (!busy) { setPending(null); setReason(""); } }}
        onConfirm={apply}
        loading={busy}
      />
    </Stack>
  );
}
