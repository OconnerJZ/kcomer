import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Divider,
  FormControl,
  InputLabel,
  List,
  ListItemButton,
  ListItemText,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SearchRounded, WorkspacePremiumRounded } from "@mui/icons-material";
import PlanImpactPreview from "../components/PlanImpactPreview";
import {
  useAssignAdminBusinessPlanMutation,
  useCancelAdminBusinessPlanTrialMutation,
  useGetAdminBusinessPlanHistoryQuery,
  useGetAdminBusinessPlanQuery,
  useGetAdminBusinessesQuery,
  useGrantAdminBusinessPlanTrialMutation,
} from "../api/admin.api";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";

export default function AdminPlansPage() {
  const [search, setSearch] = useState("");
  const [appliedSearch, setAppliedSearch] = useState("");
  const [selectedBusiness, setSelectedBusiness] = useState(null);
  const [planCodeOverride, setPlanCodeOverride] = useState(null);
  const [trialPlanCodeOverride, setTrialPlanCodeOverride] = useState(null);
  const [trialEndsAt, setTrialEndsAt] = useState("");
  const [feedback, setFeedback] = useState(null);

  const businessesQuery = useGetAdminBusinessesQuery({ q: appliedSearch, limit: 30 });
  const businesses = dataOf(businessesQuery.data) || [];
  const businessId = selectedBusiness?.id;
  const planQuery = useGetAdminBusinessPlanQuery({ businessId }, { skip: !businessId });
  const historyQuery = useGetAdminBusinessPlanHistoryQuery({ businessId }, { skip: !businessId });
  const plan = dataOf(planQuery.data);
  const history = dataOf(historyQuery.data) || [];
  const catalog = plan?.catalog ?? [];
  const planCode = planCodeOverride ?? plan?.basePlan?.code ?? plan?.plan?.code ?? "free";
  const trialPlanCode = trialPlanCodeOverride ?? plan?.plan?.code ?? "level_1";
  const [assignPlan, assignState] = useAssignAdminBusinessPlanMutation();
  const [grantTrial, trialState] = useGrantAdminBusinessPlanTrialMutation();
  const [cancelTrial, cancelState] = useCancelAdminBusinessPlanTrialMutation();
  const busy = assignState.isLoading || trialState.isLoading || cancelState.isLoading;
  const activeTrial = plan?.trial?.active ? plan.trial : null;
  const selectedPlanName = catalog.find((entry) => entry.code === planCode)?.name || planCode;

  const refreshAfterMutation = async () => {
    await Promise.all([planQuery.refetch(), historyQuery.refetch(), businessesQuery.refetch()]);
  };

  const selectBusiness = (business) => {
    setSelectedBusiness(business);
    setPlanCodeOverride(null);
    setTrialPlanCodeOverride(null);
    setTrialEndsAt("");
    setFeedback(null);
  };

  const onAssignPlan = async () => {
    try {
      setFeedback(null);
      await assignPlan({
        businessId,
        planCode,
        expectedVersion: plan?.subscription?.version || undefined,
      }).unwrap();
      await refreshAfterMutation();
      setPlanCodeOverride(null);
      setFeedback({ severity: "success", message: `Plan base actualizado a ${selectedPlanName}.` });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  const onGrantTrial = async () => {
    try {
      setFeedback(null);
      const parsedEnd = new Date(trialEndsAt);
      if (!trialEndsAt || Number.isNaN(parsedEnd.getTime()) || parsedEnd.getTime() <= Date.now()) {
        setFeedback({ severity: "warning", message: "Selecciona una fecha futura para terminar el trial." });
        return;
      }
      await grantTrial({
        businessId,
        planCode: trialPlanCode,
        endsAt: parsedEnd.toISOString(),
        expectedVersion: plan?.subscription?.version || undefined,
      }).unwrap();
      await refreshAfterMutation();
      setTrialPlanCodeOverride(null);
      setTrialEndsAt("");
      setFeedback({ severity: "success", message: "Trial activado correctamente." });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  const onCancelTrial = async () => {
    try {
      setFeedback(null);
      await cancelTrial({
        businessId,
        expectedVersion: plan?.subscription?.version || undefined,
      }).unwrap();
      await refreshAfterMutation();
      setFeedback({ severity: "success", message: "Trial cancelado; el negocio volvió a su plan base." });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Stack spacing={3}>
      <Box>
        <Typography variant="overline" color="text.secondary">COMERCIAL</Typography>
        <Typography variant="h4" fontWeight={700}>Control de planes</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 820 }}>
          Busca un negocio, revisa su plan efectivo y administra su plan base o trial sin intervenir en las funciones core.
        </Typography>
      </Box>

      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "360px minmax(0,1fr)" }, gap: 3, alignItems: "start" }}>
        <Paper variant="outlined" sx={{ overflow: "hidden" }}>
          <Box component="form" onSubmit={(event) => { event.preventDefault(); setAppliedSearch(search.trim()); }} sx={{ p: 2 }}>
            <Stack direction="row" spacing={1}>
              <TextField fullWidth size="small" value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nombre, email o ID" />
              <Button type="submit" variant="contained" aria-label="Buscar"><SearchRounded /></Button>
            </Stack>
          </Box>
          <Divider />
          {businessesQuery.isLoading ? (
            <Box sx={{ p: 4, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>
          ) : businessesQuery.error ? (
            <Alert severity="error" sx={{ m: 2 }}>{errorMessage(businessesQuery.error)}</Alert>
          ) : (
            <List disablePadding sx={{ maxHeight: 620, overflow: "auto" }}>
              {businesses.map((business) => (
                <ListItemButton key={business.id} selected={business.id === businessId} onClick={() => selectBusiness(business)} divider>
                  <ListItemText
                    primary={business.name}
                    secondary={`#${business.id} · ${business.owner?.email || business.email || "Sin email"}`}
                    primaryTypographyProps={{ fontWeight: business.id === businessId ? 700 : 500 }}
                  />
                  <Chip size="small" label={(business.plan?.effectivePlanCode || "free").replace("level_", "L").toUpperCase()} variant="outlined" />
                </ListItemButton>
              ))}
              {!businesses.length && <Box sx={{ p: 3 }}><Typography variant="body2" color="text.secondary">No se encontraron negocios.</Typography></Box>}
            </List>
          )}
        </Paper>

        {!selectedBusiness ? (
          <Paper variant="outlined" sx={{ p: 5, textAlign: "center" }}>
            <WorkspacePremiumRounded sx={{ fontSize: 46, color: "text.disabled" }} />
            <Typography variant="h6" sx={{ mt: 1 }}>Selecciona un negocio</Typography>
            <Typography variant="body2" color="text.secondary">Aquí podrás administrar únicamente su suscripción comercial.</Typography>
          </Paper>
        ) : planQuery.isLoading ? (
          <Paper variant="outlined" sx={{ p: 6, display: "grid", placeItems: "center" }}><CircularProgress /></Paper>
        ) : planQuery.error ? (
          <Alert severity="error">{errorMessage(planQuery.error)}</Alert>
        ) : (
          <Stack spacing={2.5}>
            <Paper variant="outlined" sx={{ p: 3 }}>
              <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={2}>
                <Box>
                  <Typography variant="overline" color="text.secondary">NEGOCIO #{selectedBusiness.id}</Typography>
                  <Typography variant="h5" fontWeight={700}>{selectedBusiness.name}</Typography>
                  <Typography variant="body2" color="text.secondary">Owner principal: {selectedBusiness.owner?.name || "—"} · {selectedBusiness.owner?.email || "Sin email"}</Typography>
                </Box>
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Chip label={`Efectivo: ${plan?.plan?.name || "Gratis"}`} color="primary" />
                  <Chip label={`Base: ${plan?.basePlan?.name || "Gratis"}`} variant="outlined" />
                  {activeTrial && <Chip label="Trial activo" color="warning" variant="outlined" />}
                </Stack>
              </Stack>
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>Plan base</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Cambiar el plan base cancela cualquier trial activo para evitar estados ambiguos.</Typography>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Plan</InputLabel>
                  <Select label="Plan" value={planCode} onChange={(event) => setPlanCodeOverride(event.target.value)}>
                    {catalog.map((entry) => <MenuItem key={entry.code} value={entry.code}>{entry.name}</MenuItem>)}
                  </Select>
                </FormControl>
                <Button variant="contained" disabled={busy || !planCode || planCode === plan?.basePlan?.code} onClick={onAssignPlan}>Guardar plan base</Button>
                <Typography variant="caption" color="text.secondary">Versión {plan?.subscription?.version || "—"}</Typography>
              </Stack>
              <PlanImpactPreview businessId={businessId} planCode={planCode} currentBasePlanCode={plan?.basePlan?.code} />
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>Trial</Typography>
              {activeTrial ? (
                <Stack spacing={1.5} sx={{ mt: 1.5 }}>
                  <Alert severity="info">{activeTrial.name || activeTrial.planCode} activo hasta {dateLabel(activeTrial.endsAt)}. Después se recupera automáticamente {plan?.basePlan?.name}.</Alert>
                  <Box><Button variant="outlined" color="warning" disabled={busy} onClick={onCancelTrial}>Cancelar trial</Button></Box>
                </Stack>
              ) : (
                <Stack direction={{ xs: "column", md: "row" }} spacing={2} sx={{ mt: 2 }} alignItems={{ md: "center" }}>
                  <FormControl size="small" sx={{ minWidth: 220 }}>
                    <InputLabel>Plan del trial</InputLabel>
                    <Select label="Plan del trial" value={trialPlanCode} onChange={(event) => setTrialPlanCodeOverride(event.target.value)}>
                      {catalog.map((entry) => <MenuItem key={entry.code} value={entry.code}>{entry.name}</MenuItem>)}
                    </Select>
                  </FormControl>
                  <TextField size="small" label="Finaliza" type="datetime-local" value={trialEndsAt} onChange={(event) => setTrialEndsAt(event.target.value)} InputLabelProps={{ shrink: true }} />
                  <Button variant="outlined" disabled={busy || !trialPlanCode || !trialEndsAt} onClick={onGrantTrial}>Activar trial</Button>
                </Stack>
              )}
            </Paper>

            <Paper variant="outlined" sx={{ p: 3 }}>
              <Typography variant="h6" fontWeight={700}>Historial comercial</Typography>
              <Stack spacing={1.2} sx={{ mt: 2 }}>
                {historyQuery.isLoading && <CircularProgress size={24} />}
                {!historyQuery.isLoading && !history.length && <Typography variant="body2" color="text.secondary">Aún no hay eventos de plan registrados.</Typography>}
                {history.map((event) => (
                  <Box key={event.auditId} sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "180px 1fr" }, gap: 1, py: 1.2, borderBottom: "1px solid", borderColor: "divider" }}>
                    <Typography variant="caption" color="text.secondary">{dateLabel(event.createdAt)}</Typography>
                    <Box>
                      <Typography variant="body2" fontWeight={650}>{event.action}</Typography>
                      <Typography variant="caption" color="text.secondary">{event.previousPlan || "—"} → {event.nextPlan || "—"} · actor #{event.actorUserId || "sistema"}</Typography>
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Stack>
        )}
      </Box>
    </Stack>
  );
}
