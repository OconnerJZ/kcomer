import { useState, forwardRef, useMemo, useEffect } from "react";
import {
  Box,
  CircularProgress,
  Alert,
  Container,
  Fade,
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
import { useAuth } from "@Features/auth/context/AuthContext";
import { isOwner } from "@Features/auth/model/roles";
import DashboardNavbar from "@Features/owner/components/navigation/DashboardNavbar";
import DashboardMobileNav from "@Features/owner/components/navigation/DashboardMobileNav";
import OrdersTab from "@Features/owner/pages/OwnerOrders";
import MenuTab from "@Features/owner/pages/OwnerMenu";
import ReportsTab from "@Features/owner/pages/OwnerReports";
import SettingsTab from "@Features/owner/pages/OwnerSettings";
import RegisterBusiness from "@Features/owner/pages/RegisterBusiness";
import useBusinessOwner from "@Features/owner/hooks/useBusinessOwner";
import useBusinessOrders from "@Features/owner/hooks/useBusinessOrders";
import Bg from "@Assets/images/qscome-bg-6.png";

const BUSINESS_DEFAULT = 0;

const Transition = forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

export default function OwnerDashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [open, setOpen] = useState(false);
  const [selectedBusinessId, setSelectedBusinessId] = useState(null);

  const {
    businesses,
    selectedBusiness,
    loading: loadingBusinesses,
    error: businessError,
    refetchBusinesses,
    hasBusinesses,
  } = useBusinessOwner(selectedBusinessId);

  const {
    loading: loadingOrders,
    getPendingOrders,
  } = useBusinessOrders(selectedBusinessId);

  const handleClickOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleTabChange = (newTab) => setActiveTab(newTab);
  const selectBusiness = (businessId) => setSelectedBusinessId(businessId);

  useEffect(() => {
    if (!selectedBusinessId && businesses.length > 0) {
      setSelectedBusinessId(businesses[BUSINESS_DEFAULT]?.id);
    }
  }, [businesses, selectedBusinessId]);

  const pendingOrdersCount = useMemo(() => getPendingOrders().length, [getPendingOrders]);

  if (!isOwner(user)) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", px: 2, mt: -6 }}>
        <RegisterBusiness />
      </Box>
    );
  }

  if (loadingBusinesses && !hasBusinesses()) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", backgroundColor: "background.default" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (businessError) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", px: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>{businessError}</Alert>
      </Box>
    );
  }

  if (!hasBusinesses()) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh", px: 2 }}>
        <RegisterBusiness />
      </Box>
    );
  }

  if (!selectedBusiness) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "100vh" }}>
        <CircularProgress />
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
      <DashboardNavbar
        activeTab={activeTab}
        onTabChange={handleTabChange}
        businessName={selectedBusiness.title}
        pendingOrders={pendingOrdersCount}
        selectBusiness={selectBusiness}
        businesses={businesses}
      />

      <Fab sx={{ position: "fixed", bottom: 100, right: 16 }} color="primary" size="small" onClick={handleClickOpen}>
        <AddBusiness />
      </Fab>

      <Dialog fullScreen open={open} onClose={handleClose} slots={{ transition: Transition }}>
        <AppBar sx={{ position: "relative" }}>
          <Toolbar>
            <IconButton edge="start" color="inherit" onClick={handleClose} aria-label="close">
              <CloseIcon />
            </IconButton>
            <Typography sx={{ ml: 2, flex: 1 }} variant="h6" component="div">Registrar negocio</Typography>
          </Toolbar>
        </AppBar>
        <RegisterBusiness onSuccess={handleClose} />
      </Dialog>

      <Box sx={{ height: { xs: 56, sm: 64 } }} />

      <Container maxWidth="xl" sx={{ mt: { xs: 2, md: 4 }, px: { xs: 1, sm: 2, md: 3 } }}>
        <Fade in timeout={500}>
          <Box>
            {activeTab === 0 && <OrdersTab businessId={selectedBusinessId} loading={loadingOrders} />}
            {activeTab === 1 && <MenuTab businessId={selectedBusinessId} />}
            {activeTab === 2 && <ReportsTab businessId={selectedBusinessId} />}
            {activeTab === 3 && <SettingsTab businessData={selectedBusiness} onRefresh={refetchBusinesses} />}
          </Box>
        </Fade>
      </Container>

      <DashboardMobileNav
        activeTab={activeTab}
        onTabChange={handleTabChange}
        pendingOrders={pendingOrdersCount}
      />
    </Box>
  );
}
