import { useState, useEffect, forwardRef, useMemo } from "react";
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
  Dialog,
  Slide,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { businessAPI, handleApiError } from "@Api";
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
import RegisterBusiness from "./RegisterBusiness";
import Bg from "@Assets/images/qscome-bg-6.png";

// ✅ Importar hook de órdenes para obtener el count
import useBusinessOrders from "@Hooks/generales/useBusinessOrders";

const BUSINESS_DEFAULT = 0;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OwnerDashboard() {
  const { user } = useAuth();
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

  // ✅ REFACTORIZADO: Solo cargar negocios
  const [businesses, setBusinesses] = useState([]);
  const [activeBusinessId, setActiveBusinessId] = useState(null);

  // ✅ NUEVO: Usar hook solo para obtener el count de órdenes pendientes
  // No pasamos las órdenes como prop, cada tab maneja su propia data
  const { orders: ordersForCount } = useBusinessOrders(activeBusinessId);

  const loadBusinesses = async () => {
    try {
      setLoading(true);
      const res = await businessAPI.getAll();
      const userBusinesses = res.data.data.filter(
        (b) => b.ownerId === user.id || true
      );

      setBusinesses(userBusinesses);

      // negocio default
      setActiveBusinessId(userBusinesses[BUSINESS_DEFAULT]?.id ?? null);
    } catch (err) {
      setError(handleApiError(err).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBusinesses();
  }, [user.id]);

  const dataActiveBusiness = useMemo(
    () => businesses.find((b) => b.id === activeBusinessId),
    [businesses, activeBusinessId]
  );

  const selectBusiness = (businessId) => {
    setActiveBusinessId(businessId);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  // ✅ Count de órdenes pendientes para el badge
  const pendingOrdersCount = ordersForCount.filter(
    (o) => o.status === "pending"
  ).length;

    if (user?.role === "customer") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
          mt:-6
        }}
      >
        <RegisterBusiness />
      </Box>
    );
  }

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

  if (!dataActiveBusiness) {
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
        pb: { xs: 10, md: 0 },
      }}
    >
      {/* Navbar Personalizado */}
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        businessName={dataActiveBusiness.title}
        pendingOrders={pendingOrdersCount}
        selectBusiness={selectBusiness}
        businesses={businesses}
      />

      <Fab
        sx={{ position: "fixed", bottom: 100, right: 16 }}
        color="primary"
        size="small"
        onClick={handleClickOpen}
      >
        <AddBusiness />
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
            {/* ✅ REFACTORIZADO: Solo pasar businessId, no las órdenes */}
            {activeTab === 0 && (
              <OrdersTab businessId={dataActiveBusiness.id} />
            )}
            
            {/* ✅ Cada tab maneja su propia data */}
            {activeTab === 1 && (
              <MenuTab businessId={dataActiveBusiness.id} />
            )}
            
            {activeTab === 2 && (
              <ReportsTab businessId={dataActiveBusiness.id} />
            )}
            
            {activeTab === 3 && (
              <SettingsTab
                businessData={dataActiveBusiness}
                onRefresh={loadBusinesses}
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
    </Box>
  );
}