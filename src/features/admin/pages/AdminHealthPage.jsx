import { Alert, Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import { useGetAdminHealthQuery } from "../api/adminHealth.api";

const formatBytes = (value) => {
  const bytes = Number(value || 0);
  if (!bytes) return "0 B";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const index = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  return `${(bytes / (1024 ** index)).toFixed(index ? 1 : 0)} ${units[index]}`;
};

const formatUptime = (seconds) => {
  const total = Number(seconds || 0);
  const days = Math.floor(total / 86400);
  const hours = Math.floor((total % 86400) / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  return `${days}d ${hours}h ${minutes}m`;
};

const STATUS_LABEL = { healthy: "Saludable", unhealthy: "Con problema", degraded: "Degradado" };

function ComponentCard({ title, status, children }) {
  return (
    <Paper variant="outlined" sx={{ p: 2.5, minWidth: 0 }}>
      <Stack spacing={1.5}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" gap={1}>
          <Typography variant="h6" fontWeight={700}>{title}</Typography>
          <Chip
            size="small"
            variant="outlined"
            color={status === "healthy" ? "success" : "warning"}
            label={STATUS_LABEL[status] || status}
          />
        </Stack>
        {children}
      </Stack>
    </Paper>
  );
}

ComponentCard.propTypes = {};

export default function AdminHealthPage() {
  const query = useGetAdminHealthQuery(undefined, { pollingInterval: 30000 });
  const data = query.data;
  const components = data?.components;

  if (query.isLoading) {
    return <Box sx={{ py: 10, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (query.error) {
    return (
      <Alert severity="error" action={<Button onClick={() => query.refetch()}>Reintentar</Button>}>
        No fue posible consultar el estado de la plataforma.
      </Alert>
    );
  }

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">SISTEMA</Typography>
          <Typography variant="h4" fontWeight={700}>Platform Health</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75 }}>
            Diagnóstico de la aplicación, base de datos, storage montado y realtime.
          </Typography>
        </Box>
        <Button variant="outlined" startIcon={<RefreshRounded />} onClick={() => query.refetch()} disabled={query.isFetching}>
          Actualizar
        </Button>
      </Stack>

      <Alert severity={data?.status === "healthy" ? "success" : "warning"}>
        Estado general: <strong>{STATUS_LABEL[data?.status] || data?.status}</strong>. Última comprobación: {data?.checkedAt ? new Date(data.checkedAt).toLocaleString("es-MX") : "—"}.
      </Alert>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, gap: 2 }}>
        <ComponentCard title="API" status={components?.api?.status}>
          <Typography variant="body2">Uptime: <strong>{formatUptime(components?.api?.details?.uptimeSeconds)}</strong></Typography>
          <Typography variant="body2">Versión: <strong>{components?.api?.details?.version || "—"}</strong></Typography>
          <Typography variant="body2">Entorno: <strong>{components?.api?.details?.environment || "—"}</strong></Typography>
          <Typography variant="body2">Node: <strong>{components?.api?.details?.nodeVersion || "—"}</strong></Typography>
          <Typography variant="body2">RSS: <strong>{formatBytes(components?.api?.details?.memory?.rssBytes)}</strong></Typography>
          <Typography variant="body2">Heap: <strong>{formatBytes(components?.api?.details?.memory?.heapUsedBytes)} / {formatBytes(components?.api?.details?.memory?.heapTotalBytes)}</strong></Typography>
        </ComponentCard>

        <ComponentCard title="Base de datos" status={components?.database?.status}>
          <Typography variant="body2">Inicializada: <strong>{components?.database?.details?.initialized ? "Sí" : "No"}</strong></Typography>
          <Typography variant="body2">Latencia SELECT 1: <strong>{components?.database?.details?.latencyMs == null ? "—" : `${components.database.details.latencyMs} ms`}</strong></Typography>
        </ComponentCard>

        <ComponentCard title="Storage" status={components?.storage?.status}>
          <Typography variant="body2">Uploads públicos: <strong>{STATUS_LABEL[components?.storage?.details?.publicUploads] || "—"}</strong></Typography>
          <Typography variant="body2">Evidencias privadas: <strong>{STATUS_LABEL[components?.storage?.details?.privateEvidence] || "—"}</strong></Typography>
          <Typography variant="body2">Uso del filesystem: <strong>{components?.storage?.details?.disk?.usedPercent == null ? "—" : `${components.storage.details.disk.usedPercent}%`}</strong></Typography>
          <Typography variant="body2">Disponible: <strong>{formatBytes(components?.storage?.details?.disk?.availableBytes)}</strong></Typography>
        </ComponentCard>

        <ComponentCard title="Realtime" status={components?.realtime?.status}>
          <Typography variant="body2">Socket.IO inicializado: <strong>{components?.realtime?.details?.initialized ? "Sí" : "No"}</strong></Typography>
          <Typography variant="body2">Clientes conectados: <strong>{components?.realtime?.details?.connectedClients ?? 0}</strong></Typography>
          <Typography variant="body2">Rooms usuario: <strong>{components?.realtime?.details?.rooms?.users ?? 0}</strong></Typography>
          <Typography variant="body2">Rooms negocio: <strong>{components?.realtime?.details?.rooms?.businesses ?? 0}</strong></Typography>
          <Typography variant="body2">Rooms Shared Orders: <strong>{components?.realtime?.details?.rooms?.sharedOrders ?? 0}</strong></Typography>
        </ComponentCard>
      </Box>

      <Alert severity="info">
        {data?.scope?.note || "Este panel diagnostica la aplicación. Jenkins, Docker, reverse proxy y host requieren monitoreo de infraestructura separado."}
      </Alert>
    </Stack>
  );
}
