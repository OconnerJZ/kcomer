import PropTypes from "prop-types";
import { Badge, Button, Stack } from "@mui/material";
import { getVisibleDashboardTabs } from "../../model/dashboardNavigation";
import { DASHBOARD_ICONS } from "./dashboardIcons";

const DashboardTabs = ({ activeTab, allowedTabs, pendingOrders, onTabChange }) => (
  <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
    {getVisibleDashboardTabs(allowedTabs, pendingOrders).map((tab) => (
      <Badge
        key={tab.id}
        badgeContent={tab.badge}
        color="error"
        sx={{ "& .MuiBadge-badge": { right: -3, top: 2 } }}
      >
        <Button
          startIcon={DASHBOARD_ICONS[tab.icon]}
          onClick={() => onTabChange(tab.id)}
          sx={{
            color: activeTab === tab.id ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.65)",
            textTransform: "none",
            fontWeight: activeTab === tab.id ? 600 : 300,
            borderRadius: 0,
            px: 2,
          }}
        >
          {tab.label}
        </Button>
      </Badge>
    ))}
  </Stack>
);

DashboardTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.number).isRequired,
  pendingOrders: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default DashboardTabs;
