/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import {
  Alert, Box, Button, Chip, CircularProgress, Divider, MenuItem, Paper, Stack,
  Tab, Tabs, TextField, Typography,
} from "@mui/material";
import { CampaignRounded, GroupsRounded, PaidRounded } from "@mui/icons-material";
import {
  useCreateAdCampaignMutation,
  useCreateMarketingCampaignMutation,
  useGetMarketingOverviewQuery,
  useGetMarketingSegmentsQuery,
  usePauseAdCampaignMutation,
  useSetMarketingCampaignStatusMutation,
  useSubmitAdCampaignMutation,
} from "@Features/marketing/api/marketing.api";

const campaignStatus = {
  draft: "Borrador", scheduled: "Programada", active: "Activa", paused: "Pausada", ended: "Finalizada",
};
const adStatus = {
  draft: "Borrador", pending_billing: "Pendiente de facturación", ready: "Lista", active: "Activa", paused: "Pausada", ended: "Finalizada",
};
const audienceOptions = [
  { value: "all", label: "Todos los clientes observados" },
  { value: "new", label: "Una compra observada" },
  { value: "returning", label: "Recurrentes (2+)" },
  { value: "frequent", label: "Frecuentes (4+)" },
  { value: "inactive_90", label: "Inactivos 90+ días" },
];

const unwrap = (value) => value?.data || value || {};
const dateValue = (value) => value ? new Date(value).toLocaleDateString("es-MX") : "Sin fecha";
const money = (value) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN" }).format(Number(value || 0));

function MarketingCampaigns({ businessId, overview }) {
  const [createCampaign, createState] = useCreateMarketingCampaignMutation();
  const [setStatus] = useSetMarketingCampaignStatusMutation();
  const [form, setForm] = useState({ name: "", message: "", objective: "retention", audience: "all", startsAt: "", endsAt: "" });
  const available = overview.marketing?.available;
  const segmentsAvailable = overview.segments?.available;
  const campaigns = overview.marketing?.campaigns || [];

  const submit = async (event) => {
    event.preventDefault();
    await createCampaign({ businessId, ...form }).unwrap();
    setForm({ name: "", message: "", objective: "retention", audience: "all", startsAt: "", endsAt: "" });
  };

  if (!available) return <Alert severity="info">Marketing Center está disponible desde Nivel 1. qsCome Ads sigue siendo un producto independiente y puede prepararse desde la pestaña Ads.</Alert>;

  return <Stack gap={2}>
    <Paper variant="outlined" component="form" onSubmit={submit} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: "8px" }}>
      <Typography variant="h6" fontWeight={600}>Nueva campaña</Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mt: .5, mb: 2 }}>Define el mensaje y la audiencia. Esta foundation administra la campaña; no envía emails/SMS ni extrae contactos.</Typography>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, gap: 1.5 }}>
        <TextField size="small" label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required inputProps={{ maxLength: 120 }}/>
        <TextField size="small" select label="Objetivo" value={form.objective} onChange={(e) => setForm({ ...form, objective: e.target.value })}>
          <MenuItem value="acquisition">Adquisición</MenuItem><MenuItem value="retention">Retención</MenuItem><MenuItem value="reactivation">Reactivación</MenuItem>
        </TextField>
        <TextField size="small" select label="Audiencia" value={form.audience} onChange={(e) => setForm({ ...form, audience: e.target.value })}>
          {audienceOptions.map((item) => <MenuItem key={item.value} value={item.value} disabled={item.value !== "all" && !segmentsAvailable}>{item.label}{item.value !== "all" && !segmentsAvailable ? " · Nivel 2" : ""}</MenuItem>)}
        </TextField>
        <TextField size="small" label="Mensaje" value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} required inputProps={{ maxLength: 280 }}/>
        <TextField size="small" type="datetime-local" label="Inicio" InputLabelProps={{ shrink: true }} value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })}/>
        <TextField size="small" type="datetime-local" label="Fin" InputLabelProps={{ shrink: true }} value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })}/>
      </Box>
      {createState.error && <Alert severity="error" sx={{ mt: 1.5 }}>{createState.error?.data?.message || "No se pudo crear la campaña"}</Alert>}
      <Button type="submit" variant="contained" disabled={createState.isLoading} sx={{ mt: 2 }}>Guardar borrador</Button>
    </Paper>

    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1.2 }}>Campañas</Typography>
      {!campaigns.length && <Alert severity="info" variant="outlined">Aún no hay campañas.</Alert>}
      <Stack gap={1}>
        {campaigns.map((campaign) => <Paper key={campaign.campaignId} variant="outlined" sx={{ p: 1.8, borderRadius: "8px" }}>
          <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1.2}>
            <Box><Stack direction="row" gap={1} alignItems="center" flexWrap="wrap"><Typography fontWeight={600}>{campaign.name}</Typography><Chip size="small" label={campaignStatus[campaign.status] || campaign.status}/></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{campaign.message}</Typography><Typography variant="caption" color="text.secondary">{dateValue(campaign.startsAt)} → {dateValue(campaign.endsAt)} · {campaign.audience}</Typography></Box>
            <Stack direction="row" gap={1} alignItems="center">
              {campaign.status === "draft" && <Button size="small" onClick={() => setStatus({ businessId, campaignId: campaign.campaignId, status: "scheduled" })}>Programar</Button>}
              {campaign.status === "active" && <Button size="small" onClick={() => setStatus({ businessId, campaignId: campaign.campaignId, status: "paused" })}>Pausar</Button>}
              {campaign.status === "paused" && <Button size="small" onClick={() => setStatus({ businessId, campaignId: campaign.campaignId, status: "active" })}>Reanudar</Button>}
            </Stack>
          </Stack>
        </Paper>)}
      </Stack>
    </Box>
  </Stack>;
}

function Segments({ businessId, available }) {
  const { data, isLoading, error } = useGetMarketingSegmentsQuery({ businessId }, { skip: !available });
  if (!available) return <Alert severity="info">Los segmentos agregados están disponibles desde Nivel 2. No se exponen identidades ni datos de contacto.</Alert>;
  if (isLoading) return <Box sx={{ py: 5, textAlign: "center" }}><CircularProgress size={28}/></Box>;
  if (error) return <Alert severity="error">{error?.data?.message || "No se pudieron cargar los segmentos"}</Alert>;
  const segments = unwrap(data);
  return <Stack gap={2}>
    <Alert severity="info" variant="outlined">{segments.privacyNote}</Alert>
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(3,minmax(0,1fr))" }, gap: 1.2 }}>
      {(segments.audiences || []).map((item) => <Paper key={item.key} variant="outlined" sx={{ p: 2, borderRadius: "8px" }}><Typography variant="body2" color="text.secondary">{item.label}</Typography><Typography variant="h5" fontWeight={600} sx={{ mt: .5 }}>{item.count}</Typography></Paper>)}
    </Box>
    <Typography variant="caption" color="text.secondary">Ventana observada: hasta {segments.historyDays} días según el plan efectivo.</Typography>
  </Stack>;
}

function Ads({ businessId, overview }) {
  const [createAd, createState] = useCreateAdCampaignMutation();
  const [submitAd] = useSubmitAdCampaignMutation();
  const [pauseAd] = usePauseAdCampaignMutation();
  const [form, setForm] = useState({ name: "", surface: "explore", objective: "orders", dailyBudget: "", totalBudget: "", radiusKm: "", startsAt: "", endsAt: "" });
  const ads = overview.ads?.campaigns || [];

  const submit = async (event) => {
    event.preventDefault();
    await createAd({ businessId, ...form }).unwrap();
    setForm({ name: "", surface: "explore", objective: "orders", dailyBudget: "", totalBudget: "", radiusKm: "", startsAt: "", endsAt: "" });
  };

  return <Stack gap={2}>
    <Alert severity="warning" variant="outlined">qsCome Ads es un producto separado de los planes. Billing todavía no está habilitado: enviar una campaña la deja pendiente de facturación y no genera gasto ni entrega automática.</Alert>
    <Paper variant="outlined" component="form" onSubmit={submit} sx={{ p: { xs: 2, md: 2.5 }, borderRadius: "8px" }}>
      <Typography variant="h6" fontWeight={600}>Preparar campaña publicitaria</Typography>
      <Box sx={{ mt: 2, display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, gap: 1.5 }}>
        <TextField size="small" label="Nombre" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required/>
        <TextField size="small" select label="Superficie" value={form.surface} onChange={(e) => setForm({ ...form, surface: e.target.value })}><MenuItem value="explore">Explore</MenuItem><MenuItem value="hero">Hero</MenuItem></TextField>
        <TextField size="small" label="Presupuesto diario" type="number" value={form.dailyBudget} onChange={(e) => setForm({ ...form, dailyBudget: e.target.value })} required/>
        <TextField size="small" label="Presupuesto total" type="number" value={form.totalBudget} onChange={(e) => setForm({ ...form, totalBudget: e.target.value })} required/>
        <TextField size="small" label="Radio (km)" type="number" value={form.radiusKm} onChange={(e) => setForm({ ...form, radiusKm: e.target.value })}/>
        <TextField size="small" type="datetime-local" label="Inicio" InputLabelProps={{ shrink: true }} value={form.startsAt} onChange={(e) => setForm({ ...form, startsAt: e.target.value })} required/>
        <TextField size="small" type="datetime-local" label="Fin" InputLabelProps={{ shrink: true }} value={form.endsAt} onChange={(e) => setForm({ ...form, endsAt: e.target.value })} required/>
      </Box>
      {createState.error && <Alert severity="error" sx={{ mt: 1.5 }}>{createState.error?.data?.message || "No se pudo crear el anuncio"}</Alert>}
      <Button type="submit" variant="contained" disabled={createState.isLoading} sx={{ mt: 2 }}>Guardar borrador</Button>
    </Paper>

    <Box>
      <Typography variant="h6" fontWeight={600} sx={{ mb: 1.2 }}>Campañas Ads</Typography>
      {!ads.length && <Alert severity="info" variant="outlined">Aún no hay campañas publicitarias.</Alert>}
      <Stack gap={1}>{ads.map((ad) => <Paper key={ad.adCampaignId} variant="outlined" sx={{ p: 1.8, borderRadius: "8px" }}>
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1.2}>
          <Box><Stack direction="row" gap={1} flexWrap="wrap" alignItems="center"><Typography fontWeight={600}>{ad.name}</Typography><Chip size="small" label="Patrocinado" variant="outlined"/><Chip size="small" label={adStatus[ad.status] || ad.status}/></Stack><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>{ad.surface === "hero" ? "Hero" : "Explore"} · {money(ad.dailyBudget)}/día · {money(ad.totalBudget)} total</Typography><Typography variant="caption" color="text.secondary">Gasto registrado: {money(ad.spentAmount)} · {ad.impressions || 0} impresiones · {ad.clicks || 0} clics</Typography></Box>
          <Stack direction="row" gap={1} alignItems="center">{ad.status === "draft" && <Button size="small" onClick={() => submitAd({ businessId, adCampaignId: ad.adCampaignId })}>Enviar</Button>}{ad.status === "active" && <Button size="small" onClick={() => pauseAd({ businessId, adCampaignId: ad.adCampaignId })}>Pausar</Button>}</Stack>
        </Stack>
      </Paper>)}</Stack>
    </Box>
  </Stack>;
}

export default function OwnerMarketing({ businessId }) {
  const [section, setSection] = useState("campaigns");
  const { data, isLoading, error } = useGetMarketingOverviewQuery({ businessId }, { skip: !businessId });
  const overview = useMemo(() => unwrap(data), [data]);
  if (isLoading) return <Box sx={{ py: 8, display: "grid", placeItems: "center" }}><CircularProgress size={30}/></Box>;
  if (error) return <Alert severity="error">{error?.data?.message || "No se pudo cargar Marketing"}</Alert>;

  return <Box sx={{ pb: 4 }}>
    <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" gap={1.5} sx={{ mb: 2 }}>
      <Box><Typography variant="overline" color="text.secondary">Crecimiento</Typography><Typography variant="h4" fontWeight={600}>Marketing</Typography><Typography variant="body2" color="text.secondary" sx={{ mt: .5 }}>Campañas propias, audiencias agregadas y publicidad patrocinada sin mezclarla con el ranking orgánico.</Typography></Box>
    </Stack>
    <Divider />
    <Tabs value={section} onChange={(_e, value) => setSection(value)} variant="scrollable" scrollButtons="auto" sx={{ mb: 2 }}>
      <Tab value="campaigns" icon={<CampaignRounded fontSize="small"/>} iconPosition="start" label="Campañas"/>
      <Tab value="segments" icon={<GroupsRounded fontSize="small"/>} iconPosition="start" label="Segmentos"/>
      <Tab value="ads" icon={<PaidRounded fontSize="small"/>} iconPosition="start" label="qsCome Ads"/>
    </Tabs>
    {section === "campaigns" && <MarketingCampaigns businessId={businessId} overview={overview}/>} 
    {section === "segments" && <Segments businessId={businessId} available={overview.segments?.available}/>} 
    {section === "ads" && <Ads businessId={businessId} overview={overview}/>} 
  </Box>;
}
