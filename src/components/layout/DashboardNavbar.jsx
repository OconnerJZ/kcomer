// src/components/layout/DashboardNavbar.jsx
import { useState } from "react";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Box,
  Chip,
  Stack,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  FormControl,
  InputLabel,
  Select,
} from "@mui/material";
import {
  Dashboard,
  Restaurant,
  Assessment,
  Settings,
  ArrowBack,
  Notifications,
  Person,
  Logout,
  Store,
  ArrowDownward,
  ArrowDropDownTwoTone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Context/AuthContext";
import LogoClassic from "/pwa-512x512.png";

const DashboardNavbar = ({
  activeTab,
  onTabChange,
  businessName,
  pendingOrders = 0,
  selectBusiness,
  businesses,
}) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElB, setAnchorElB] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const menuOpenBusi = Boolean(anchorElB);

  const handleChange = (id) => {
    selectBusiness(id);
    handleMenuBusiClose();
  };

  const tabs = [
    {
      id: 0,
      label: "Órdenes",
      icon: <Dashboard />,
      badge: pendingOrders,
    },
    {
      id: 1,
      label: "Menú",
      icon: <Restaurant />,
    },
    {
      id: 2,
      label: "Reportes",
      icon: <Assessment />,
    },
    {
      id: 3,
      label: "Configuración",
      icon: <Settings />,
    },
  ];

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMenuBusiOpen = (event) => {
    setAnchorElB(event.currentTarget);
  };

  const handleMenuBusiClose = () => {
    setAnchorElB(null);
  };

  const handleLogout = () => {
    handleMenuClose();
    logout();
    navigate("/login");
  };

  const handleExitDashboard = () => {
    navigate("/explorar");
  };

  const NameBusineesChange = () => {
    return (
      <>
        <Stack direction="row" alignItems={"center"}>
          <Typography
            variant="subtitle2"
            sx={{
              fontWeight: 600,
              color: "rgba(255, 75, 69, 1)",
              fontSize: "0.7rem",
            }}
          >
            {businessName}
          </Typography>
          {businesses.length > 1 && (
            <IconButton size="small">
              <ArrowDropDownTwoTone
                onClick={handleMenuBusiOpen}
                fontSize="medium"
              />
            </IconButton>
          )}
        </Stack>

        <Menu
          anchorEl={anchorElB}
          open={menuOpenBusi}
          onClose={handleMenuBusiClose}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
          PaperProps={{
            sx: {
              minWidth: 240,
              maxHeight: 240,
              mt: 1,
              borderRadius: 2,
            },
          }}
        >
          {businesses.map((b) => {
            return (
              <MenuItem
                onClick={() => {
                  handleChange(b?.id);
                }}
                key={b?.title}
              >
                <ListItemIcon>
                  <img
                    width={32}
                    height={32}
                    src={"http://localhost:3000/uploads/" + b.urlImage}
                  />
                </ListItemIcon>
                <ListItemText
                  sx={{
                    fontSize: { xs: "13px" },
                  }}
                >
                  {b?.title}
                </ListItemText>
              </MenuItem>
            );
          })}
        </Menu>
      </>
    );
  };

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
          onClick={handleExitDashboard}
          sx={{
            display: { xs: "flex", sm: "flex", md: "none" },
          }}
        >
          <ArrowBack />
        </IconButton>
        {isMobile && <NameBusineesChange />}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          {!isMobile && (
            <>
              <img
                src={LogoClassic}
                alt="logo"
                width={40}
                style={{ cursor: "pointer" }}
                onClick={handleExitDashboard}
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
                <NameBusineesChange />
              </Box>
            </>
          )}
        </Stack>

        {/* Desktop Tabs */}
        {!isMobile && (
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            {tabs.map((tab) => (
              <Badge
                key={tab.id}
                badgeContent={tab.badge || 0}
                color="error"
                sx={{ "& .MuiBadge-badge": { right: -3, top: 2 } }}
              >
                <Button
                  startIcon={tab.icon}
                  onClick={() => onTabChange(tab.id)}
                  sx={{
                    color:
                      activeTab === tab.id
                        ? "rgba(0,0,0,1)"
                        : "rgba(0,0,0,0.65)",

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
        )}

        {/* Actions */}
        <Stack direction="row" spacing={1} alignItems="center">
          {/* Notifications */}
          <IconButton>
            <Badge badgeContent={0} color="error">
              <Notifications />
            </Badge>
          </IconButton>

          {/* User Menu */}
          <IconButton onClick={handleMenuOpen}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: 36,
                height: 36,
                bgcolor: "primary.main",
                border: "2px solid rgba(255,255,255,0.2)",
              }}
            >
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={menuOpen}
            onClose={handleMenuClose}
            transformOrigin={{ horizontal: "right", vertical: "top" }}
            anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
            PaperProps={{
              sx: {
                minWidth: 220,
                mt: 1,
                borderRadius: 2,
              },
            }}
          >
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>
                {user?.name}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user?.email}
              </Typography>
            </Box>
            <Divider />

            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/perfil");
              }}
            >
              <ListItemIcon>
                <Person fontSize="small" />
              </ListItemIcon>
              <ListItemText>Mi Perfil</ListItemText>
            </MenuItem>

            <MenuItem
              onClick={() => {
                handleMenuClose();
                navigate("/explorar");
              }}
            >
              <ListItemIcon>
                <Store fontSize="small" />
              </ListItemIcon>
              <ListItemText>Regresar</ListItemText>
            </MenuItem>

            <Divider />

            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
              <ListItemIcon>
                <Logout fontSize="small" color="error" />
              </ListItemIcon>
              <ListItemText>Cerrar Sesión</ListItemText>
            </MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
