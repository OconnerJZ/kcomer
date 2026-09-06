/* eslint-disable react/prop-types */
import { Alert, Box, Chip, CircularProgress, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, CampaignRounded, LockRounded, WorkspacePremiumRounded } from "@mui/icons-material";
import { useGetBusinessPlanQuery } from "@Features/business/api/business.api";
import { availableFeatures, formatPlanLimit, limitProgress, upcomingFeatures } from "../model/businessPlan";
import PlanValueMatrix from "./PlanValueMatrix";

const LIMIT_LABELS = {
  teamMembers: "Miembros del equipo",
  menuItems: "Productos del menú",
  businessPhotos: "Fotos del negocio",
  analyticsHistoryDays: "Historial de analítica",
};

const PlanCard = ({ plan, current }) => {
  const future = upcomingFeatures(plan.features);
  const adsEnabled = plan.policies?.adsEnabled ?? plan.adsEnabled;

  return (
    <Paper variant="outlined" sx={{ p: 2.2, borderRadius: "8px", borderColor: current ? "primary.main" : "divider", bgcolor: current ? "rgba(198,90,80,.05)" : "background.paper", position: "relative" }}>
      {current && <Chip label="Plan actual" color="primary" size="small" sx={{ position: "absolute", top: 14, right: 14, fontWeight: 600 }} />}
      <Typography variant="overline" color="text.secondary">{plan.code === "free" ? "SIN COSTO" : "PRECIO POR DEFINIR"}</Typography>
      <Typography variant="h6" fontWeight={600}>{plan.name}</Typography>
      {plan.positioning && <Typography variant="caption" fontWeight={700} color="primary.main">{plan.positioning}</Typography>}
      <Typography variant="body2" color="text.secondary" sx={{ minHeight: 42, mt: .5 }}>{plan.description}</Typography>
      <Stack gap={.8} sx={{ mt: 2 }}>
        {availableFeatures(plan.features).slice(0, 5).map((feature) => <Stack key={feature.key} direction="row" gap={.8} alignItems="center"><CheckCircleRounded color="success" sx={{ fontSize: 17 }} /><Typography variant="caption">{feature.label}</Typography></Stack>)}
        {future.slice(0, 4).map((feature) => <Stack key={feature.key} direction="row" gap={.8} alignItems="center"><LockRounded color="disabled" sx={{ fontSize: 16 }} /><Typography variant="caption" color="text.secondary">{feature.label} · Próximamente</Typography></Stack>)}
      </Stack>
      {adsEnabled && <Chip icon={<CampaignRounded />} label="Puede mostrar anuncios" size="small" variant="outlined" sx={{ mt: 2 }} />}
    </Paper>
  );
};

export default function BusinessPlanTab({ businessId }) {
  const { data: response, isLoading, error } = useGetBusinessPlanQuery({ businessId }, { skip: !businessId });
  if (isLoading) return <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  if (error) return <Alert severity="error">{error?.data?.message || "No se pudo cargar el plan"}</Alert>;

  const data = response?.data || response;
  if (!data) return null;

  const legacyCurrent = data.current || {};
  const current = { ...legacyCurrent, ...(data.plan || {}), adsEnabled: data.policies?.adsEnabled ?? legacyCurrent.adsEnabled };
  const trial = data.trial;
  const basePlan = data.basePlan;
  const catalog = data.catalog || [];

  return <Stack gap={2.5}>
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: "8px", color: "white", bgcolor: "#34312D" }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Box><Stack direction="row" gap={1} alignItems="center"><WorkspacePremiumRounded sx={{ color: "#D9877F" }} /><Typography variant="overline" sx={{ color: "rgba(255,255,255,.62)" }}>PLAN DEL NEGOCIO</Typography></Stack><Stack direction="row" alignItems="center" gap={1} flexWrap="wrap"><Typography variant="h4" fontWeight={600}>{current.name}</Typography>{trial?.active && <Chip label="Trial activo" size="small" sx={{ color: "white", bgcolor: "rgba(255,255,255,.14)" }} />}</Stack><Typography variant="body2" sx={{ color: "rgba(255,255,255,.67)", mt: .6 }}>{current.description}</Typography>{trial?.active && basePlan && <Typography variant="caption" sx={{ color: "rgba(255,255,255,.58)", display: "block", mt: 1 }}>Plan base: {basePlan.name}. Al terminar el trial se conserva este plan.</Typography>}</Box><Stack alignItems={{ sm: "flex-end" }} justifyContent="center"><Chip label={current.adsEnabled ? "Publicidad permitida por el plan" : "Sin publicidad por política del plan"} sx={{ color: "white", bgcolor: "rgba(255,255,255,.1)" }} /><Typography variant="caption" sx={{ color: "rgba(255,255,255,.5)", mt: 1 }}>Cobro automático no habilitado</Typography></Stack></Stack></Paper>
    <Alert severity="info" variant="outlined">{data.message} Nadie puede activar un nivel pagado desde esta pantalla.</Alert>
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: "8px" }}><Typography variant="h6" fontWeight={600}>Uso y límites</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Los límites comerciales describen escala del negocio. Realtime, órdenes, Shared Orders y reseñas verificadas no se bloquean por nivel.</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2 }}>{Object.entries(data.limits || {}).map(([key, value]) => { const progress = limitProgress(value); return <Box key={key} sx={{ p: 1.7, bgcolor: "grey.50", borderRadius: "8px" }}><Typography variant="body2" fontWeight={600}>{LIMIT_LABELS[key] || key}</Typography><Typography variant="caption" color="text.secondary">{formatPlanLimit(value)}</Typography>{progress != null && <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, height: 6, borderRadius: "8px" }} />}</Box>; })}</Box></Paper>
    <Box><Typography variant="h6" fontWeight={600}>Comparar niveles</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>FREE mantiene el flujo completo para vender. Los niveles pagados se diferencian por escala, reputación, crecimiento e inteligencia, no por bloquear la experiencia del cliente.</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))", xl: "repeat(4,minmax(0,1fr))" }, gap: 1.5 }}>{catalog.map((plan) => <PlanCard key={plan.code} plan={plan} current={plan.code === current.code} />)}</Box></Box>
    <PlanValueMatrix catalog={catalog} />
  </Stack>;
}
