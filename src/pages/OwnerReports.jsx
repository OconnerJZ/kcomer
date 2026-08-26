import { useState } from 'react';
import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Stack,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  CircularProgress,
  Alert,
  FormControl,
  Select,
  MenuItem
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  ShoppingBag,
  AttachMoney,
  Assessment,
  HourglassEmpty
} from '@mui/icons-material';
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';

import { useGetBusinessStatsQuery } from '@Features/stats/api/stats.api';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const OwnerReports = ({ businessId }) => {
  const [period, setPeriod] = useState(7);

  const { 
    data: statsResponse, 
    isLoading: loading,
    error: queryError,
    refetch,
  } = useGetBusinessStatsQuery(
    { businessId, period },
    { 
      skip: !businessId,
      pollingInterval: 60000,
    }
  );

  const stats = statsResponse?.data || statsResponse;

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
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
    return <Alert severity="info">No hay datos disponibles</Alert>;
  }

  const { summary, salesByDay, topProducts, ordersByStatus } = stats;

  return (
    <Box>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
        <Typography variant="h6">Reportes y Estadísticas</Typography>
        <FormControl size="small">
          <Select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
          >
            <MenuItem value={7}>Últimos 7 días</MenuItem>
            <MenuItem value={15}>Últimos 15 días</MenuItem>
            <MenuItem value={30}>Últimos 30 días</MenuItem>
            <MenuItem value={90}>Últimos 90 días</MenuItem>
          </Select>
        </FormControl>
      </Stack>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="body2">
                    Órdenes Totales
                  </Typography>
                  <ShoppingBag color="primary" />
                </Stack>
                <Typography variant="h4" fontWeight={700}>
                  {summary.totalOrders || 0}
                </Typography>
                {summary.ordersGrowth !== undefined && (
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    {summary.ordersGrowth >= 0 ? (
                      <TrendingUp color="success" fontSize="small" />
                    ) : (
                      <TrendingDown color="error" fontSize="small" />
                    )}
                    <Typography
                      variant="caption"
                      color={summary.ordersGrowth >= 0 ? 'success.main' : 'error.main'}
                    >
                      {Math.abs(summary.ordersGrowth)}%
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="body2">
                    Ingresos
                  </Typography>
                  <AttachMoney color="success" />
                </Stack>
                <Typography variant="h4" fontWeight={700}>
                  ${(summary.totalRevenue || 0).toFixed(2)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="body2">
                    Ticket Promedio
                  </Typography>
                  <Assessment color="warning" />
                </Stack>
                <Typography variant="h4" fontWeight={700}>
                  ${(summary.averageOrder || 0).toFixed(2)}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <CardContent>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography color="text.secondary" variant="body2">
                    Pendientes
                  </Typography>
                  <HourglassEmpty color="warning" />
                </Stack>
                <Typography variant="h4" fontWeight={700}>
                  {summary.pendingOrders || 0}
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ventas por Día
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDay || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="revenue" name="Ingresos" stroke="#8884d8" />
                <Line type="monotone" dataKey="orders" name="Órdenes" stroke="#82ca9d" />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Órdenes por Estado
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus || []}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {(ordersByStatus || []).map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Productos Más Vendidos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Ingresos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(topProducts || []).map((product) => (
                    <TableRow key={product.id || product.name}>
                      <TableCell>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Avatar src={product.image} sx={{ width: 32, height: 32 }} />
                          <Typography>{product.name}</Typography>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">
                        ${(product.revenue || 0).toFixed(2)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};

export default OwnerReports;
