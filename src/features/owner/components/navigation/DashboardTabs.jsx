import PropTypes from "prop-types";
import { Badge, Box, Button, Stack } from "@mui/material";
import { getVisibleDashboardTabs } from "../../model/dashboardNavigation";
import { DASHBOARD_ICONS } from "./dashboardIcons";

const DashboardTabs = ({ activeTab, allowedTabs, pendingOrders, onTabChange }) => (
  <Box
    sx={{
      minWidth: 0,
      maxWidth: { md: "52vw", lg: "60vw" },
      overflowX: "auto",
      overflowY: "hidden",
      mr: 1,
      scrollbarWidth: "none",
      "&::-webkit-scrollbar": { display: "none" },
    }}
  >
    <Stack direction="row" spacing={0.5} sx={{ width: "max-content", pr: 1 }}>
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
              color: activeTab === tab.id ? "text.primary" : "text.secondary",
              textTransform: "none",
              fontWeight: activeTab === tab.id ? 600 : 400,
              borderRadius: 0,
              px: 1.4,
              minWidth: "max-content",
              borderBottom: "2px solid",
              borderColor: activeTab === tab.id ? "primary.main" : "transparent",
            }}
          >
            {tab.label}
          </Button>
        </Badge>
      ))}
    </Stack>
  </Box>
);

DashboardTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.number).isRequired,
  pendingOrders: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default DashboardTabs;
