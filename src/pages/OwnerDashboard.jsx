// src/pages/OwnerDashboard.jsx - VERSIÓN COMPLETA CON NUEVO LAYOUT
import { useState, useEffect, forwardRef } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Container,
  Fade,
  useMediaQuery,
  useTheme,
  Fab,
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Button,
  Dialog,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import {
  businessAPI,
  orderAPI,
  menuAPI,
  statsAPI,
  handleApiError,
} from "@Services/apiService";
import { useAuth } from "@Context/AuthContext";

// Importar nuevo layout
import DashboardNavbar from "@Components/layout/DashboardNavbar";
import DashboardMobileNav from "@Components/layout/DashboardMobileNav";

// Importar tabs
import OrdersTab from "./OwnerOrders";
import MenuTab from "./OwnerMenu";
import ReportsTab from "./OwnerReports";
import SettingsTab from "./OwnerSettings";
import { AddBusiness } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import RegisterBusiness from "./RegisterBusiness";
import Bg from "@Assets/images/qscome-bg-6.png";

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [open, setOpen] = useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const [activeTab, setActiveTab] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Estados para datos reales
  const [businessData, setBusinessData] = useState(null);
  const [orders, setOrders] = useState([]);
  const [menu, setMenu] = useState([]);
  const [stats, setStats] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // 1. Obtener negocios del usuario
      const businessesResponse = await businessAPI.getAll();

      // Filtrar por propietario (ajustar según tu lógica)
      const userBusinesses = businessesResponse.data.data.filter(
        (b) => b.ownerId === user.id || true // TODO: Ajustar cuando tengas ownerId
      );

      const business = userBusinesses[0]; // Tomar el primero por ahora
      setBusinessData(business);

      // 2. Cargar órdenes
      try {
        const ordersResponse = await orderAPI.getByBusiness(business.id);
        if (ordersResponse.data.success) {
          setOrders(ordersResponse.data.data);
        }
      } catch (err) {
        console.warn("No se pudieron cargar órdenes:", err);
        setOrders([]);
      }

      // 3. Cargar menú
      try {
        const menuResponse = await menuAPI.getByBusiness(business.id);
        if (menuResponse.data.success) {
          setMenu(menuResponse.data.data);
        }
      } catch (err) {
        console.warn("No se pudo cargar menú:", err);
        setMenu([]);
      }

      // 4. Cargar estadísticas
      try {
        const statsResponse = await statsAPI.getBusinessStats(business.id);
        if (statsResponse.data.success) {
          setStats(statsResponse.data.data);
        }
      } catch (err) {
        console.warn("No se pudieron cargar estadísticas:", err);
        setStats(null);
      }
    } catch (err) {
      console.error("Error loading dashboard:", err);
      const errorData = handleApiError(err);
      setError(errorData.message);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const pendingOrdersCount = orders.filter(
    (o) => o.status === "pending"
  ).length;

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          backgroundColor: "background.default",
        }}
      >
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <Alert severity="error" sx={{ maxWidth: 600 }}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!businessData) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
        }}
      >
        <RegisterBusiness />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url(${Bg})`,
        backgroundSize: "contain",
        backgroundPosition: "center",
        pb: { xs: 10, md: 0 }, // Padding bottom para mobile nav
      }}
    >
      {/* Navbar Personalizado */}
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        businessName={businessData.businessName}
        pendingOrders={pendingOrdersCount}
      />

      <Fab
        sx={{ position: "fixed", bottom: 100, right: 16 }}
        color="primary"
        size="small"
        onClick={handleClickOpen}
      >
        {" "}
        <AddBusiness />{" "}
      </Fab>

      <Dialog
        fullScreen
        open={open}
        onClose={handleClose}
        slots={{
          transition: Transition,
        }}
      >
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              onClick={handleClose}
              aria-label="close"
            >
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">
              Registrar negocio
            </Typography>
            <Button autoFocus color="inherit" onClick={handleClose}>
              save
            </Button>
          </Toolbar>
        </AppBar>

        <RegisterBusiness />
      </Dialog>

      {/* Spacer para compensar navbar fixed */}
      <Box sx={{ height: { xs: 56, sm: 64 } }} />

      {/* Contenido Principal */}
      <Container
        maxWidth="xl"
        sx={{
          mt: { xs: 2, md: 4 },
          px: { xs: 1, sm: 2, md: 3 },
        }}
      >
        <Fade in={true} timeout={500}>
          <Box>
            {activeTab === 0 && (
              <OrdersTab
                orders={orders}
                businessId={businessData.id}
                onRefresh={loadDashboardData}
              />
            )}
            {activeTab === 1 && (
              <MenuTab
                menu={menu}
                businessId={businessData.id}
                onRefresh={loadDashboardData}
              />
            )}
            {activeTab === 2 && (
              <ReportsTab stats={stats} businessId={businessData.id} />
            )}
            {activeTab === 3 && (
              <SettingsTab
                businessData={businessData}
                onRefresh={loadDashboardData}
              />
            )}
          </Box>
        </Fade>
      </Container>

      {/* Mobile Navigation - Bottom Tabs */}
      <DashboardMobileNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingOrders={pendingOrdersCount}
      />

      {/* Mobile Floating Panel - Speed Dial (opcional) */}
      {/* Descomentar si prefieres el floating panel en vez del bottom nav */}
      {/* <DashboardFloatingPanel
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingOrders={pendingOrdersCount}
      /> */}
    </Box>
  );
}
