import { useState, useEffect } from 'react';
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
import axios from 'axios';
import { API_URL_SERVER } from '@Utils/enviroments';
import { useAuth } from '@Context/AuthContext';
import { handleApiError } from '@Services/apiService';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

const OwnerReports = ({ stats: initialStats, businessId }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState(initialStats);
  const [loading, setLoading] = useState(!initialStats);
  const [error, setError] = useState(null);
  const [period, setPeriod] = useState(7);

  useEffect(() => {
    if (!initialStats) {
      loadStats();
    }
  }, [businessId, period]);

  const loadStats = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await axios.get(
        `${API_URL_SERVER}/api/stats/business/${businessId}`,
        {
          params: { period },
          headers: {
            Authorization: `Bearer ${user.token}`
          }
        }
      );

      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (err) {
      console.error('Error loading stats:', err);
      const errorData = handleApiError(err);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!stats) {
    return <Alert severity="info">No hay datos disponibles</Alert>;
  }

  const { summary, salesByDay, topProducts, ordersByStatus } = stats;

  return (
    <Box>
      {/* Selector de Período */}
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
          </Select>
        </FormControl>
      </Stack>

      {/* Tarjetas de Resumen */}
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
                <Typography variant="h4">{summary.totalOrders}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUp fontSize="small" color="success" />
                  <Typography variant="caption" color="success.main">
                    +12% vs período anterior
                  </Typography>
                </Stack>
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
                    Ingresos Totales
                  </Typography>
                  <AttachMoney color="success" />
                </Stack>
                <Typography variant="h4">${summary.totalRevenue.toFixed(2)}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingUp fontSize="small" color="success" />
                  <Typography variant="caption" color="success.main">
                    +8% vs período anterior
                  </Typography>
                </Stack>
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
                  <Assessment color="info" />
                </Stack>
                <Typography variant="h4">${summary.avgOrderValue.toFixed(2)}</Typography>
                <Stack direction="row" spacing={0.5} alignItems="center">
                  <TrendingDown fontSize="small" color="error" />
                  <Typography variant="caption" color="error.main">
                    -3% vs período anterior
                  </Typography>
                </Stack>
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
                <Typography variant="h4">{summary.pendingOrders}</Typography>
                <Typography variant="caption" color="text.secondary">
                  Requieren atención
                </Typography>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Gráficas */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Gráfica de Ventas por Día */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Ventas del Período
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesByDay}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="day" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="ventas" 
                  stroke="#8884d8" 
                  strokeWidth={2} 
                  name="Ventas ($)" 
                />
                <Line 
                  type="monotone" 
                  dataKey="ordenes" 
                  stroke="#82ca9d" 
                  strokeWidth={2} 
                  name="Órdenes" 
                />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Gráfica de Estado de Órdenes */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Estado de Órdenes
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={ordersByStatus}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={(entry) => entry.name}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {ordersByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Productos Más Vendidos */}
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
                    <TableCell align="right">Vendidos</TableCell>
                    <TableCell align="right">Precio</TableCell>
                    <TableCell align="right">Ingresos</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {topProducts.map((item) => (
                    <TableRow key={item.id}>
                      <TableCell>
                        <Stack direction="row" spacing={2} alignItems="center">
                          <Avatar src={item.image} variant="rounded" />
                          <Box>
                            <Typography variant="body2">{item.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {item.category}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>
                      <TableCell align="right">{item.sold}</TableCell>
                      <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                      <TableCell align="right">
                        <Typography color="success.main" fontWeight={600}>
                          ${(item.sold * item.price).toFixed(2)}
                        </Typography>
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