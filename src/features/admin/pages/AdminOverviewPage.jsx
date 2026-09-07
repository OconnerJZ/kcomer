import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { RefreshRounded } from "@mui/icons-material";
import AdminBreakdownPanel from "../components/dashboard/AdminBreakdownPanel";
import AdminMetricCard from "../components/dashboard/AdminMetricCard";
import AdminTrendChart from "../components/dashboard/AdminTrendChart";
import { useGetAdminDashboardQuery } from "../api/admin.api";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible cargar el dashboard global";
const count = (value) => Number(value || 0).toLocaleString("es-MX");
const money = (value) => Number(value || 0).toLocaleString("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
});
const percent = (value) => `${Number(value || 0).toLocaleString("es-MX", { maximumFractionDigits: 1 })}%`;

const PAYMENT_LABELS = {
  cash: "Efectivo",
  card: "Tarjeta",
  wallet: "Wallet",
  transfer: "Transferencia",
};

const PLAN_LABELS = {
  free: "Gratis",
  level_1: "Nivel 1",
  level_2: "Nivel 2",
  level_3: "Nivel 3",
};

export default function AdminOverviewPage() {
  const query = useGetAdminDashboardQuery();
  const dashboard = dataOf(query.data);
  const loading = query.isLoading && !dashboard;

  const paymentRows = (dashboard?.paymentMethods || []).map((entry) => ({
    key: entry.method,
    label: PAYMENT_LABELS[entry.method] || entry.method,
    value: count(entry.orders),
    amount: Number(entry.orders || 0),
    secondary: `${money(entry.volume)} en ventas completadas`,
  }));

  const planRows = (dashboard?.plans || []).map((entry) => ({
    key: entry.planCode,
    label: PLAN_LABELS[entry.planCode] || entry.planCode,
    value: count(entry.businesses),
    amount: Number(entry.businesses || 0),
    secondary: "negocios con plan efectivo",
  }));

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} alignItems={{ sm: "flex-end" }}>
        <Box>
          <Typography variant="overline" color="text.secondary">ADMINISTRACIÓN DE PLATAFORMA</Typography>
          <Typography variant="h4" fontWeight={700}>Dashboard global</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 780 }}>
            Pulso operativo de qsCome con métricas agregadas de usuarios, negocios, órdenes y actividad comercial.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={query.isFetching ? <CircularProgress size={16} /> : <RefreshRounded />}
          disabled={query.isFetching}
          onClick={() => query.refetch()}
        >
          Actualizar
        </Button>
      </Stack>

      {query.error && (
        <Alert severity="error" action={<Button color="inherit" size="small" onClick={() => query.refetch()}>Reintentar</Button>}>
          {errorMessage(query.error)}
        </Alert>
      )}

      <Alert severity="info">
        Las métricas comerciales usan los últimos 30 días. Volumen y ticket promedio consideran únicamente órdenes completadas.
      </Alert>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, minmax(0, 1fr))",
            lg: "repeat(4, minmax(0, 1fr))",
          },
          gap: 2,
        }}
      >
        <AdminMetricCard
          label="USUARIOS"
          value={count(dashboard?.users?.total)}
          detail={`+${count(dashboard?.users?.new7d)} en 7 días · +${count(dashboard?.users?.new30d)} en 30 días`}
          loading={loading}
        />
        <AdminMetricCard
          label="NEGOCIOS"
          value={count(dashboard?.businesses?.total)}
          detail={`${count(dashboard?.businesses?.open)} abiertos · ${count(dashboard?.businesses?.verified)} verificados`}
          loading={loading}
        />
        <AdminMetricCard
          label="ÓRDENES HOY"
          value={count(dashboard?.orders?.today)}
          detail={`${count(dashboard?.orders?.last7d)} en 7 días · ${count(dashboard?.orders?.last30d)} en 30 días`}
          loading={loading}
        />
        <AdminMetricCard
          label="VENTAS · 30 DÍAS"
          value={money(dashboard?.revenue?.completedVolume30d)}
          detail={`Ticket promedio ${money(dashboard?.revenue?.averageTicket30d)}`}
          loading={loading}
        />
        <AdminMetricCard
          label="ÓRDENES COMPLETADAS"
          value={count(dashboard?.orders?.completed30d)}
          detail="Últimos 30 días"
          loading={loading}
        />
        <AdminMetricCard
          label="CANCELACIÓN"
          value={percent(dashboard?.orders?.cancellationRate30d)}
          detail={`${count(dashboard?.orders?.cancelled30d)} órdenes canceladas en 30 días`}
          loading={loading}
        />
        <AdminMetricCard
          label="ÓRDENES COMPARTIDAS"
          value={percent(dashboard?.sharedOrders?.shareRate30d)}
          detail={`${count(dashboard?.sharedOrders?.last30d)} órdenes compartidas en 30 días`}
          loading={loading}
        />
        <AdminMetricCard
          label="TRANSFERENCIAS POR ATENDER"
          value={count((dashboard?.transfers?.pendingReview || 0) + (dashboard?.transfers?.requiresClarification || 0))}
          detail={`${count(dashboard?.transfers?.requiresClarification)} requieren aclaración`}
          loading={loading}
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", xl: "minmax(0, 2fr) minmax(300px, 1fr)" }, gap: 2 }}>
        <AdminTrendChart rows={dashboard?.trend || []} loading={loading} />
        <AdminBreakdownPanel
          title="Métodos de pago"
          subtitle="Órdenes completadas en los últimos 30 días."
          rows={paymentRows}
          loading={loading}
          emptyMessage="Aún no hay ventas completadas en este periodo."
        />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0, 1fr) minmax(0, 1fr)" }, gap: 2 }}>
        <AdminBreakdownPanel
          title="Negocios por plan"
          subtitle="Distribución por plan efectivo, incluyendo trials activos."
          rows={planRows}
          loading={loading}
          emptyMessage="Aún no hay negocios registrados."
        />
        <Box sx={{ px: { xs: 0, lg: 1 }, py: 1, alignSelf: "center" }}>
          <Typography variant="overline" color="text.secondary">LECTURA OPERATIVA</Typography>
          <Typography variant="h6" fontWeight={700} sx={{ mt: 0.5 }}>Qué representa este tablero</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            El dashboard resume estado real de plataforma sin reemplazar los módulos de auditoría. Las acciones administrativas permanecen en sus módulos especializados para conservar trazabilidad y responsabilidad única.
          </Typography>
          {dashboard?.generatedAt && (
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 2 }}>
              Datos generados: {new Date(dashboard.generatedAt).toLocaleString("es-MX")}
            </Typography>
          )}
        </Box>
      </Box>
    </Stack>
  );
}
