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
}) => {
  const tabs = getVisibleDashboardTabs(allowedTabs, pendingOrders);

  return (
    <Paper
      sx={{
        width: "100%",
        position: "fixed",
        bottom: 0,
        left: 0,
        zIndex: 1000,
        display: { xs: "block", md: "none" },
        borderTop: "1px solid",
        borderColor: "divider",
        backgroundColor: "background.paper",
        pb: "env(safe-area-inset-bottom)",
        overflowX: "auto",
        scrollbarWidth: "none",
        "&::-webkit-scrollbar": { display: "none" },
      }}
      elevation={3}
    >
      <BottomNavigation
        value={activeTab}
        onChange={(_event, newValue) => onTabChange(newValue)}
        showLabels
        sx={{
          minWidth: Math.max(420, tabs.length * 76),
          height: 64,
          justifyContent: "flex-start",
          "& .MuiBottomNavigationAction-root": {
            minWidth: 76,
            maxWidth: 92,
            px: 0.75,
          },
          "& .MuiBottomNavigationAction-label": {
            fontSize: "0.68rem",
            whiteSpace: "nowrap",
          },
          "& .Mui-selected .MuiBottomNavigationAction-label": {
            fontSize: "0.7rem",
            fontWeight: 600,
          },
        }}
      >
        {tabs.map((tab) => (
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
};

DashboardMobileNav.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  pendingOrders: PropTypes.number,
  allowedTabs: PropTypes.arrayOf(PropTypes.number),
};

export default DashboardMobileNav;
