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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ArrowDownwardRounded,
  ArrowUpwardRounded,
  HourglassBottomRounded,
  PaymentsRounded,
  ReceiptLongRounded,
  ShoppingBagRounded,
} from "@mui/icons-material";
import {
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useGetBusinessStatsQuery } from "@Features/stats/api/stats.api";

const STATUS_COLORS = ["#ff4b45", "#f1b44c", "#8f95a3", "#c7cbd3", "#e6e8ec", "#2f3135"];

const money = (value) =>
  new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    maximumFractionDigits: 2,
  }).format(Number(value || 0));

const Metric = ({ label, value, helper, icon, emphasized = false }) => (
  <Box
    sx={{
      p: { xs: 2, sm: 2.5 },
      minHeight: 138,
      borderRadius: 3,
      border: "1px solid",
      borderColor: emphasized ? "rgba(255,75,69,.22)" : "divider",
      bgcolor: emphasized ? "rgba(255,75,69,.035)" : "background.paper",
    }}
  >
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={2}>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, letterSpacing: ".04em" }}>
          {label}
        </Typography>
        <Typography
          sx={{
            mt: 1,
            fontSize: { xs: "1.7rem", sm: "2rem" },
            lineHeight: 1,
            fontWeight: 800,
            letterSpacing: "-.035em",
          }}
        >
          {value}
        </Typography>
      </Box>
      <Box
        sx={{
          width: 38,
          height: 38,
          borderRadius: 2,
          display: "grid",
          placeItems: "center",
          color: emphasized ? "primary.main" : "text.secondary",
          bgcolor: emphasized ? "rgba(255,75,69,.08)" : "action.hover",
        }}
      >
        {icon}
      </Box>
    </Stack>
    {helper && (
      <Box sx={{ mt: 2 }}>
        {helper}
      </Box>
    )}
  </Box>
);

const EmptyChart = ({ children = "Todavía no hay suficientes datos para mostrar esta gráfica." }) => (
  <Box sx={{ minHeight: 280, display: "grid", placeItems: "center", textAlign: "center", px: 3 }}>
    <Typography variant="body2" color="text.secondary">{children}</Typography>
  </Box>
);

const OwnerReports = ({ businessId }) => {
  const [period, setPeriod] = useState(7);

  const {
    data: statsResponse,
    isLoading,
    isFetching,
    error: queryError,
  } = useGetBusinessStatsQuery(
    { businessId, period },
    { skip: !businessId, pollingInterval: 60000 },
  );

  const loading = isLoading || isFetching;
  const stats = statsResponse?.data || statsResponse;

  if (!businessId || loading) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: 320 }}>
        <CircularProgress size={30} />
      </Box>
    );
  }

  if (queryError) {
    return (
      <Alert severity="error">
        {queryError?.data?.message || queryError?.message || "Error al cargar estadísticas"}
      </Alert>
    );
  }

  if (!stats) {
    return <Alert severity="info">Todavía no hay datos disponibles para este negocio.</Alert>;
  }

  const { summary = {}, salesByDay = [], topProducts = [], ordersByStatus = [] } = stats;
  const growth = Number(summary.ordersGrowth || 0);
  const hasGrowth = summary.ordersGrowth !== undefined && summary.ordersGrowth !== null;

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ xs: "flex-start", sm: "center" }}
        gap={2}
        sx={{ mb: 3.5 }}
      >
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontSize: ".65rem" }}>
            Rendimiento
          </Typography>
          <Typography variant="h5" fontWeight={800} sx={{ letterSpacing: "-.02em" }}>
            Reportes
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Lo esencial para entender cómo está funcionando tu negocio.
          </Typography>
        </Box>

        <FormControl size="small" sx={{ minWidth: 170 }}>
          <Select value={period} onChange={(event) => setPeriod(event.target.value)} sx={{ borderRadius: 2 }}>
            <MenuItem value={7}>Últimos 7 días</MenuItem>
            <MenuItem value={15}>Últimos 15 días</MenuItem>
            <MenuItem value={30}>Últimos 30 días</MenuItem>
            <MenuItem value={90}>Últimos 90 días</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={1.5} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} lg={3}>
          <Metric
            label="Ingresos"
            value={money(summary.totalRevenue)}
            emphasized
            icon={<PaymentsRounded fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Metric
            label="Órdenes"
            value={summary.totalOrders || 0}
            icon={<ShoppingBagRounded fontSize="small" />}
            helper={hasGrowth ? (
              <Stack direction="row" spacing={0.5} alignItems="center">
                {growth >= 0 ? <ArrowUpwardRounded sx={{ fontSize: 15, color: "success.main" }} /> : <ArrowDownwardRounded sx={{ fontSize: 15, color: "error.main" }} />}
                <Typography variant="caption" color={growth >= 0 ? "success.main" : "error.main"} fontWeight={700}>
                  {Math.abs(growth)}%
                </Typography>
                <Typography variant="caption" color="text.secondary">vs. periodo anterior</Typography>
              </Stack>
            ) : null}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Metric
            label="Ticket promedio"
            value={money(summary.averageOrder)}
            icon={<ReceiptLongRounded fontSize="small" />}
          />
        </Grid>
        <Grid item xs={12} sm={6} lg={3}>
          <Metric
            label="Pendientes"
            value={summary.pendingOrders || 0}
            icon={<HourglassBottomRounded fontSize="small" />}
          />
        </Grid>
      </Grid>

      <Grid container spacing={2}>
        <Grid item xs={12} lg={8}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
            <Stack direction="row" justifyContent="space-between" alignItems="baseline" sx={{ mb: 2 }}>
              <Box>
                <Typography variant="subtitle1" fontWeight={800}>Tendencia de ventas</Typography>
                <Typography variant="caption" color="text.secondary">Ingresos y órdenes durante el periodo</Typography>
              </Box>
            </Stack>

            {salesByDay.length === 0 ? (
              <EmptyChart />
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDay} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 5" vertical={false} stroke="#eceef2" />
                  <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7a7f89" }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "#7a7f89" }} />
                  <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eceef2", boxShadow: "0 10px 30px rgba(0,0,0,.08)" }} />
                  <Line type="monotone" dataKey="revenue" name="Ingresos" stroke="#ff4b45" strokeWidth={2.5} dot={false} activeDot={{ r: 4 }} />
                  <Line type="monotone" dataKey="orders" name="Órdenes" stroke="#9aa0aa" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper elevation={0} sx={{ p: { xs: 2, sm: 2.5 }, border: "1px solid", borderColor: "divider", borderRadius: 3, height: "100%" }}>
            <Typography variant="subtitle1" fontWeight={800}>Estado de las órdenes</Typography>
            <Typography variant="caption" color="text.secondary">Distribución del periodo seleccionado</Typography>

            {ordersByStatus.length === 0 ? (
              <EmptyChart />
            ) : (
              <>
                <ResponsiveContainer width="100%" height={220}>
                  <PieChart>
                    <Pie data={ordersByStatus} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={58} outerRadius={82} paddingAngle={2}>
                      {ordersByStatus.map((entry, index) => (
                        <Cell key={entry.name || index} fill={STATUS_COLORS[index % STATUS_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 12, border: "1px solid #eceef2" }} />
                  </PieChart>
                </ResponsiveContainer>

                <Stack spacing={1}>
                  {ordersByStatus.slice(0, 5).map((item, index) => (
                    <Stack key={item.name || index} direction="row" alignItems="center" justifyContent="space-between" gap={1}>
                      <Stack direction="row" alignItems="center" spacing={1} minWidth={0}>
                        <Box sx={{ width: 8, height: 8, borderRadius: "50%", bgcolor: STATUS_COLORS[index % STATUS_COLORS.length], flexShrink: 0 }} />
                        <Typography variant="body2" color="text.secondary" noWrap>{item.name}</Typography>
                      </Stack>
                      <Typography variant="body2" fontWeight={800}>{item.value}</Typography>
                    </Stack>
                  ))}
                </Stack>
              </>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, overflow: "hidden" }}>
            <Box sx={{ px: { xs: 2, sm: 2.5 }, pt: 2.5, pb: 1.5 }}>
              <Typography variant="subtitle1" fontWeight={800}>Productos que más venden</Typography>
              <Typography variant="caption" color="text.secondary">Los platillos con mayor movimiento en el periodo</Typography>
            </Box>

            {topProducts.length === 0 ? (
              <Box sx={{ py: 6, textAlign: "center" }}>
                <Typography variant="body2" color="text.secondary">Todavía no hay ventas suficientes para mostrar productos destacados.</Typography>
              </Box>
            ) : (
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell sx={{ color: "text.secondary", fontSize: ".75rem", fontWeight: 700 }}>Producto</TableCell>
                      <TableCell align="right" sx={{ color: "text.secondary", fontSize: ".75rem", fontWeight: 700 }}>Vendidos</TableCell>
                      <TableCell align="right" sx={{ color: "text.secondary", fontSize: ".75rem", fontWeight: 700 }}>Ingresos</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {topProducts.slice(0, 8).map((product, index) => (
                      <TableRow key={product.id || product.name} hover>
                        <TableCell>
                          <Stack direction="row" spacing={1.25} alignItems="center">
                            <Typography variant="caption" color="text.secondary" sx={{ width: 18, textAlign: "center" }}>{index + 1}</Typography>
                            <Avatar src={product.image} variant="rounded" sx={{ width: 38, height: 38, borderRadius: 1.5 }}>
                              {product.name?.charAt(0)}
                            </Avatar>
                            <Typography variant="body2" fontWeight={700}>{product.name}</Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={700}>{product.quantity || 0}</Typography></TableCell>
                        <TableCell align="right"><Typography variant="body2" fontWeight={800}>{money(product.revenue)}</Typography></TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerReports;
