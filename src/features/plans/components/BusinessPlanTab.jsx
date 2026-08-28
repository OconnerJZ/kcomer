/* eslint-disable react/prop-types */
import { Alert, Box, Chip, CircularProgress, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { CheckCircleRounded, CampaignRounded, LockRounded, WorkspacePremiumRounded } from "@mui/icons-material";
import { useGetBusinessPlanQuery } from "@Features/business/api/business.api";
import { availableFeatures, formatPlanLimit, limitProgress, upcomingFeatures } from "../model/businessPlan";

const LIMIT_LABELS = { teamMembers: "Miembros del equipo", menuItems: "Productos del menú", analyticsHistoryDays: "Historial de analítica", monthlyExports: "Exportaciones mensuales", sharedParticipants: "Participantes compartidos", activeSharedSessions: "Sesiones compartidas activas" };

const PlanCard = ({ plan, current }) => {
  const future = upcomingFeatures(plan.features);
  return <Paper variant="outlined" sx={{ p: 2.2, borderRadius: 3, borderColor: current ? "primary.main" : "divider", bgcolor: current ? "rgba(255,75,69,.035)" : "background.paper", position: "relative" }}>{current && <Chip label="Plan actual" color="primary" size="small" sx={{ position: "absolute", top: 14, right: 14, fontWeight: 800 }}/>}<Typography variant="overline" color="text.secondary">{plan.code === "free" ? "SIN COSTO" : "PRECIO POR DEFINIR"}</Typography><Typography variant="h6" fontWeight={900}>{plan.name}</Typography><Typography variant="body2" color="text.secondary" sx={{ minHeight: 42, mt: .5 }}>{plan.description}</Typography><Stack gap={.8} sx={{ mt: 2 }}>{availableFeatures(plan.features).slice(0, 5).map((feature) => <Stack key={feature.key} direction="row" gap={.8} alignItems="center"><CheckCircleRounded color="success" sx={{ fontSize: 17 }}/><Typography variant="caption">{feature.label}</Typography></Stack>)}{future.map((feature) => <Stack key={feature.key} direction="row" gap={.8} alignItems="center"><LockRounded color="disabled" sx={{ fontSize: 16 }}/><Typography variant="caption" color="text.secondary">{feature.label} · Próximamente</Typography></Stack>)}</Stack>{plan.adsEnabled && <Chip icon={<CampaignRounded/>} label="Puede mostrar anuncios" size="small" variant="outlined" sx={{ mt: 2 }}/>}</Paper>;
};

export default function BusinessPlanTab({ businessId }) {
  const { data: response, isLoading, error } = useGetBusinessPlanQuery({ businessId }, { skip: !businessId });
  if (isLoading) return <Box sx={{ minHeight: 260, display: "grid", placeItems: "center" }}><CircularProgress/></Box>;
  if (error) return <Alert severity="error">{error?.data?.message || "No se pudo cargar el plan"}</Alert>;
  const data = response?.data || response;
  if (!data) return null;
  const current = data.current;
  return <Stack gap={2.5}>
    <Paper elevation={0} sx={{ p: { xs: 2.5, sm: 3 }, borderRadius: 3.5, color: "white", bgcolor: "#25272b", backgroundImage: "radial-gradient(circle at 90% 0%,rgba(255,75,69,.32),transparent 38%)" }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}><Box><Stack direction="row" gap={1} alignItems="center"><WorkspacePremiumRounded sx={{ color: "#ff6a64" }}/><Typography variant="overline" sx={{ color: "rgba(255,255,255,.62)" }}>PLAN DEL NEGOCIO</Typography></Stack><Typography variant="h4" fontWeight={900}>{current.name}</Typography><Typography variant="body2" sx={{ color: "rgba(255,255,255,.67)", mt: .6 }}>{current.description}</Typography></Box><Stack alignItems={{ sm: "flex-end" }} justifyContent="center"><Chip label={current.adsEnabled ? "Anuncios habilitados" : "Sin anuncios"} sx={{ color: "white", bgcolor: "rgba(255,255,255,.1)" }}/><Typography variant="caption" sx={{ color: "rgba(255,255,255,.5)", mt: 1 }}>Cobro automático no habilitado</Typography></Stack></Stack></Paper>
    <Alert severity="info" variant="outlined">{data.message} Nadie puede activar un nivel pagado desde esta pantalla.</Alert>
    <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="h6" fontWeight={850}>Uso y límites</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Los límites sólo se aplican cuando existe una configuración comercial explícita.</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 2 }}>{Object.entries(data.limits || {}).map(([key, value]) => { const progress = limitProgress(value); return <Box key={key} sx={{ p: 1.7, bgcolor: "grey.50", borderRadius: 2.5 }}><Typography variant="body2" fontWeight={800}>{LIMIT_LABELS[key] || key}</Typography><Typography variant="caption" color="text.secondary">{formatPlanLimit(value)}</Typography>{progress != null && <LinearProgress variant="determinate" value={progress} sx={{ mt: 1, height: 6, borderRadius: 4 }}/>}</Box>; })}</Box></Paper>
    <Box><Typography variant="h6" fontWeight={850}>Comparar niveles</Typography><Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Sin precios ni restricciones inventadas; los niveles pagados permanecen en preparación.</Typography><Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))", xl: "repeat(4,minmax(0,1fr))" }, gap: 1.5 }}>{(data.catalog || []).map((plan) => <PlanCard key={plan.code} plan={plan} current={plan.code === current.code}/>)}</Box></Box>
  </Stack>;
}
