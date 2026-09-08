import { useState } from "react";
import { Alert, Paper, Stack, Tab, Tabs, Typography } from "@mui/material";
import AdminAdsModerationPanel from "../components/AdminAdsModerationPanel";
import AdminMarketingCampaignsPanel from "../components/AdminMarketingCampaignsPanel";
import AdminMarketingSummaryPanel from "../components/AdminMarketingSummaryPanel";

export default function AdminMarketingPage() {
  const [tab, setTab] = useState("ads");

  return (
    <Stack spacing={3}>
      <div>
        <Typography variant="overline" color="text.secondary">OPERACIÓN COMERCIAL</Typography>
        <Typography variant="h4" fontWeight={700}>Marketing & qsCome Ads</Typography>
        <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 920 }}>
          Supervisa campañas de Marketing Center y modera campañas publicitarias sin mezclar suscripción, billing ni serving.
        </Typography>
      </div>

      <Alert severity="info">
        qsCome Ads continúa como producto separado. Aprobar una campaña solo completa la moderación: no cobra, no consume presupuesto y no la publica automáticamente.
      </Alert>

      <AdminMarketingSummaryPanel />

      <Paper variant="outlined" sx={{ px: 1 }}>
        <Tabs
          value={tab}
          onChange={(_event, value) => setTab(value)}
          variant="scrollable"
          scrollButtons="auto"
          aria-label="Secciones de Marketing y Ads"
        >
          <Tab value="ads" label="Moderación de Ads" />
          <Tab value="marketing" label="Campañas de Marketing" />
        </Tabs>
      </Paper>

      {tab === "ads" ? <AdminAdsModerationPanel /> : <AdminMarketingCampaignsPanel />}
    </Stack>
  );
}
