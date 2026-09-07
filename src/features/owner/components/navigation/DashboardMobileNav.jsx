import { useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  BottomNavigation,
  BottomNavigationAction,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from "@mui/material";
import { getVisibleDashboardGroups } from "../../model/dashboardNavigation";
import { DASHBOARD_ICONS } from "./dashboardIcons";

const DashboardMobileNav = ({
  activeTab,
  onTabChange,
  pendingOrders = 0,
  allowedTabs = [0, 1, 2, 4, 5, 6, 3],
}) => {
  const [openGroupId, setOpenGroupId] = useState(null);
  const groups = getVisibleDashboardGroups(allowedTabs, pendingOrders);
  const activeGroup = groups.find((group) => group.items.some((tab) => tab.id === activeTab));
  const openGroup = groups.find((group) => group.id === openGroupId);

  const selectTab = (tabId) => {
    setOpenGroupId(null);
    onTabChange(tabId);
  };

  return (
    <>
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
          boxShadow: "0 -2px 10px rgba(38,33,29,.07)",
        }}
      >
        <BottomNavigation
          value={openGroupId || activeGroup?.id || false}
          showLabels
          sx={{
            width: "100%",
            height: 64,
            "& .MuiBottomNavigationAction-root": {
              minWidth: 0,
              px: 0.75,
            },
            "& .MuiBottomNavigationAction-label": {
              fontSize: "0.7rem",
              whiteSpace: "nowrap",
            },
            "& .Mui-selected .MuiBottomNavigationAction-label": {
              fontSize: "0.72rem",
              fontWeight: 700,
            },
          }}
        >
          {groups.map((group) => (
            <BottomNavigationAction
              key={group.id}
              value={group.id}
              label={group.mobileLabel}
              onClick={() => setOpenGroupId(group.id)}
              icon={(
                <Badge badgeContent={group.badge} color="error" max={99}>
                  {DASHBOARD_ICONS[group.icon]}
                </Badge>
              )}
            />
          ))}
        </BottomNavigation>
      </Paper>

      <Drawer
        anchor="bottom"
        open={Boolean(openGroup)}
        onClose={() => setOpenGroupId(null)}
        ModalProps={{ keepMounted: true }}
        slotProps={{
          paper: {
            sx: {
              borderRadius: "12px 12px 0 0",
              backgroundImage: "none",
              px: 1.5,
              pt: 1,
              pb: "calc(12px + env(safe-area-inset-bottom))",
              maxHeight: "70dvh",
            },
          },
        }}
      >
        <Box
          sx={{
            width: 38,
            height: 4,
            borderRadius: 999,
            bgcolor: "divider",
            mx: "auto",
            mb: 1.25,
          }}
        />
        <Typography variant="subtitle1" sx={{ px: 1, pb: 0.75, fontWeight: 700 }}>
          {openGroup?.label}
        </Typography>
        <List disablePadding>
          {openGroup?.items.map((tab) => (
            <ListItemButton
              key={tab.id}
              selected={tab.id === activeTab}
              onClick={() => selectTab(tab.id)}
              sx={{
                minHeight: 48,
                borderRadius: 2,
                mb: 0.5,
                "&.Mui-selected": {
                  bgcolor: "rgba(198,90,80,.08)",
                },
                "&.Mui-selected:hover": {
                  bgcolor: "rgba(198,90,80,.11)",
                },
              }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>
                {tab.badge ? (
                  <Badge badgeContent={tab.badge} color="error" max={99}>
                    {DASHBOARD_ICONS[tab.icon]}
                  </Badge>
                ) : DASHBOARD_ICONS[tab.icon]}
              </ListItemIcon>
              <ListItemText
                primary={tab.label}
                primaryTypographyProps={{ fontWeight: tab.id === activeTab ? 700 : 500 }}
              />
            </ListItemButton>
          ))}
        </List>
      </Drawer>
    </>
  );
};

DashboardMobileNav.propTypes = {
  activeTab: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
  pendingOrders: PropTypes.number,
  allowedTabs: PropTypes.arrayOf(PropTypes.number),
};

export default DashboardMobileNav;
