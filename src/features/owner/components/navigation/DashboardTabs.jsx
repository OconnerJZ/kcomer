import { useState } from "react";
import PropTypes from "prop-types";
import {
  Badge,
  Button,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
} from "@mui/material";
import { ExpandMoreRounded } from "@mui/icons-material";
import { getVisibleDashboardGroups } from "../../model/dashboardNavigation";
import { DASHBOARD_ICONS } from "./dashboardIcons";

const DashboardTabs = ({ activeTab, allowedTabs, pendingOrders, onTabChange }) => {
  const [menuState, setMenuState] = useState({ anchorEl: null, groupId: null });
  const groups = getVisibleDashboardGroups(allowedTabs, pendingOrders);
  const openGroup = groups.find((group) => group.id === menuState.groupId);

  const closeMenu = () => setMenuState({ anchorEl: null, groupId: null });

  const selectTab = (tabId) => {
    closeMenu();
    onTabChange(tabId);
  };

  return (
    <>
      <Stack direction="row" spacing={0.5} alignItems="center" sx={{ mr: 1 }}>
        {groups.map((group) => {
          const isActive = group.items.some((tab) => tab.id === activeTab);

          return (
            <Badge
              key={group.id}
              badgeContent={group.badge}
              color="error"
              max={99}
              sx={{ "& .MuiBadge-badge": { right: 2, top: 3 } }}
            >
              <Button
                startIcon={DASHBOARD_ICONS[group.icon]}
                endIcon={<ExpandMoreRounded fontSize="small" />}
                onClick={(event) => setMenuState({ anchorEl: event.currentTarget, groupId: group.id })}
                aria-haspopup="menu"
                aria-expanded={menuState.groupId === group.id ? "true" : undefined}
                sx={{
                  color: isActive ? "text.primary" : "text.secondary",
                  fontWeight: isActive ? 700 : 500,
                  minWidth: "max-content",
                  px: 1.25,
                  borderRadius: 7,
                  border: "1px solid",
                  borderColor: isActive ? "rgba(198,90,80,.24)" : "transparent",
                  backgroundColor: isActive ? "rgba(198,90,80,.07)" : "transparent",
                  "&:hover": {
                    backgroundColor: isActive ? "rgba(198,90,80,.10)" : "rgba(56,50,44,.045)",
                  },
                }}
              >
                {group.label}
              </Button>
            </Badge>
          );
        })}
      </Stack>

      <Menu
        anchorEl={menuState.anchorEl}
        open={Boolean(menuState.anchorEl && openGroup)}
        onClose={closeMenu}
        anchorOrigin={{ horizontal: "left", vertical: "bottom" }}
        transformOrigin={{ horizontal: "left", vertical: "top" }}
        slotProps={{
          paper: {
            sx: {
              minWidth: 210,
              mt: 0.75,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 6px 18px rgba(38,33,29,.10)",
            },
          },
        }}
      >
        {openGroup?.items.map((tab) => (
          <MenuItem
            key={tab.id}
            selected={tab.id === activeTab}
            onClick={() => selectTab(tab.id)}
            sx={{ minHeight: 44 }}
          >
            <ListItemIcon>
              {tab.badge ? (
                <Badge badgeContent={tab.badge} color="error" max={99}>
                  {DASHBOARD_ICONS[tab.icon]}
                </Badge>
              ) : DASHBOARD_ICONS[tab.icon]}
            </ListItemIcon>
            <ListItemText primary={tab.label} />
          </MenuItem>
        ))}
      </Menu>
    </>
  );
};

DashboardTabs.propTypes = {
  activeTab: PropTypes.number.isRequired,
  allowedTabs: PropTypes.arrayOf(PropTypes.number).isRequired,
  pendingOrders: PropTypes.number.isRequired,
  onTabChange: PropTypes.func.isRequired,
};

export default DashboardTabs;
