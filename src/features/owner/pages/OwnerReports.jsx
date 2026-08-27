import { useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  CircularProgress,
  FormControl,
  Grid,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  ShoppingBagRounded,
  ScheduleRounded,
  TrendingUpRounded,
} from "@mui/icons-material";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetBusinessStatsQuery } from "@Features/stats/api/stats.api";

const STATUS_COLORS = ["#ff4b45", "#f3a847", "#79808c", "#b4bac4", "#d9dde3", "#34383e"];

const money = (value) => new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
}).format(Number(value || 0));

const Metric = ({ label, value, helper, icon }) => (
  <Box sx={{ p: { xs: 1.7, sm: 2 }, borderRadius: 2.5, border: "1px solid rgba(255,255,255,.11)", bgcolor: "rgba(255,255,255,.055)", minWidth: 0 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1.5}>
      <Box minWidth={0}>
        <Typography variant="caption" sx={{ color: "rgba(255,255,255,.62)", fontWeight: 700 }}>{label}</Typography>
        <Typography sx={{ mt: .55, color: "white", fontSize: { xs: "1.35rem", sm: "1.65rem" }, lineHeight: 1.1, fontWeight: 850, letterSpacing: "-.035em" }} noWrap>
          {value}
        </Typography>
      </Box>
      <Box sx={{ width: 34, height: 34, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.08)", color: "rgba(255,255,255,.8)", flexShrink: 0 }}>{icon}</Box>
    </Stack>
    {helper && <Box sx={{ mt: 1.4 }}>{helper}</Box>}
  </Box>
);

const Panel = ({ title, subtitle, children, sx = {} }) => (
  <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider", borderRadius: 3.5, bgcolor: "rgba(255,255,255,.86)", backdropFilter: "blur(12px)", ...sx }}>
    <Box sx={{ mb: 2.25 }}>
      <Typography variant="subtitle1" fontWeight={850}>{title}</Typography>
      {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
    </Box>
    {children}
  </Paper>
);

const Empty = ({ children }) => (
  <Box sx={{ minHeight: 230, display: "grid", placeItems: "center", textAlign: "center", px: 3 }}>
    <Typography variant="body2" color="text.secondary">{children || "Todavía no hay suficientes datos."}</Typography>
  </Box>
);

const OwnerReports = ({ businessId }) => {
  const [period, setPeriod] = useState(7);
  const { data: statsResponse, isLoading, isFetching, error } = useGetBusinessStatsQuery(
    { businessId, period },
    { skip: !businessId, pollingInterval: 60000 },
  );

  if (!businessId || isLoading) {
    return <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}><CircularProgress size={30} /></Box>;
  }
  if (error) return <Alert severity="error">{error?.data?.message || error?.message || "Error al cargar estadísticas"}</Alert>;

  const stats = statsResponse?.data || statsResponse;
  if (!stats) return <Alert severity="info">Todavía no hay datos disponibles para este negocio.</Alert>;

  const { summary = {}, salesByDay = [], topProducts = [], ordersByStatus = [] } = stats;
  const growth = Number(summary.ordersGrowth || 0);
  const hasGrowth = summary.ordersGrowth !== undefined && summary.ordersGrowth !== null;
  const totalStatusOrders = ordersByStatus.reduce((sum, item) => sum + Number(item.value || 0), 0);

  return (
    <Box sx={{ pb: 2, opacity: isFetching ? .82 : 1, transition: "opacity .2s ease" }}>
      <Box
        sx={{
          position: "relative",
          overflow: "hidden",
          borderRadius: { xs: 3, sm: 4 },
          p: { xs: 2.2, sm: 3 },
          mb: 2.5,
          color: "white",
          bgcolor: "#25272b",
          backgroundImage: "radial-gradient(circle at 85% 0%, rgba(255,75,69,.28), transparent 34%), linear-gradient(135deg, #222428 0%, #303338 100%)",
          boxShadow: "0 24px 55px rgba(26,28,31,.16)",
        }}
      >
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "flex-start" }} gap={2.2} sx={{ mb: 3 }}>
          <Box>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: .7 }}>
              <TrendingUpRounded sx={{ fontSize: 19, color: "#ff6a64" }} />
              <Typography variant="overline" sx={{ color: "rgba(255,255,255,.62)", letterSpacing: ".14em", fontSize: ".63rem" }}>Rendimiento</Typography>
            </Stack>
            <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-.035em" }}>Reportes</Typography>
            <Typography variant="body2" sx={{ mt: .65, color: "rgba(255,255,255,.67)", maxWidth: 520 }}>
              Una lectura rápida del negocio: ventas, ritmo de órdenes y qué está funcionando mejor.
            </Typography>
          </Box>

          <FormControl size="small" sx={{ minWidth: { xs: "100%", sm: 168 } }}>
            <Select
              value={period}
              onChange={(event) => setPeriod(event.target.value)}
              sx={{ color: "white", borderRadius: 2.25, bgcolor: "rgba(255,255,255,.08)", ".MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,.14)" }, "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(255,255,255,.3)" }, ".MuiSvgIcon-root": { color: "rgba(255,255,255,.8)" } }}
            >
              <MenuItem value={7}>Últimos 7 días</MenuItem>
              <MenuItem value={15}>Últimos 15 días</MenuItem>
              <MenuItem value={30}>Últimos 30 días</MenuItem>
              <MenuItem value={90}>Últimos 90 días</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", lg: "repeat(4,minmax(0,1fr))" }, gap: 1.15 }}>
          <Metric label="Ingresos" value={money(summary.totalRevenue)} icon={<PaymentsRounded fontSize="small" />} />
          <Metric
            label="Órdenes"
            value={summary.totalOrders || 0}
            icon={<ShoppingBagRounded fontSize="small" />}
            helper={hasGrowth ? (
              <Stack direction="row" spacing={.35} alignItems="center">
                {growth >= 0 ? <ArrowUpwardRounded sx={{ fontSize: 14, color: "#77d17a" }} /> : <ArrowDownwardRounded sx={{ fontSize: 14, color: "#ff8a86" }} />}
                <Typography variant="caption" sx={{ color: growth >= 0 ? "#77d17a" : "#ff8a86", fontWeight: 800 }}>{Math.abs(growth)}%</Typography>
                <Typography variant="caption" sx={{ color: "rgba(255,255,255,.48)", display: { xs: "none", sm: "inline" } }}>vs anterior</Typography>
              </Stack>
            ) : null}
          />
          <Metric label="Ticket promedio" value={money(summary.averageOrder)} icon={<ReceiptLongRounded fontSize="small" />} />
          <Metric label="Pendientes" value={summary.pendingOrders || 0} icon={<ScheduleRounded fontSize="small" />} />
        </Box>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Panel title="Pulso de ventas" subtitle="Cómo se están moviendo tus ingresos dentro del periodo" sx={{ height: "100%" }}>
            {salesByDay.length === 0 ? <Empty /> : (
              <Box sx={{ width: "100%", height: { xs: 245, sm: 320 } }}>
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={salesByDay} margin={{ top: 8, right: 4, left: -22, bottom: 0 }}>
                    <defs>
                      <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#ff4b45" stopOpacity={0.24} />
                        <stop offset="95%" stopColor="#ff4b45" stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 6" vertical={false} stroke="#edf0f3" />
                    <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7d838c" }} minTickGap={24} />
                    <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: "#7d838c" }} />
                    <Tooltip contentStyle={{ borderRadius: 14, border: "1px solid #eceef2", boxShadow: "0 12px 32px rgba(0,0,0,.09)" }} formatter={(value, name) => [name === "Ingresos" ? money(value) : value, name]} />
                    <Area type="monotone" dataKey="revenue" name="Ingresos" stroke="#ff4b45" strokeWidth={2.7} fill="url(#revenueFill)" activeDot={{ r: 4 }} />
                  </AreaChart>
                </ResponsiveContainer>
              </Box>
            )}
          </Panel>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Panel title="Estado de órdenes" subtitle="Distribución del periodo" sx={{ height: "100%" }}>
            {ordersByStatus.length === 0 ? <Empty /> : (
              <Stack direction={{ xs: "row", sm: "row", lg: "column" }} alignItems="center" gap={2}>
                <Box sx={{ width: { xs: 150, sm: 190, lg: "100%" }, height: { xs: 160, sm: 190, lg: 205 }, flexShrink: 0 }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius="58%" outerRadius="82%" paddingAngle={2.5}>
                        {ordersByStatus.map((entry, index) => <Cell key={entry.name || index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />)}
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <Box sx={{ mt: { xs: -11.5, sm: -13, lg: -13 }, textAlign: "center", pointerEvents: "none" }}>
                    <Typography variant="h5" fontWeight={900}>{totalStatusOrders}</Typography>
                    <Typography variant="caption" color="text.secondary">órdenes</Typography>
                  </Box>
                </Box>
                <Stack spacing={.9} sx={{ width: "100%", minWidth: 0 }}>
                  {ordersByStatus.slice(0, 6).map((item, index) => (
                    <Stack key={item.name || index} direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Stack direction="row" alignItems="center" spacing={1} minWidth={0}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLORS[index % STATUS_COLORS.length], flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>{item.name}</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={850}>{item.value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            )}
          </Panel>
        </Grid>

        <Grid item xs={12}>
          <Panel title="Lo que más se está moviendo" subtitle="Productos líderes por unidades e ingresos">
            {topProducts.length === 0 ? <Empty>Todavía no hay ventas suficientes para destacar productos.</Empty> : (
              <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(4,minmax(0,1fr))" }, gap: 1.2 }}>
                {topProducts.slice(0, 8).map((product, index) => (
                  <Box key={product.id || product.name} sx={{ display: "grid", gridTemplateColumns: "44px minmax(0,1fr)", gap: 1.2, alignItems: "center", p: 1.25, borderRadius: 2.5, border: "1px solid", borderColor: "divider", bgcolor: "rgba(250,250,250,.65)" }}>
                    <Avatar src={product.image} variant="rounded" sx={{ width: 44, height: 44, borderRadius: 2 }}>{product.name?.charAt(0)}</Avatar>
                    <Box minWidth={0}>
                      <Stack direction="row" justifyContent="space-between" gap={1}>
                        <Typography variant="body2" fontWeight={800} noWrap>{product.name}</Typography>
                        <Typography variant="caption" color="text.disabled">#{index + 1}</Typography>
                      </Stack>
                      <Stack direction="row" justifyContent="space-between" gap={1} sx={{ mt: .4 }}>
                        <Typography variant="caption" color="text.secondary">{product.quantity || 0} vendidos</Typography>
                        <Typography variant="caption" fontWeight={850}>{money(product.revenue)}</Typography>
                      </Stack>
                    </Box>
                  </Box>
                ))}
              </Box>
            )}
          </Panel>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerReports;
