import { useState, forwardRef, useMemo } from "react";
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
import { AddBusiness } from "@mui/icons-material";
import { useAuth } from "@Context/AuthContext";

// Importar nuevo layout
import DashboardNavbar from "@Components/layout/DashboardNavbar";
import DashboardMobileNav from "@Components/layout/DashboardMobileNav";

// Importar tabs
import OrdersTab from "./OwnerOrders";
import MenuTab from "./OwnerMenu";
import ReportsTab from "./OwnerReports";
import SettingsTab from "./OwnerSettings";
import RegisterBusiness from "./RegisterBusiness";

// ✅ NUEVOS HOOKS REFACTORIZADOS
import useBusinessOwner from "@Hooks/generales/useBusinessOwner";
import useBusinessOrders from "@Hooks/generales/useBusinessOrders";

import Bg from "@Assets/images/qscome-bg-6.png";

const BUSINESS_DEFAULT = 0;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OwnerDashboard() {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  // ============================================================================
  // HOOKS REFACTORIZADOS
  // ============================================================================

  // Hook para gestión de negocios del owner
  const {
    businesses,
    selectedBusiness,
    loading: loadingBusinesses,
    error: businessError,
    refetchBusinesses,
    hasBusinesses,
  } = useBusinessOwner(selectedBusinessId);

  // Hook para órdenes del negocio seleccionado
  const {
    orders,
    loading: loadingOrders,
    getPendingOrders,
  } = useBusinessOrders(selectedBusinessId);

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTabChange = (newTab) => {
    setActiveTab(newTab);
  };

  const selectBusiness = (businessId) => {
    setSelectedBusinessId(businessId);
  };

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  // Seleccionar negocio por defecto al cargar
  useMemo(() => {
    if (!selectedBusinessId && businesses.length > 0) {
      setSelectedBusinessId(businesses[BUSINESS_DEFAULT]?.id);
    }
  }, [businesses, selectedBusinessId]);

  // Count de órdenes pendientes para el badge
  const pendingOrdersCount = useMemo(() => {
    return getPendingOrders().length;
  }, [getPendingOrders]);

  // ============================================================================
  // RENDER STATES
  // ============================================================================

  // Usuario no es owner - mostrar registro
  if (user?.role === "customer") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          px: 2,
          mt: -6,
        }}
      > 
        
        <RegisterBusiness />
        
      </Box>
    );
  }

  // Loading
  if (loadingBusinesses && !hasBusinesses()) {
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

  // Error
  if (businessError) {
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
          {businessError}
        </Alert>
      </Box>
    );
  }

  // No tiene negocios - mostrar registro
  if (!hasBusinesses()) {
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
        <Typography>{}</Typography>
      </Box>
    );
  }

  // No hay negocio seleccionado (shouldn't happen con el useMemo)
  if (!selectedBusiness) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

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
      {/* Navbar Desktop */}
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        businessName={selectedBusiness.title}
        pendingOrders={pendingOrdersCount}
        selectBusiness={selectBusiness}
        businesses={businesses}
      />

      {/* FAB - Agregar Negocio */}
      <Fab
        sx={{ position: "fixed", bottom: 100, right: 16 }}
        color="primary"
        size="small"
        onClick={handleClickOpen}
      >
        <AddBusiness />
      </Fab>

      {/* Dialog - Registrar Negocio */}
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

        <RegisterBusiness onSuccess={handleClose} />
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
            {/* ✅ Tabs solo reciben businessId */}
            {activeTab === 0 && (
              <OrdersTab 
                businessId={selectedBusinessId}
                loading={loadingOrders}
              />
            )}

            {activeTab === 1 && (
              <MenuTab businessId={selectedBusinessId} />
            )}

            {activeTab === 2 && (
              <ReportsTab businessId={selectedBusinessId} />
            )}

            {activeTab === 3 && (
              <SettingsTab
                businessData={selectedBusiness}
                onRefresh={refetchBusinesses}
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