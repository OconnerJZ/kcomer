import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  RefreshRounded,
  SearchRounded,
  WorkspacePremiumRounded,
} from "@mui/icons-material";
import { useSearchParams } from "react-router-dom";
import {
  useGetAdminBusinessPlanQuery,
  useGetAdminBusinessesQuery,
  useGetAdminPlanSummaryQuery,
} from "../api/admin.api";
import AdminPlanBasePanel from "../components/AdminPlanBasePanel";
import AdminPlanHistoryPanel from "../components/AdminPlanHistoryPanel";
import AdminPlanSummaryPanel from "../components/AdminPlanSummaryPanel";
import AdminPlanTrialPanel from "../components/AdminPlanTrialPanel";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";
const planLabel = (code = "free") => String(code).replace("level_", "L").toUpperCase();
const positiveId = (value) => {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : null;
};

export default function AdminPlansPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [feedback, setFeedback] = useState(null);
  const selectedBusinessId = positiveId(searchParams.get("businessId"));
  const appliedSearch = String(searchParams.get("q") || "").trim();
  const businessQuery = appliedSearch || (selectedBusinessId ? String(selectedBusinessId) : "");

  const summaryQuery = useGetAdminPlanSummaryQuery();
  const summary = dataOf(summaryQuery.data);
  const businessesQuery = useGetAdminBusinessesQuery({ q: businessQuery, limit: 40 });
  const businesses = dataOf(businessesQuery.data) || [];
  const selectedBusiness = selectedBusinessId
    ? businesses.find((business) => Number(business.id) === selectedBusinessId) || null
    : null;
  const planQuery = useGetAdminBusinessPlanQuery(
    { businessId: selectedBusinessId },
    { skip: !selectedBusinessId },
  );
  const plan = dataOf(planQuery.data);

  const submitSearch = (event) => {
    event.preventDefault();
    const query = search.trim();
    const next = new URLSearchParams();
    if (query) next.set("q", query);
    setSearchParams(next);
    setFeedback(null);
  };

  const selectBusiness = (businessId) => {
    const next = new URLSearchParams(searchParams);
    next.set("businessId", String(businessId));
    setSearchParams(next);
    setFeedback(null);
  };

  const selectBusinessFromSummary = (businessId) => {
    setSearchParams({ businessId: String(businessId) });
    setSearch("");
    setFeedback(null);
  };

  const refresh = () => Promise.all([
    summaryQuery.refetch(),
    businessesQuery.refetch(),
    selectedBusinessId ? planQuery.refetch() : Promise.resolve(),
  ]);

  const trialLifecycle = plan?.trial?.lifecycle;

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">COMERCIAL</Typography>
          <Typography variant="h4" fontWeight={700}>Planes & Trials</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 840 }}>
            Controla el plan base, upgrades temporales y trazabilidad comercial sin mezclar billing futuro con capacidades ya disponibles.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={refresh}
          disabled={summaryQuery.isFetching || businessesQuery.isFetching || planQuery.isFetching}
          sx={{ alignSelf: { xs: "stretch", md: "flex-start" } }}
        >
          Actualizar
        </Button>
      </Stack>

      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}
      {summaryQuery.error && <Alert severity="warning">No fue posible cargar el panorama comercial. La administración individual de planes sigue disponible.</Alert>}
      {summary && <AdminPlanSummaryPanel summary={summary} onSelectBusiness={selectBusinessFromSummary} />}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0,1fr)" }, gap: 3, alignItems: "start" }}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box component="form" onSubmit={submitSearch} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextField
                fullWidth
                size="small"
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                placeholder="Negocio, owner, email o ID"
              />
              <Button type="submit" variant="contained" aria-label="Buscar negocio"><SearchRounded /></Button>
            </Stack>
          </Box>
          <Divider />

          {businessesQuery.isLoading ? (
            <Box sx={{ p: 4, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>
          ) : businessesQuery.error ? (
            <Alert severity="error" sx={{ m: 2 }}>{errorMessage(businessesQuery.error)}</Alert>
          ) : (
            <List disablePadding sx={{ maxHeight: { xs: 360, lg: "calc(100vh - 330px)" }, overflow: "auto" }}>
              {businesses.map((business) => (
                <ListItemButton
                  key={business.id}
                  selected={Number(business.id) === selectedBusinessId}
                  onClick={() => selectBusiness(business.id)}
                  divider
                  sx={{ py: 1.35 }}
                >
                  <ListItemText
                    primary={business.name}
                    secondary={`#${business.id} · ${business.owner?.email || business.email || "Sin email"}`}
                    primaryTypographyProps={{ fontWeight: Number(business.id) === selectedBusinessId ? 700 : 550, noWrap: true }}
                    secondaryTypographyProps={{ noWrap: true }}
                  />
                  <Chip size="small" label={planLabel(business.plan?.effectivePlanCode)} variant="outlined" />
                </ListItemButton>
              ))}
              {!businesses.length && (
                <Box sx={{ p: 3 }}><Typography variant="body2" color="text.secondary">No se encontraron negocios.</Typography></Box>
              )}
            </List>
          )}
        </Paper>

        {!selectedBusinessId ? (
          <Paper variant="outlined" sx={{ p: { xs: 4, md: 6 }, textAlign: "center" }}>
            <WorkspacePremiumRounded sx={{ fontSize: 48, color: "text.disabled" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>Selecciona un negocio</Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              Puedes llegar aquí desde Negocios o buscar directamente por owner, email o ID.
            </Typography>
          </Paper>
        ) : planQuery.isLoading ? (
          <Paper variant="outlined" sx={{ p: 7, display: "grid", placeItems: "center" }}><CircularProgress /></Paper>
        ) : planQuery.error ? (
          <Alert severity="error" action={<Button color="inherit" size="small" onClick={planQuery.refetch}>Reintentar</Button>}>
            {errorMessage(planQuery.error)}
          </Alert>
        ) : plan ? (
          <Stack spacing={2.5}>
            <Box>
              <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">NEGOCIO #{selectedBusinessId}</Typography>
                  <Typography variant="h5" fontWeight={750}>{selectedBusiness?.name || `Negocio #${selectedBusinessId}`}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {selectedBusiness?.owner?.name || "Owner principal"} · {selectedBusiness?.owner?.email || selectedBusiness?.email || "Sin email"}
                  </Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Chip label={`Efectivo: ${plan.plan?.name || "Gratis"}`} color="primary" />
                  <Chip label={`Base: ${plan.basePlan?.name || "Gratis"}`} variant="outlined" />
                  {trialLifecycle === "active" && <Chip label="Trial activo" color="success" variant="outlined" />}
                  {trialLifecycle === "scheduled" && <Chip label="Trial programado" color="info" variant="outlined" />}
                </Stack>
              </Stack>
              {plan.message && (
                <Alert severity="info" sx={{ mt: 2 }}>{plan.message}</Alert>
              )}
            </Box>

            <AdminPlanBasePanel key={`base-${selectedBusinessId}`} businessId={selectedBusinessId} plan={plan} onFeedback={setFeedback} />
            <AdminPlanTrialPanel key={`trial-${selectedBusinessId}`} businessId={selectedBusinessId} plan={plan} onFeedback={setFeedback} />
            <AdminPlanHistoryPanel businessId={selectedBusinessId} />
          </Stack>
        ) : null}
      </Box>
    </Stack>
  );
}
