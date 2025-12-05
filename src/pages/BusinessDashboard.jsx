// src/pages/BusinessDashboard.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  List,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Divider,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from '@mui/material';
import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Restaurant,
  LocalShipping,
} from '@mui/icons-material';
import GeneralContent from '@Components/layout/GeneralContent';
import { useOrders, ORDER_STATUS, STATUS_LABELS } from '@Context/OrderContext';
import { useAuth } from '@Context/AuthContext';

const BusinessDashboard = () => {
  const { user } = useAuth();
  const { orders, getOrdersByBusiness, updateOrderStatus } = useOrders();
  const [activeTab, setActiveTab] = useState(0);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  // Filtrar órdenes del negocio actual
  const businessOrders = getOrdersByBusiness(user?.businessId || 'business-1');

  const statusFilters = [
    { label: 'Todas', value: 'all' },
    { label: 'Pendientes', value: ORDER_STATUS.PENDING },
    { label: 'En Proceso', value: ORDER_STATUS.PREPARING },
    { label: 'Listas', value: ORDER_STATUS.READY },
    { label: 'Completadas', value: ORDER_STATUS.COMPLETED },
  ];

  const filteredOrders = businessOrders.filter((order) => {
    if (activeTab === 0) return true;
    return order.status === statusFilters[activeTab].value;
  });

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: 'warning',
      [ORDER_STATUS.ACCEPTED]: 'info',
      [ORDER_STATUS.PREPARING]: 'primary',
      [ORDER_STATUS.READY]: 'success',
      [ORDER_STATUS.COMPLETED]: 'default',
      [ORDER_STATUS.CANCELLED]: 'error',
    };
    return colors[status] || 'default';
  };

  const getStatusIcon = (status) => {
    const icons = {
      [ORDER_STATUS.PENDING]: <HourglassEmpty />,
      [ORDER_STATUS.ACCEPTED]: <CheckCircle />,
      [ORDER_STATUS.PREPARING]: <Restaurant />,
      [ORDER_STATUS.READY]: <CheckCircle />,
      [ORDER_STATUS.IN_DELIVERY]: <LocalShipping />,
      [ORDER_STATUS.COMPLETED]: <CheckCircle />,
      [ORDER_STATUS.CANCELLED]: <Cancel />,
    };
    return icons[status];
  };

  const handleOpenDialog = (order) => {
    setSelectedOrder(order);
    setNewStatus(order.status);
    setDialogOpen(true);
  };

  const handleUpdateStatus = () => {
    if (selectedOrder && newStatus) {
      updateOrderStatus(selectedOrder.id, newStatus);
      setDialogOpen(false);
      setSelectedOrder(null);
    }
  };

  const getNextStatus = (currentStatus) => {
    const flow = {
      [ORDER_STATUS.PENDING]: ORDER_STATUS.ACCEPTED,
      [ORDER_STATUS.ACCEPTED]: ORDER_STATUS.PREPARING,
      [ORDER_STATUS.PREPARING]: ORDER_STATUS.READY,
      [ORDER_STATUS.READY]: ORDER_STATUS.IN_DELIVERY,
      [ORDER_STATUS.IN_DELIVERY]: ORDER_STATUS.COMPLETED,
    };
    return flow[currentStatus];
  };

  return (
    <GeneralContent title="Panel de Órdenes">
      <Box sx={{ maxWidth: 1200, mx: 'auto', mt: { xs: 2, sm: 4 }, px: 2 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Panel de Órdenes
          </Typography>
          <Typography color="text.secondary">
            Gestiona las órdenes de tu negocio
          </Typography>
        </Paper>

        {/* Tabs */}
        <Paper sx={{ mb: 3, borderRadius: 2 }}>
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            variant="scrollable"
            scrollButtons="auto"
          >
            {statusFilters.map((filter) => (
              <Tab key={filter.value} label={filter.label} />
            ))}
          </Tabs>
        </Paper>

        {/* Lista de órdenes */}
        {filteredOrders.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 2 }}>
            <Typography color="text.secondary">
              No hay órdenes en esta categoría
            </Typography>
          </Paper>
        ) : (
          <List sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {filteredOrders.map((order) => (
              <Card key={order.id} sx={{ borderRadius: 2 }} elevation={2}>
                <CardContent>
                  <Stack spacing={2}>
                    {/* Header */}
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack spacing={1}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          Orden #{order.id.slice(-8)}
                        </Typography>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Chip
                            icon={getStatusIcon(order.status)}
                            label={STATUS_LABELS[order.status]}
                            color={getStatusColor(order.status)}
                            size="small"
                          />
                          <Typography variant="caption" color="text.secondary">
                            {new Date(order.createdAt).toLocaleString('es-MX')}
                          </Typography>
                        </Stack>
                      </Stack>

                      <Typography variant="h6" color="primary" sx={{ fontWeight: 700 }}>
                        ${order.total.toFixed(2)}
                      </Typography>
                    </Stack>

                    <Divider />

                    {/* Items */}
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 1 }}>
                        Items:
                      </Typography>
                      {order.items.map((item, idx) => (
                        <Box key={idx} sx={{ mb: 1 }}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2">
                              {item.quantity}x {item.name}
                            </Typography>
                            <Typography variant="body2">
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Stack>
                          {item.note && (
                            <Typography variant="caption" color="primary" sx={{ fontStyle: 'italic' }}>
                              📝 {item.note}
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>

                    {/* Cliente */}
                    <Box>
                      <Typography variant="caption" color="text.secondary">
                        Cliente: {order.customerName}
                      </Typography>
                    </Box>

                    {/* Acciones */}
                    <Stack direction="row" spacing={1}>
                      {getNextStatus(order.status) && (
                        <Button
                          variant="contained"
                          size="small"
                          onClick={() => {
                            updateOrderStatus(
                              order.id,
                              getNextStatus(order.status)
                            );
                          }}
                        >
                          Avanzar a {STATUS_LABELS[getNextStatus(order.status)]}
                        </Button>
                      )}
                      
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenDialog(order)}
                      >
                        Cambiar Estado
                      </Button>

                      {order.status === ORDER_STATUS.PENDING && (
                        <Button
                          variant="outlined"
                          color="error"
                          size="small"
                          onClick={() => updateOrderStatus(order.id, ORDER_STATUS.CANCELLED)}
                        >
                          Rechazar
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            ))}
          </List>
        )}

        {/* Dialog para cambiar estado */}
        <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
          <DialogTitle>Cambiar Estado de Orden</DialogTitle>
          <DialogContent>
            <FormControl fullWidth sx={{ mt: 2 }}>
              <InputLabel>Nuevo Estado</InputLabel>
              <Select
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                label="Nuevo Estado"
              >
                {Object.entries(STATUS_LABELS).map(([value, label]) => (
                  <MenuItem key={value} value={value}>
                    {label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateStatus} variant="contained">
              Actualizar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </GeneralContent>
  );
};

export default BusinessDashboard;