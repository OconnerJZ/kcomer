import { useMemo } from "react";
import { Box, Container, Fab } from "@mui/material";
import { AddBusiness } from "@mui/icons-material";
import { useAuth } from "@Features/auth/context/AuthContext";
import { canAccessBusinessDashboard } from "@Features/auth/model/roles";
import { getAllowedDashboardTabs } from "@Features/auth/model/businessPermissions";
import useBusinessOrders from "@Features/orders/hooks/useBusinessOrders";
import BusinessRegistrationDialog from "../components/dashboard/BusinessRegistrationDialog";
import OwnerDashboardContent from "../components/dashboard/OwnerDashboardContent";
import OwnerDashboardState from "../components/dashboard/OwnerDashboardState";
import DashboardMobileNav from "../components/navigation/DashboardMobileNav";
import DashboardNavbar from "../components/navigation/DashboardNavbar";
import useBusinessOwner from "../hooks/useBusinessOwner";
import { useBusinessRegistrationDialog } from "../hooks/useBusinessRegistrationDialog";
import { useOwnerDashboardNavigation } from "../hooks/useOwnerDashboardNavigation";
import {
  DASHBOARD_STATE,
  getDisplayedDashboardTab,
  getOwnerDashboardState,
  getPendingOrdersCount,
} from "../model/ownerDashboard";
import Bg from "@Assets/images/qscome-bg-6.png";

export default function OwnerDashboard() {
  const { user } = useAuth();
  const navigation = useOwnerDashboardNavigation();
  const {
    businesses,
    selectedBusiness,
    selectedBusinessId,
    loading: loadingBusinesses,
    error: businessError,
    refetchBusinesses,
    hasBusinesses,
  } = useBusinessOwner(navigation.selectedBusinessId);
  const businessOrders = useBusinessOrders(selectedBusinessId);
  const registration = useBusinessRegistrationDialog({
    refetchBusinesses,
    selectBusiness: navigation.selectBusiness,
  });
  const isAdmin = user?.role === "admin";
  const allowedTabs = useMemo(
    () => getAllowedDashboardTabs(selectedBusiness, { isAdmin }),
    [isAdmin, selectedBusiness],
  );
  const displayedTab = getDisplayedDashboardTab(navigation.activeTab, allowedTabs);
  const pendingOrdersCount = useMemo(
    () => getPendingOrdersCount(businessOrders.orders),
    [businessOrders.orders],
  );
  const dashboardState = getOwnerDashboardState({
    canAccess: canAccessBusinessDashboard(user),
    loadingBusinesses,
    hasBusinesses: hasBusinesses(),
    businessError,
    selectedBusiness,
  });

  if (dashboardState !== DASHBOARD_STATE.READY) {
    return (
      <OwnerDashboardState
        state={dashboardState}
        error={businessError}
        onBusinessCreated={refetchBusinesses}
      />
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
        activeTab={displayedTab}
        onTabChange={navigation.setActiveTab}
        onNotificationNavigate={navigation.navigateFromNotification}
        businessName={selectedBusiness.name}
        selectedBusinessId={selectedBusinessId}
        pendingOrders={pendingOrdersCount}
        selectBusiness={navigation.selectBusiness}
        businesses={businesses}
        allowedTabs={allowedTabs}
      />

      <Fab
        sx={{ position: "fixed", bottom: 100, right: 16 }}
        color="primary"
        size="small"
        aria-label="Registrar negocio"
        onClick={registration.openDialog}
      >
        <AddBusiness />
      </Fab>
      <BusinessRegistrationDialog
        open={registration.open}
        onClose={registration.closeDialog}
        onCreated={registration.handleBusinessCreated}
      />

      <Box sx={{ height: { xs: 56, sm: 64 } }} />
      <Container
        maxWidth="xl"
        sx={{ mt: { xs: 2, md: 4 }, px: { xs: 1.5, sm: 2.5, md: 3 } }}
      >
        <OwnerDashboardContent
          displayedTab={displayedTab}
          allowedTabs={allowedTabs}
          businessId={selectedBusinessId}
          selectedBusiness={selectedBusiness}
          businessOrders={businessOrders}
          focusedOrderId={navigation.focusedOrderId}
          onFocusHandled={navigation.clearFocusedOrder}
          onRefreshBusinesses={refetchBusinesses}
          isAdmin={isAdmin}
        />
      </Container>

      <DashboardMobileNav
        activeTab={displayedTab}
        onTabChange={navigation.setActiveTab}
        pendingOrders={pendingOrdersCount}
        allowedTabs={allowedTabs}
      />
    </Box>
  );
}
