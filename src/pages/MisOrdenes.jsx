// src/pages/MisOrdenes.jsx
import { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
} from '@mui/material';
import {
  ExpandMore,
  ExpandLess,
  Restaurant,
  CheckCircle,
  LocalShipping,
  HourglassEmpty,
} from '@mui/icons-material';
import GeneralContent from '@Components/layout/GeneralContent';
import { useOrders, ORDER_STATUS, STATUS_LABELS } from '@Context/OrderContext';
import { useAuth } from '@Context/AuthContext';

const MisOrdenes = () => {
  const { user } = useAuth();
  const { orders, getOrdersByUser, cancelOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);

  const userOrders = getOrdersByUser(user?.id);

  const getSteps = () => [
    { label: 'Pendiente', status: ORDER_STATUS.PENDING },
    { label: 'Aceptada', status: ORDER_STATUS.ACCEPTED },
    { label: 'Preparando', status: ORDER_STATUS.PREPARING },
    { label: 'Lista', status: ORDER_STATUS.READY },
    { label: 'Completada', status: ORDER_STATUS.COMPLETED },
  ];

  const getActiveStep = (orderStatus) => {
    const steps = getSteps();
    const index = steps.findIndex(step => step.status === orderStatus);
    return index >= 0 ? index : 0;
  };

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
      [ORDER_STATUS.COMPLETED]: <CheckCircle />,
    };
    return icons[status];
  };

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (userOrders.length === 0) {
    return (
      <GeneralContent title="Mis Órdenes">
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            textAlign: 'center',
            px: 3,
          }}
        >
          <Restaurant sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No tienes órdenes
          </Typography>
          <Typography color="text.secondary">
            Realiza tu primer pedido y aparecerá aquí
          </Typography>
        </Box>
      </GeneralContent>
    );
  }

  return (
    <GeneralContent title="Mis Órdenes">
      <Box sx={{ maxWidth: 900, mx: 'auto', mt: { xs: 2, sm: 4 }, px: 2 }}>
        {/* Header */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
          <Typography color="text.secondary">
            Sigue el estado de tus pedidos
          </Typography>
        </Paper>

        {/* Lista de órdenes */}
        <Stack spacing={3}>
          {userOrders.map((order) => (
            <Card key={order.id} sx={{ borderRadius: 2 }} elevation={3}>
              <CardContent>
                <Stack spacing={2}>
                  {/* Header */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    onClick={() => handleToggleExpand(order.id)}
                    sx={{ cursor: 'pointer' }}
                  >
                    <Stack spacing={1}>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {order.businessName}
                        </Typography>
                        {expandedOrder === order.id ? <ExpandLess /> : <ExpandMore />}
                      </Stack>
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

                  {/* Stepper de progreso */}
                  {order.status !== ORDER_STATUS.CANCELLED && (
                    <>
                      <Divider />
                      <Stepper activeStep={getActiveStep(order.status)} alternativeLabel>
                        {getSteps().map((step) => (
                          <Step key={step.status}>
                            <StepLabel>{step.label}</StepLabel>
                          </Step>
                        ))}
                      </Stepper>
                    </>
                  )}

                  {/* Detalles expandibles */}
                  <Collapse in={expandedOrder === order.id}>
                    <Divider sx={{ mb: 2 }} />
                    
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Items:
                    </Typography>
                    <List dense>
                      {order.items.map((item, idx) => (
                        <ListItem key={idx} sx={{ py: 0.5 }}>
                          <ListItemText
                            primary={
                              <Stack direction="row" justifyContent="space-between">
                                <Typography variant="body2">
                                  {item.quantity}x {item.name}
                                </Typography>
                                <Typography variant="body2">
                                  ${(item.price * item.quantity).toFixed(2)}
                                </Typography>
                              </Stack>
                            }
                            secondary={
                              item.note && (
                                <Typography
                                  variant="caption"
                                  color="primary"
                                  sx={{ fontStyle: 'italic' }}
                                >
                                  📝 {item.note}
                                </Typography>
                              )
                            }
                          />
                        </ListItem>
                      ))}
                    </List>

                    {/* Historial de estados */}
                    <Divider sx={{ my: 2 }} />
                    <Typography variant="subtitle2" sx={{ mb: 1 }}>
                      Historial:
                    </Typography>
                    <Stack spacing={1}>
                      {order.statusHistory.map((history, idx) => (
                        <Box key={idx}>
                          <Typography variant="caption" color="text.secondary">
                            {new Date(history.timestamp).toLocaleString('es-MX')}
                          </Typography>
                          <Typography variant="body2">
                            {STATUS_LABELS[history.status]}
                            {history.note && ` - ${history.note}`}
                          </Typography>
                        </Box>
                      ))}
                    </Stack>

                    {/* Botón cancelar */}
                    {order.status === ORDER_STATUS.PENDING && (
                      <>
                        <Divider sx={{ my: 2 }} />
                        <Button
                          variant="outlined"
                          color="error"
                          fullWidth
                          onClick={() => {
                            if (window.confirm('¿Estás seguro de cancelar esta orden?')) {
                              cancelOrder(order.id);
                            }
                          }}
                        >
                          Cancelar Orden
                        </Button>
                      </>
                    )}
                  </Collapse>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Stack>
      </Box>
    </GeneralContent>
  );
};

export default MisOrdenes;