import { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Stack,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  Select,
  MenuItem,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar
} from '@mui/material';
import {
  Visibility,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Restaurant,
  LocalShipping,
  Refresh
} from '@mui/icons-material';
import { orderAPI, handleApiError } from '@Services/apiService';

const ORDER_STATUS = {
  pending: { label: 'Pendiente', color: 'warning', icon: HourglassEmpty },
  accepted: { label: 'Aceptada', color: 'info', icon: CheckCircle },
  preparing: { label: 'Preparando', color: 'primary', icon: Restaurant },
  ready: { label: 'Lista', color: 'success', icon: CheckCircle },
  in_delivery: { label: 'En camino', color: 'success', icon: LocalShipping },
  completed: { label: 'Completada', color: 'default', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'error', icon: Cancel },
};

const OwnerOrders = ({ businessId, orders: initialOrders, onRefresh }) => {
    const [orders, setOrders] = useState(initialOrders || []);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState('all');
  const [orderDialog, setOrderDialog] = useState({ open: false, order: null });
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  // Auto-refresh cada 30 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      loadOrders(true); // silent refresh
    }, 30000);

    return () => clearInterval(interval);
  }, [businessId]);

  const loadOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      
      const response = await orderAPI.getByBusiness(businessId);
      
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error('Error loading orders:', error);
      if (!silent) {
        const errorData = handleApiError(error);
        setSnackbar({ 
          open: true, 
          message: errorData.message, 
          severity: 'error' 
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      
      const response = await orderAPI.updateStatus(orderId, newStatus);
      
      if (response.data.success) {
        // Actualizar localmente
        setOrders(prev => prev.map(o => 
          o.id === orderId ? { ...o, status: newStatus } : o
        ));
        
        setSnackbar({ 
          open: true, 
          message: `Orden actualizada a ${ORDER_STATUS[newStatus].label}`, 
          severity: 'success' 
        });
        
        setOrderDialog({ open: false, order: null });
        
        // Notificar al padre para refrescar estadísticas
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error('Error updating order:', error);
      const errorData = handleApiError(error);
      setSnackbar({ 
        open: true, 
        message: errorData.message, 
        severity: 'error' 
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = filterStatus === 'all' 
    ? orders 
    : orders.filter(o => o.status === filterStatus);

  const getNextStatus = (currentStatus) => {
    const flow = {
      'pending': 'accepted',
      'accepted': 'preparing',
      'preparing': 'ready',
      'ready': 'in_delivery',
      'in_delivery': 'completed'
    };
    return flow[currentStatus];
  };

  const getActionButton = (order) => {
    const nextStatus = getNextStatus(order.status);
    
    if (!nextStatus) return null;

    const labels = {
      'accepted': 'Aceptar',
      'preparing': 'Iniciar preparación',
      'ready': 'Marcar como lista',
      'in_delivery': 'En camino',
      'completed': 'Completar'
    };

    return (
      <Button
        size="small"
        variant="contained"
        color={order.status === 'pending' ? 'primary' : 'success'}
        onClick={() => updateOrderStatus(order.id, nextStatus)}
      >
        {labels[nextStatus]}
      </Button>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros y Refresh */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <Stack direction="row" spacing={2} alignItems="center" justifyContent="space-between" flexWrap="wrap">
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography variant="subtitle2">Filtrar por:</Typography>
            <FormControl size="small" sx={{ minWidth: 200 }}>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <MenuItem value="all">Todas las órdenes</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="preparing">En preparación</MenuItem>
                <MenuItem value="ready">Listas</MenuItem>
                <MenuItem value="completed">Completadas</MenuItem>
              </Select>
            </FormControl>
            <Chip 
              label={`${filteredOrders.length} órdenes`} 
              color="primary" 
              size="small"
            />
          </Stack>
          
          <IconButton onClick={() => loadOrders()} disabled={loading}>
            <Refresh />
          </IconButton>
        </Stack>
      </Paper>

      {/* Lista de Órdenes */}
      {filteredOrders.length === 0 ? (
        <Paper sx={{ p: 5, textAlign: 'center' }}>
          <Typography color="text.secondary">
            No hay órdenes {filterStatus !== 'all' ? `en estado "${ORDER_STATUS[filterStatus]?.label}"` : ''}
          </Typography>
        </Paper>
      ) : (
        <Stack spacing={2}>
          {filteredOrders.map(order => {
            const StatusIcon = ORDER_STATUS[order.status].icon;
            return (
              <Card key={order.id} elevation={2}>
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6">#{order.id}</Typography>
                          <Chip
                            icon={<StatusIcon />}
                            label={ORDER_STATUS[order.status].label}
                            color={ORDER_STATUS[order.status].color}
                            size="small"
                          />
                        </Stack>
                        <Typography variant="body2" color="text.secondary">
                          {order.customerName} • {new Date(order.createdAt).toLocaleString('es-MX')}
                        </Typography>
                      </Stack>
                      <Typography variant="h6" color="success.main">
                        ${order.total.toFixed(2)}
                      </Typography>
                    </Stack>

                    <Divider />

                    {/* Items */}
                    <Box>
                      {order.items.slice(0, 2).map((item, idx) => (
                        <Typography key={idx} variant="body2">
                          {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      ))}
                      {order.items.length > 2 && (
                        <Typography variant="caption" color="text.secondary">
                          +{order.items.length - 2} productos más
                        </Typography>
                      )}
                    </Box>

                    {/* Acciones */}
                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => setOrderDialog({ open: true, order })}
                      >
                        Ver detalles
                      </Button>
                      {getActionButton(order)}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>
      )}

      {/* Dialog de Detalles */}
      <Dialog 
        open={orderDialog.open} 
        onClose={() => setOrderDialog({ open: false, order: null })}
        maxWidth="sm"
        fullWidth
      >
        {orderDialog.order && (
          <>
            <DialogTitle>Orden #{orderDialog.order.id}</DialogTitle>
            <DialogContent>
              <Stack spacing={2} sx={{ mt: 1 }}>
                <Box>
                  <Typography variant="subtitle2">Cliente:</Typography>
                  <Typography>{orderDialog.order.customerName}</Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Teléfono:</Typography>
                  <Typography>
                    <a href={`tel:${orderDialog.order.customerPhone}`}>
                      {orderDialog.order.customerPhone}
                    </a>
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="subtitle2">Dirección:</Typography>
                  <Typography>{orderDialog.order.deliveryAddress}</Typography>
                </Box>
                {orderDialog.order.notes && (
                  <Box>
                    <Typography variant="subtitle2">Notas:</Typography>
                    <Typography color="text.secondary">{orderDialog.order.notes}</Typography>
                  </Box>
                )}
                <Divider />
                <Box>
                  <Typography variant="subtitle2" gutterBottom>Items:</Typography>
                  {orderDialog.order.items.map((item, idx) => (
                    <Stack key={idx} direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                      <Box>
                        <Typography>{item.quantity}x {item.name}</Typography>
                        {item.note && (
                          <Typography variant="caption" color="primary" sx={{ fontStyle: 'italic' }}>
                            📝 {item.note}
                          </Typography>
                        )}
                      </Box>
                      <Typography>${(item.price * item.quantity).toFixed(2)}</Typography>
                    </Stack>
                  ))}
                </Box>
                <Divider />
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography variant="h6" color="success.main">
                    ${orderDialog.order.total.toFixed(2)}
                  </Typography>
                </Stack>
              </Stack>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setOrderDialog({ open: false, order: null })}>
                Cerrar
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
      >
        <Alert severity={snackbar.severity} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}
 
export default OwnerOrders;