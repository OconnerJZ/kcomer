// src/pages/owner/OwnerReports.jsx
import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Grid,
  Card,
  CardContent,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Stack,
  Divider,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import {
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingCart,
  People,
} from '@mui/icons-material';
import { useAuth } from '@Context/AuthContext';
import { businessAPI } from '@Services/apiService';
import GeneralContent from '@Components/layout/GeneralContent';

const OwnerReports = () => {
  const { user } = useAuth();
  const [period, setPeriod] = useState('month');
  const [reportData, setReportData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadReports();
  }, [period]);

  const loadReports = async () => {
    try {
      setLoading(true);
      const response = await businessAPI.getReports(user.businessId, period);
      if (response.data.success) {
        setReportData(response.data.data);
      }
    } catch (error) {
      console.error('Error loading reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const MetricCard = ({ title, value, change, icon: Icon, prefix = '' }) => (
    <Card>
      <CardContent>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between">
            <Box>
              <Typography color="text.secondary" variant="caption">
                {title}
              </Typography>
              <Typography variant="h5" sx={{ fontWeight: 700, mt: 0.5 }}>
                {prefix}{value}
              </Typography>
            </Box>
            <Icon sx={{ fontSize: 40, color: 'primary.main' }} />
          </Stack>
          
          <Stack direction="row" spacing={0.5} alignItems="center">
            {change >= 0 ? (
              <TrendingUp sx={{ fontSize: 16, color: 'success.main' }} />
            ) : (
              <TrendingDown sx={{ fontSize: 16, color: 'error.main' }} />
            )}
            <Typography
              variant="caption"
              sx={{ color: change >= 0 ? 'success.main' : 'error.main' }}
            >
              {Math.abs(change)}% vs período anterior
            </Typography>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );

  if (loading) {
    return <GeneralContent title="Reportes"><Box sx={{ p: 3 }}>Cargando reportes...</Box></GeneralContent>;
  }

  return (
    <GeneralContent title="Reportes y Análisis">
      <Box sx={{ p: { xs: 2, md: 3 } }}>
        <Paper sx={{ p: 3, mb: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Reportes
            </Typography>
            <FormControl sx={{ minWidth: 200 }}>
              <InputLabel>Período</InputLabel>
              <Select
                value={period}
                onChange={(e) => setPeriod(e.target.value)}
                label="Período"
              >
                <MenuItem value="week">Esta Semana</MenuItem>
                <MenuItem value="month">Este Mes</MenuItem>
                <MenuItem value="quarter">Este Trimestre</MenuItem>
                <MenuItem value="year">Este Año</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Paper>

        {/* Metrics Overview */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ventas Totales"
              value={reportData?.totalSales?.toLocaleString('es-MX') || '0'}
              change={reportData?.salesChange || 0}
              icon={AttachMoney}
              prefix="$"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Órdenes"
              value={reportData?.totalOrders || 0}
              change={reportData?.ordersChange || 0}
              icon={ShoppingCart}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Clientes"
              value={reportData?.totalCustomers || 0}
              change={reportData?.customersChange || 0}
              icon={People}
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <MetricCard
              title="Ticket Promedio"
              value={(reportData?.avgTicket || 0).toFixed(2)}
              change={reportData?.avgTicketChange || 0}
              icon={TrendingUp}
              prefix="$"
            />
          </Grid>
        </Grid>

        {/* Sales by Day/Hour Chart */}
        <Grid container spacing={2} sx={{ mb: 3 }}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ventas por Día
              </Typography>
              {/* Aquí irá una gráfica con Chart.js o Recharts */}
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                <Typography color="text.secondary">Gráfica de ventas por día</Typography>
              </Box>
            </Paper>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ventas por Hora
              </Typography>
              <Box sx={{ height: 300, display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#f5f5f5' }}>
                <Typography color="text.secondary">Gráfica de ventas por hora</Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* Top Products Table */}
        <Paper sx={{ mb: 3 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
              Productos Más Vendidos
            </Typography>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Producto</TableCell>
                    <TableCell align="right">Cantidad</TableCell>
                    <TableCell align="right">Ingresos</TableCell>
                    <TableCell align="right">% del Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {(reportData?.topProducts || []).map((product) => (
                    <TableRow key={product.id}>
                      <TableCell>{product.name}</TableCell>
                      <TableCell align="right">{product.quantity}</TableCell>
                      <TableCell align="right">${product.revenue.toLocaleString('es-MX')}</TableCell>
                      <TableCell align="right">{product.percentage}%</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Paper>

        {/* Customer Insights */}
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Clientes Frecuentes
              </Typography>
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Cliente</TableCell>
                      <TableCell align="right">Órdenes</TableCell>
                      <TableCell align="right">Total</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {(reportData?.topCustomers || []).map((customer) => (
                      <TableRow key={customer.id}>
                        <TableCell>{customer.name}</TableCell>
                        <TableCell align="right">{customer.orders}</TableCell>
                        <TableCell align="right">${customer.total.toLocaleString('es-MX')}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Paper>
          </Grid>

          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Métodos de Pago
              </Typography>
              <Stack spacing={2}>
                {(reportData?.paymentMethods || []).map((method) => (
                  <Box key={method.name}>
                    <Stack direction="row" justifyContent="space-between" sx={{ mb: 0.5 }}>
                      <Typography variant="body2">{method.name}</Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {method.percentage}%
                      </Typography>
                    </Stack>
                    <Box sx={{ width: '100%', bgcolor: '#f0f0f0', borderRadius: 1, height: 8 }}>
                      <Box
                        sx={{
                          width: `${method.percentage}%`,
                          bgcolor: 'primary.main',
                          height: 8,
                          borderRadius: 1,
                        }}
                      />
                    </Box>
                  </Box>
                ))}
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </GeneralContent>
  );
};

export default OwnerReports;