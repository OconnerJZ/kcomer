import { useState, useEffect, useRef } from 'react';
import {
  Box,
  Paper,
  Typography,
  Tabs,
  Tab,
  Card,
  CardContent,
  Stack,
  Chip,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Divider,
  Alert,
  Snackbar,
  Badge,
  Switch,
  FormControlLabel,
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  Assessment,
  Settings,
  Add,
  Edit,
  Delete,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  LocalShipping,
  TrendingUp,
  TrendingDown,
  AttachMoney,
  ShoppingBag,
  Visibility,
  Notifications,
  Close,
} from '@mui/icons-material';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// ============ DATOS DE EJEMPLO ============
const initialOrders = [
  {
    id: 'ORD-001',
    customerName: 'Juan Pérez',
    items: [
      { name: 'Tacos al pastor', quantity: 3, price: 45 },
      { name: 'Refresco', quantity: 1, price: 25 }
    ],
    total: 160,
    status: 'pending',
    createdAt: new Date().toISOString(),
    deliveryAddress: 'Calle Principal #123',
    phoneNumber: '5512345678',
  },
  {
    id: 'ORD-002',
    customerName: 'María García',
    items: [
      { name: 'Hamburguesa especial', quantity: 2, price: 120 }
    ],
    total: 240,
    status: 'preparing',
    createdAt: new Date(Date.now() - 1800000).toISOString(),
    deliveryAddress: 'Av. Reforma #456',
    phoneNumber: '5587654321',
  },
];

const initialMenu = [
  {
    id: 1,
    name: 'Tacos al pastor',
    description: 'Deliciosos tacos con carne al pastor, piña y cilantro',
    price: 45,
    image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=300',
    available: true,
    category: 'Tacos',
  },
  {
    id: 2,
    name: 'Hamburguesa especial',
    description: 'Hamburguesa con doble carne, queso, lechuga y tomate',
    price: 120,
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=300',
    available: true,
    category: 'Hamburguesas',
  },
  {
    id: 3,
    name: 'Pizza Margarita',
    description: 'Pizza clásica con tomate, mozzarella y albahaca',
    price: 150,
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=300',
    available: true,
    category: 'Pizzas',
  },
];

const ORDER_STATUS = {
  pending: { label: 'Pendiente', color: 'warning', icon: HourglassEmpty },
  accepted: { label: 'Aceptada', color: 'info', icon: CheckCircle },
  preparing: { label: 'Preparando', color: 'primary', icon: Restaurant },
  ready: { label: 'Lista', color: 'success', icon: CheckCircle },
  in_delivery: { label: 'En camino', color: 'success', icon: LocalShipping },
  completed: { label: 'Completada', color: 'default', icon: CheckCircle },
  cancelled: { label: 'Cancelada', color: 'error', icon: Cancel },
};

// Colores para gráficas
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82ca9d'];

// ============ COMPONENTE PRINCIPAL ============
export default function OwnerDashboard() {
  const [activeTab, setActiveTab] = useState(0);
  const [orders, setOrders] = useState(initialOrders);
  const [menu, setMenu] = useState(initialMenu);
  const [notifications, setNotifications] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [currentNotification, setCurrentNotification] = useState(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const audioRef = useRef(null);
  
  // Estados para diálogos
  const [orderDialog, setOrderDialog] = useState({ open: false, order: null });
  const [menuDialog, setMenuDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });
  const [notificationDrawer, setNotificationDrawer] = useState(false);

  // ============ SISTEMA DE NOTIFICACIONES ============
  useEffect(() => {
    // Simular llegada de nuevas órdenes cada 30 segundos
    const interval = setInterval(() => {
      const shouldAddOrder = Math.random() > 0.7; // 30% de probabilidad
      
      if (shouldAddOrder) {
        const newOrder = {
          id: `ORD-${Date.now()}`,
          customerName: ['Carlos López', 'Ana Martínez', 'Pedro Sánchez'][Math.floor(Math.random() * 3)],
          items: [
            { name: menu[Math.floor(Math.random() * menu.length)].name, quantity: Math.floor(Math.random() * 3) + 1, price: 45 }
          ],
          total: Math.floor(Math.random() * 300) + 100,
          status: 'pending',
          createdAt: new Date().toISOString(),
          deliveryAddress: 'Nueva dirección',
          phoneNumber: '5512345678',
        };

        setOrders(prev => [newOrder, ...prev]);
        addNotification({
          id: Date.now(),
          title: '🔔 Nueva Orden',
          message: `${newOrder.customerName} ha realizado un pedido de $${newOrder.total}`,
          type: 'new_order',
          orderId: newOrder.id,
          timestamp: new Date().toISOString(),
          read: false,
        });
      }
    }, 30000); // Cada 30 segundos

    return () => clearInterval(interval);
  }, [menu]);

  const addNotification = (notification) => {
    setNotifications(prev => [notification, ...prev]);
    setCurrentNotification(notification);
    setShowNotification(true);
    setUnreadCount(prev => prev + 1);
    
    // Reproducir sonido
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log('No se pudo reproducir el sonido'));
    }

    // Notificación del navegador
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(notification.title, {
        body: notification.message,
        icon: '/pwa-192x192.png',
      });
    }
  };

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const markNotificationAsRead = (id) => {
    setNotifications(prev => prev.map(n => 
      n.id === id ? { ...n, read: true } : n
    ));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  // ============ DATOS PARA GRÁFICAS ============
  const getChartData = () => {
    // Ventas por día (últimos 7 días)
    const salesByDay = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dayName = date.toLocaleDateString('es-MX', { weekday: 'short' });
      
      salesByDay.push({
        day: dayName,
        ventas: Math.floor(Math.random() * 5000) + 2000,
        ordenes: Math.floor(Math.random() * 30) + 10,
      });
    }

    // Ventas por categoría
    const salesByCategory = menu.reduce((acc, item) => {
      const category = item.category;
      const sold = orders
        .flatMap(o => o.items)
        .filter(i => i.name === item.name)
        .reduce((sum, i) => sum + i.quantity, 0);
      
      const existing = acc.find(c => c.name === category);
      if (existing) {
        existing.value += sold * item.price;
      } else {
        acc.push({ name: category, value: sold * item.price });
      }
      return acc;
    }, []);

    // Estados de órdenes
    const ordersByStatus = Object.keys(ORDER_STATUS).map(status => ({
      name: ORDER_STATUS[status].label,
      value: orders.filter(o => o.status === status).length,
    })).filter(item => item.value > 0);

    return { salesByDay, salesByCategory, ordersByStatus };
  };

  // ============ TAB 1: ÓRDENES ============
  const OrdersTab = () => {
    const [filterStatus, setFilterStatus] = useState('all');

    const filteredOrders = filterStatus === 'all' 
      ? orders 
      : orders.filter(o => o.status === filterStatus);

    const updateOrderStatus = (orderId, newStatus) => {
      setOrders(prev => prev.map(o => 
        o.id === orderId ? { ...o, status: newStatus } : o
      ));
      setOrderDialog({ open: false, order: null });
      
      addNotification({
        id: Date.now(),
        title: '✅ Estado Actualizado',
        message: `Orden ${orderId} cambió a ${ORDER_STATUS[newStatus].label}`,
        type: 'status_change',
        orderId,
        timestamp: new Date().toISOString(),
        read: false,
      });
    };

    return (
      <Box>
        {/* Filtros */}
        <Paper sx={{ p: 2, mb: 3 }}>
          <Stack direction="row" spacing={2} alignItems="center" flexWrap="wrap">
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
        </Paper>

        {/* Lista de órdenes */}
        <Stack spacing={2}>
          {filteredOrders.map(order => {
            const StatusIcon = ORDER_STATUS[order.status].icon;
            return (
              <Card key={order.id} elevation={2}>
                <CardContent>
                  <Stack spacing={2}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Stack spacing={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography variant="h6">{order.id}</Typography>
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

                    <Box>
                      {order.items.map((item, idx) => (
                        <Typography key={idx} variant="body2">
                          {item.quantity}x {item.name} - ${(item.price * item.quantity).toFixed(2)}
                        </Typography>
                      ))}
                    </Box>

                    <Stack direction="row" spacing={1}>
                      <Button
                        size="small"
                        variant="outlined"
                        startIcon={<Visibility />}
                        onClick={() => setOrderDialog({ open: true, order })}
                      >
                        Ver detalles
                      </Button>
                      {order.status === 'pending' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => updateOrderStatus(order.id, 'accepted')}
                        >
                          Aceptar
                        </Button>
                      )}
                      {order.status === 'accepted' && (
                        <Button
                          size="small"
                          variant="contained"
                          onClick={() => updateOrderStatus(order.id, 'preparing')}
                        >
                          Iniciar preparación
                        </Button>
                      )}
                      {order.status === 'preparing' && (
                        <Button
                          size="small"
                          variant="contained"
                          color="success"
                          onClick={() => updateOrderStatus(order.id, 'ready')}
                        >
                          Marcar como lista
                        </Button>
                      )}
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            );
          })}
        </Stack>

        {/* Dialog de detalles */}
        <Dialog 
          open={orderDialog.open} 
          onClose={() => setOrderDialog({ open: false, order: null })}
          maxWidth="sm"
          fullWidth
        >
          {orderDialog.order && (
            <>
              <DialogTitle>Orden {orderDialog.order.id}</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <Box>
                    <Typography variant="subtitle2">Cliente:</Typography>
                    <Typography>{orderDialog.order.customerName}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Teléfono:</Typography>
                    <Typography>{orderDialog.order.phoneNumber}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="subtitle2">Dirección:</Typography>
                    <Typography>{orderDialog.order.deliveryAddress}</Typography>
                  </Box>
                  <Divider />
                  <Box>
                    <Typography variant="subtitle2" gutterBottom>Items:</Typography>
                    {orderDialog.order.items.map((item, idx) => (
                      <Stack key={idx} direction="row" justifyContent="space-between">
                        <Typography>{item.quantity}x {item.name}</Typography>
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
      </Box>
    );
  };

  // ============ TAB 2: MENÚ ============
  const MenuTab = () => {
    const [menuForm, setMenuForm] = useState({
      name: '',
      description: '',
      price: '',
      category: '',
      image: '',
      available: true,
    });

    const handleOpenMenuDialog = (item = null) => {
      if (item) {
        setMenuForm(item);
      } else {
        setMenuForm({
          name: '',
          description: '',
          price: '',
          category: '',
          image: '',
          available: true,
        });
      }
      setMenuDialog({ open: true, item });
    };

    const handleSaveMenuItem = () => {
      if (menuDialog.item) {
        setMenu(prev => prev.map(m => 
          m.id === menuDialog.item.id ? { ...menuForm, id: m.id } : m
        ));
      } else {
        setMenu(prev => [...prev, { ...menuForm, id: Date.now() }]);
      }
      setMenuDialog({ open: false, item: null });
    };

    const handleDeleteMenuItem = (id) => {
      setMenu(prev => prev.filter(m => m.id !== id));
      setDeleteDialog({ open: false, itemId: null });
    };

    return (
      <Box>
        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
          <Typography variant="h6">Gestión de Menú</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenMenuDialog()}
          >
            Agregar platillo
          </Button>
        </Stack>

        <Grid container spacing={2}>
          {menu.map(item => (
            <Grid item xs={12} sm={6} md={4} key={item.id}>
              <Card>
                <Box
                  sx={{
                    height: 200,
                    backgroundImage: `url(${item.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                  }}
                >
                  <Chip
                    label={item.available ? 'Disponible' : 'No disponible'}
                    color={item.available ? 'success' : 'error'}
                    size="small"
                    sx={{ position: 'absolute', top: 8, right: 8 }}
                  />
                </Box>
                <CardContent>
                  <Stack spacing={1}>
                    <Typography variant="h6" noWrap>{item.name}</Typography>
                    <Typography variant="body2" color="text.secondary" noWrap>
                      {item.description}
                    </Typography>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography variant="h6" color="success.main">
                        ${item.price.toFixed(2)}
                      </Typography>
                      <Stack direction="row" spacing={0.5}>
                        <IconButton
                          size="small"
                          color="primary"
                          onClick={() => handleOpenMenuDialog(item)}
                        >
                          <Edit fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          color="error"
                          onClick={() => setDeleteDialog({ open: true, itemId: item.id })}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        {/* Dialog agregar/editar */}
        <Dialog 
          open={menuDialog.open} 
          onClose={() => setMenuDialog({ open: false, item: null })}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>
            {menuDialog.item ? 'Editar platillo' : 'Agregar platillo'}
          </DialogTitle>
          <DialogContent>
            <Stack spacing={2} sx={{ mt: 1 }}>
              <TextField
                label="Nombre del platillo"
                value={menuForm.name}
                onChange={(e) => setMenuForm({ ...menuForm, name: e.target.value })}
                fullWidth
                required
              />
              <TextField
                label="Descripción"
                value={menuForm.description}
                onChange={(e) => setMenuForm({ ...menuForm, description: e.target.value })}
                fullWidth
                multiline
                rows={2}
              />
              <TextField
                label="Precio"
                type="number"
                value={menuForm.price}
                onChange={(e) => setMenuForm({ ...menuForm, price: parseFloat(e.target.value) })}
                fullWidth
                required
                InputProps={{ startAdornment: '$' }}
              />
              <TextField
                label="Categoría"
                value={menuForm.category}
                onChange={(e) => setMenuForm({ ...menuForm, category: e.target.value })}
                fullWidth
              />
              <TextField
                label="URL de imagen"
                value={menuForm.image}
                onChange={(e) => setMenuForm({ ...menuForm, image: e.target.value })}
                fullWidth
                placeholder="https://..."
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={menuForm.available}
                    onChange={(e) => setMenuForm({ ...menuForm, available: e.target.checked })}
                  />
                }
                label="Disponible"
              />
            </Stack>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setMenuDialog({ open: false, item: null })}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSaveMenuItem} 
              variant="contained"
              disabled={!menuForm.name || !menuForm.price}
            >
              Guardar
            </Button>
          </DialogActions>
        </Dialog>

        {/* Dialog eliminar */}
        <Dialog
          open={deleteDialog.open}
          onClose={() => setDeleteDialog({ open: false, itemId: null })}
        >
          <DialogTitle>¿Eliminar platillo?</DialogTitle>
          <DialogContent>
            <Typography>Esta acción no se puede deshacer.</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialog({ open: false, itemId: null })}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleDeleteMenuItem(deleteDialog.itemId)} 
              color="error"
              variant="contained"
            >
              Eliminar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  };

  // ============ TAB 3: REPORTES ============
  const ReportsTab = () => {
    const stats = {
      totalOrders: orders.length,
      totalRevenue: orders.reduce((sum, o) => sum + o.total, 0),
      avgOrderValue: orders.length > 0 
        ? orders.reduce((sum, o) => sum + o.total, 0) / orders.length 
        : 0,
      pendingOrders: orders.filter(o => o.status === 'pending').length,
    };

    const topItems = menu
      .map(item => {
        const sold = orders
          .flatMap(o => o.items)
          .filter(i => i.name === item.name)
          .reduce((sum, i) => sum + i.quantity, 0);
        return { ...item, sold };
      })
      .sort((a, b) => b.sold - a.sold)
      .slice(0, 5);

    const { salesByDay, salesByCategory, ordersByStatus } = getChartData();

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>Reportes y Estadísticas</Typography>

        {/* Tarjetas de stats */}
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
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      +12% vs mes anterior
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
                  <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      +8% vs mes anterior
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
                  <Typography variant="h4">${stats.avgOrderValue.toFixed(2)}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingDown fontSize="small" color="error" />
                    <Typography variant="caption" color="error.main">
                      -3% vs mes anterior
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
                  <Typography variant="h4">{stats.pendingOrders}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Requieren atención
                  </Typography>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

         {/* Tarjetas de stats */}
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
                  <Typography variant="h4">{stats.totalOrders}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      +12% vs mes anterior
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
                  <Typography variant="h4">${stats.totalRevenue.toFixed(2)}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingUp fontSize="small" color="success" />
                    <Typography variant="caption" color="success.main">
                      +8% vs mes anterior
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
                  <Typography variant="h4">${stats.avgOrderValue.toFixed(2)}</Typography>
                  <Stack direction="row" spacing={0.5} alignItems="center">
                    <TrendingDown fontSize="small" color="error" />
                    <Typography variant="caption" color="error.main">
                      -3% vs mes anterior
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
                  <Typography variant="h4">{stats.pendingOrders}</Typography>
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
          {/* Gráfica de líneas: Ventas por día */}
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Ventas de la Semana
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={salesByDay}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="day" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="ventas" stroke="#8884d8" strokeWidth={2} name="Ventas ($)" />
                  <Line type="monotone" dataKey="ordenes" stroke="#82ca9d" strokeWidth={2} name="Órdenes" />
                </LineChart>
              </ResponsiveContainer>
            </Paper>
          </Grid>

          {/* Gráfica de pie: Estado de órdenes */}
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

        {/* Productos más vendidos */}
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
                {topItems.map((item) => (
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
      </Box>
    );
  };

  // ============ TAB 4: CONFIGURACIÓN ============
  const SettingsTab = () => {
    const [businessInfo, setBusinessInfo] = useState({
      name: 'Mi Negocio',
      phone: '5512345678',
      address: 'Calle Principal #123',
      email: 'negocio@example.com',
      hasDelivery: true,
      isOpen: true,
    });

    return (
      <Box>
        <Typography variant="h6" sx={{ mb: 3 }}>Configuración del Negocio</Typography>

        <Paper sx={{ p: 3, mb: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Información General
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <TextField
              label="Nombre del negocio"
              value={businessInfo.name}
              onChange={(e) => setBusinessInfo({ ...businessInfo, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Teléfono"
              value={businessInfo.phone}
              onChange={(e) => setBusinessInfo({ ...businessInfo, phone: e.target.value })}
              fullWidth
            />
            <TextField
              label="Dirección"
              value={businessInfo.address}
              onChange={(e) => setBusinessInfo({ ...businessInfo, address: e.target.value })}
              fullWidth
              multiline
              rows={2}
            />
            <TextField
              label="Email"
              type="email"
              value={businessInfo.email}
              onChange={(e) => setBusinessInfo({ ...businessInfo, email: e.target.value })}
              fullWidth
            />
          </Stack>
        </Paper>

        <Paper sx={{ p: 3 }}>
          <Typography variant="subtitle1" gutterBottom>
            Preferencias
          </Typography>
          <Stack spacing={2} sx={{ mt: 2 }}>
            <FormControlLabel
              control={
                <Switch
                  checked={businessInfo.hasDelivery}
                  onChange={(e) => setBusinessInfo({ 
                    ...businessInfo, 
                    hasDelivery: e.target.checked 
                  })}
                />
              }
              label="Servicio a domicilio activo"
            />
            <FormControlLabel
              control={
                <Switch
                  checked={businessInfo.isOpen}
                  onChange={(e) => setBusinessInfo({ 
                    ...businessInfo, 
                    isOpen: e.target.checked 
                  })}
                />
              }
              label="Negocio abierto"
            />
            <Button variant="contained" sx={{ mt: 2, alignSelf: 'flex-start' }}>
              Guardar Cambios
            </Button>
          </Stack>
        </Paper>
      </Box>
    );
  };

  // ============ RENDER PRINCIPAL ============
  return (
    <Box sx={{ maxWidth: 1400, mx: 'auto', p: 3 }}>
      {/* Header */}
      <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 700 }}>
              Panel de Administración
            </Typography>
            <Typography color="text.secondary">
              Gestiona tu negocio desde aquí
            </Typography>
          </Box>
          <Chip 
            label={orders.filter(o => o.status === 'pending').length + ' órdenes pendientes'}
            color="warning"
            size="medium"
          />
        </Stack>
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Dashboard />} label="Órdenes"  />
          <Tab icon={<Restaurant />} label="Menú"  />
          <Tab icon={<Assessment />} label="Reportes"  />
          <Tab icon={<Settings />} label="Configuración"  />
        </Tabs>
      </Paper>

      {/* Contenido de tabs */}
      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <OrdersTab />}
        {activeTab === 1 && <MenuTab />}
        {activeTab === 2 && <ReportsTab />}
        {activeTab === 3 && <SettingsTab />}
      </Box>
    </Box>
  );
}