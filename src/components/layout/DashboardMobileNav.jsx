// src/components/layout/DashboardMobileNav.jsx
import { 
  BottomNavigation, 
  BottomNavigationAction, 
  Badge, 
  Paper 
} from '@mui/material';
import {
  Dashboard,
  Restaurant,
  Assessment,
  Settings
} from '@mui/icons-material';

const DashboardMobileNav = ({ activeTab, onTabChange, pendingOrders = 0 }) => {
  const tabs = [
    { 
      id: 0, 
      label: 'Órdenes', 
      icon: <Dashboard />,
      badge: pendingOrders 
    },
    { 
      id: 1, 
      label: 'Menú', 
      icon: <Restaurant /> 
    },
    { 
      id: 2, 
      label: 'Reportes', 
      icon: <Assessment /> 
    },
    { 
      id: 3, 
      label: 'Config', 
      icon: <Settings /> 
    },
  ];

  return (
    <Paper
      sx={{
         width: "100%",
          height: "9%",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          display: { xs: "flex", sm: "flex", md:'none' },
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
      }}
      elevation={8}
    >
      <BottomNavigation
        value={activeTab}
        onChange={(event, newValue) => onTabChange(newValue)}
        showLabels
        sx={{
            width: "100%",
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
            },
          }}
      >
        {tabs.map((tab) => (
          <BottomNavigationAction
            key={tab.id}
            label={tab.label}
            icon={
              tab.badge ? (
                <Badge 
                  badgeContent={tab.badge} 
                  color="error"
                  max={99}
                >
                  {tab.icon}
                </Badge>
              ) : (
                tab.icon
              )
            }
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
};

export default DashboardMobileNav;