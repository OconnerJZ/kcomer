import PropTypes from "prop-types";
import {
  AppBar,
  Box,
  Divider,
  IconButton,
  Stack,
  Toolbar,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { ArrowBack } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import BusinessSelector from "./BusinessSelector";
import DashboardNotifications from "./DashboardNotifications";
import DashboardTabs from "./DashboardTabs";
import DashboardUserMenu from "./DashboardUserMenu";
import LogoClassic from "/pwa-512x512.png";

const DashboardNavbar = ({
  activeTab,
  onTabChange,
  onNotificationNavigate,
  businessName,
  selectedBusinessId,
  pendingOrders = 0,
  selectBusiness,
  businesses,
  allowedTabs = [0, 1, 2, 3],
}) => {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const exitDashboard = () => navigate("/explorar");
  const businessSelector = (
    <BusinessSelector
      businessName={businessName}
      businesses={businesses}
      selectedBusinessId={selectedBusinessId}
      onSelect={selectBusiness}
    />
  );

  return (
    <AppBar
      position="fixed"
      sx={{
        backgroundColor: "rgba(255, 255, 255, 0.8)",
        backdropFilter: "blur(10px)",
        borderBottom: "1px solid rgba(255, 255, 255, 0.1)",
      }}
    >
      <Toolbar>
        <IconButton
          onClick={exitDashboard}
          aria-label="Regresar a explorar"
          sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}
        >
          <ArrowBack />
        </IconButton>
        {isMobile && businessSelector}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          {!isMobile && (
            <>
              <Box
                component="img"
                src={LogoClassic}
                alt="logo"
                width={40}
                onClick={exitDashboard}
                sx={{ cursor: "pointer" }}
              />
              <Divider
                orientation="vertical"
                flexItem
                sx={{ bgcolor: "rgba(255,255,255,0.1)" }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ color: "rgba(0,0,0,0.7)", fontSize: "0.75rem" }}
                >
                  Panel de Negocio
                </Typography>
                {businessSelector}
              </Box>
            </>
          )}
        </Stack>

        {!isMobile && (
          <DashboardTabs
            activeTab={activeTab}
            allowedTabs={allowedTabs}
            pendingOrders={pendingOrders}
            onTabChange={onTabChange}
          />
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          <DashboardNotifications onNavigate={onNotificationNavigate} />
          <DashboardUserMenu />
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

DashboardNavbar.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  onNotificationNavigate: PropTypes.func,
  businessName: PropTypes.string.isRequired,
  selectedBusinessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  pendingOrders: PropTypes.number,
  selectBusiness: PropTypes.func.isRequired,
  businesses: PropTypes.arrayOf(PropTypes.object).isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.number),
};

export default DashboardNavbar;
