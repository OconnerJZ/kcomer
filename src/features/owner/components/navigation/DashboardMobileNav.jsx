import PropTypes from "prop-types";
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Paper,
} from "@mui/material";
import { getVisibleDashboardTabs } from "../../model/dashboardNavigation";
import { DASHBOARD_ICONS } from "./dashboardIcons";

const DashboardMobileNav = ({
  activeTab,
  onTabChange,
  pendingOrders = 0,
  allowedTabs = [0, 1, 2, 3],
}) => (
  <Paper
    sx={{
      width: "100%",
      height: "9%",
      position: "fixed",
      bottom: 0,
      left: 0,
      zIndex: 1000,
      display: { xs: "flex", sm: "flex", md: "none" },
      borderTop: "1px solid #e0e0e0",
      backgroundColor: "#fff",
    }}
    elevation={8}
  >
    <BottomNavigation
      value={activeTab}
      onChange={(_event, newValue) => onTabChange(newValue)}
      showLabels
      sx={{
        width: "100%",
        "& .MuiBottomNavigationAction-root": { minWidth: "auto" },
      }}
    >
      {getVisibleDashboardTabs(allowedTabs, pendingOrders).map((tab) => (
        <BottomNavigationAction
          key={tab.id}
          value={tab.id}
          label={tab.mobileLabel}
          icon={tab.badge ? (
            <Badge badgeContent={tab.badge} color="error" max={99}>
              {DASHBOARD_ICONS[tab.icon]}
            </Badge>
          ) : DASHBOARD_ICONS[tab.icon]}
        />
      ))}
    </BottomNavigation>
  </Paper>
);

DashboardMobileNav.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  pendingOrders: PropTypes.number,
  allowedTabs: PropTypes.arrayOf(PropTypes.number),
};

export default DashboardMobileNav;
