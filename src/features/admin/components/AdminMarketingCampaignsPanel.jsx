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
  useGetAdminMarketingCampaignsQuery,
  useUpdateAdminMarketingCampaignStatusMutation,
} from "../api/adminMarketing.api";
import {
  MARKETING_AUDIENCE_LABELS,
  MARKETING_STATUS_LABELS,
  formatAdminDateTime,
  statusColor,
} from "../model/adminMarketing";
import AdminMarketingActionDialog from "./AdminMarketingActionDialog";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";

export default function AdminMarketingCampaignsPanel() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ q: "", status: "" });
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);
  const query = useGetAdminMarketingCampaignsQuery({ ...filters, limit: 50 });
  const campaigns = dataOf(query.data) || [];
  const [updateStatus, mutation] = useUpdateAdminMarketingCampaignStatusMutation();

  const openAction = (campaign, status) => {
    setPending({ campaign, status });
    setReason("");
    setFeedback(null);
  };

  const apply = async () => {
    if (!pending || reason.trim().length < 3) return;
    try {
      await updateStatus({
        campaignId: pending.campaign.campaignId,
        status: pending.status,
        reason: reason.trim(),
      }).unwrap();
      setFeedback({
        severity: "success",
        message: pending.status === "paused" ? "Campaña pausada por administración." : "Campaña finalizada por administración.",
      });
      setPending(null);
      setReason("");
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Stack spacing={2}>
      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Paper variant="outlined" sx={{ overflow: "hidden" }}>
        <Box sx={{ p: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
          <Typography variant="h6" fontWeight={700}>Campañas de Marketing Center</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Supervisión global. Administración puede pausar o finalizar campañas, pero no crearlas ni activarlas en nombre del negocio.
          </Typography>
        </Box>

        <Box
          component="form"
          onSubmit={(event) => {
            event.preventDefault();
            setFilters((current) => ({ ...current, q: search.trim() }));
          }}
          sx={{ p: 2, display: "grid", gridTemplateColumns: { xs: "1fr", sm: "minmax(0,1fr) 190px auto" }, gap: 1 }}
        >
          <TextField
            size="small"
            label="Buscar campaña o negocio"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
          <FormControl size="small">
            <InputLabel id="admin-marketing-status-label">Estado</InputLabel>
            <Select
              labelId="admin-marketing-status-label"
              label="Estado"
              value={filters.status}
              onChange={(event) => setFilters((current) => ({ ...current, status: event.target.value }))}
            >
              <MenuItem value="">Todos</MenuItem>
              {Object.entries(MARKETING_STATUS_LABELS).map(([value, label]) => (
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
            <Box sx={{ display: { xs: "none", md: "grid" }, gridTemplateColumns: "minmax(230px,1.4fr) 130px 135px minmax(210px,1fr) 180px", gap: 1.5, px: 2, py: 1.25, bgcolor: "action.hover", borderTop: "1px solid", borderColor: "divider" }}>
              {['CAMPAÑA', 'AUDIENCIA', 'ESTADO', 'PERIODO', 'ACCIONES'].map((label) => <Typography key={label} variant="caption" fontWeight={700}>{label}</Typography>)}
            </Box>
            {campaigns.map((campaign) => {
              const canPause = campaign.status === "scheduled" || campaign.status === "active";
              const canEnd = campaign.status !== "ended";
              return (
                <Box
                  key={campaign.campaignId}
                  sx={{
                    display: "grid",
                    gridTemplateColumns: { xs: "1fr", md: "minmax(230px,1.4fr) 130px 135px minmax(210px,1fr) 180px" },
                    gap: { xs: 1, md: 1.5 },
                    alignItems: "center",
                    px: 2,
                    py: 1.6,
                    borderTop: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Box sx={{ minWidth: 0 }}>
                    <Typography variant="body2" fontWeight={700} noWrap>{campaign.name}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>
                      {campaign.businessName} · #{campaign.campaignId}
                    </Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ display: { xs: "block", md: "none" } }}>
                      {MARKETING_AUDIENCE_LABELS[campaign.audience] || campaign.audience}
                    </Typography>
                  </Box>
                  <Typography variant="body2" sx={{ display: { xs: "none", md: "block" } }}>
                    {MARKETING_AUDIENCE_LABELS[campaign.audience] || campaign.audience}
                  </Typography>
                  <Box><Chip size="small" label={MARKETING_STATUS_LABELS[campaign.status] || campaign.status} color={statusColor(campaign.status)} variant="outlined" /></Box>
                  <Typography variant="caption" color="text.secondary">
                    {formatAdminDateTime(campaign.startsAt)} → {formatAdminDateTime(campaign.endsAt)}
                  </Typography>
                  <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap>
                    {canPause && <Button size="small" variant="outlined" onClick={() => openAction(campaign, "paused")}>Pausar</Button>}
                    {canEnd && <Button size="small" color="inherit" onClick={() => openAction(campaign, "ended")}>Finalizar</Button>}
                    {!canPause && !canEnd && <Typography variant="caption" color="text.secondary">Sin acciones</Typography>}
                  </Stack>
                </Box>
              );
            })}
            {!campaigns.length && (
              <Box sx={{ p: 4, textAlign: "center" }}><Typography color="text.secondary">No se encontraron campañas.</Typography></Box>
            )}
          </Box>
        )}
      </Paper>

      <AdminMarketingActionDialog
        open={Boolean(pending)}
        title={pending?.status === "paused" ? "Pausar campaña" : "Finalizar campaña"}
        description={pending ? `${pending.campaign.name} · ${pending.campaign.businessName}. Esta intervención no cambia el plan del negocio.` : ""}
        actionLabel={pending?.status === "paused" ? "Pausar" : "Finalizar"}
        actionColor={pending?.status === "paused" ? "warning" : "error"}
        reason={reason}
        onReasonChange={setReason}
        onClose={() => { if (!mutation.isLoading) { setPending(null); setReason(""); } }}
        onConfirm={apply}
        loading={mutation.isLoading}
      />
    </Stack>
  );
}
