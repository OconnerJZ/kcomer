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
  Stack,
  Badge,
  Divider,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
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
  ArrowDropDownTwoTone,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useNotifications } from "@Features/notifications/context/NotificationContext";
import NotificationMenu from "@Features/notifications/components/NotificationMenu";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";
import LogoClassic from "/pwa-512x512.png";

const resolveMediaUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
};

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
  const { user, logout } = useAuth();
  const {
    notifications,
    unreadCount,
    unreadByBusiness,
    markAsRead,
    markBusinessAsRead,
    markAllAsRead,
  } = useNotifications();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [anchorEl, setAnchorEl] = useState(null);
  const [anchorElB, setAnchorElB] = useState(null);
  const [notificationAnchor, setNotificationAnchor] = useState(null);
  const menuOpen = Boolean(anchorEl);
  const menuOpenBusi = Boolean(anchorElB);

  const handleChange = (id) => {
    selectBusiness(id);
    markBusinessAsRead(id);
    setAnchorElB(null);
  };

  const handleNotificationSelect = (notification) => {
    markAsRead(notification.id);
    onNotificationNavigate?.({
      businessId: notification.businessId,
      orderId: notification.orderId,
    });
    setNotificationAnchor(null);
  };

  const tabs = [
    { id: 0, label: "Órdenes", icon: <Dashboard />, badge: pendingOrders },
    { id: 1, label: "Menú", icon: <Restaurant /> },
    { id: 2, label: "Reportes", icon: <Assessment /> },
    { id: 3, label: "Configuración", icon: <Settings /> },
  ];

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  const handleExitDashboard = () => navigate("/explorar");

  const BusinessSelector = () => (
    <>
      <Stack direction="row" alignItems="center">
        <Typography variant="subtitle2" sx={{ fontWeight: 600, color: "rgba(255, 75, 69, 1)", fontSize: "0.7rem" }}>
          {businessName}
        </Typography>
        {businesses.length > 1 && (
          <IconButton size="small" onClick={(event) => setAnchorElB(event.currentTarget)}>
            <ArrowDropDownTwoTone fontSize="medium" />
          </IconButton>
        )}
      </Stack>

      <Menu
        anchorEl={anchorElB}
        open={menuOpenBusi}
        onClose={() => setAnchorElB(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ sx: { minWidth: 260, maxHeight: 320, mt: 1, borderRadius: 2 } }}
      >
        {businesses.map((business) => {
          const selected = String(business.id) === String(selectedBusinessId);
          const unread = unreadByBusiness[String(business.id)] || 0;
          return (
            <MenuItem selected={selected} onClick={() => handleChange(business.id)} key={business.id ?? business.name}>
              <ListItemIcon>
                <Badge badgeContent={unread} color="error" max={99} overlap="circular">
                  <Avatar variant="rounded" src={resolveMediaUrl(business.logo)} alt={business.name || "Negocio"} sx={{ width: 32, height: 32 }}>
                    {business.name?.charAt(0)}
                  </Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText primary={business.name || "Negocio"} secondary={selected ? "Negocio activo" : unread ? `${unread} sin leer` : undefined} />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );

  return (
    <AppBar position="fixed" sx={{ backgroundColor: "rgba(255, 255, 255, 0.8)", backdropFilter: "blur(10px)", borderBottom: "1px solid rgba(255, 255, 255, 0.1)" }}>
      <Toolbar>
        <IconButton onClick={handleExitDashboard} sx={{ display: { xs: "flex", sm: "flex", md: "none" } }}><ArrowBack /></IconButton>
        {isMobile && <BusinessSelector />}

        <Stack direction="row" spacing={2} alignItems="center" sx={{ flex: 1 }}>
          {!isMobile && (
            <>
              <img src={LogoClassic} alt="logo" width={40} style={{ cursor: "pointer" }} onClick={handleExitDashboard} />
              <Divider orientation="vertical" flexItem sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />
              <Box>
                <Typography variant="subtitle2" sx={{ color: "rgba(0,0,0,0.7)", fontSize: "0.75rem" }}>Panel de Negocio</Typography>
                <BusinessSelector />
              </Box>
            </>
          )}
        </Stack>

        {!isMobile && (
          <Stack direction="row" spacing={1} sx={{ mr: 2 }}>
            {tabs.filter((tab) => allowedTabs.includes(tab.id)).map((tab) => (
              <Badge key={tab.id} badgeContent={tab.badge || 0} color="error" sx={{ "& .MuiBadge-badge": { right: -3, top: 2 } }}>
                <Button startIcon={tab.icon} onClick={() => onTabChange(tab.id)} sx={{ color: activeTab === tab.id ? "rgba(0,0,0,1)" : "rgba(0,0,0,0.65)", textTransform: "none", fontWeight: activeTab === tab.id ? 600 : 300, borderRadius: 0, px: 2 }}>
                  {tab.label}
                </Button>
              </Badge>
            ))}
          </Stack>
        )}

        <Stack direction="row" spacing={1} alignItems="center">
          <IconButton onClick={(event) => setNotificationAnchor(event.currentTarget)} aria-label="notificaciones">
            <Badge badgeContent={unreadCount} color="error" max={99}>
              <Notifications />
            </Badge>
          </IconButton>

          <NotificationMenu
            anchorEl={notificationAnchor}
            open={Boolean(notificationAnchor)}
            onClose={() => setNotificationAnchor(null)}
            notifications={notifications}
            onSelect={handleNotificationSelect}
            onMarkAllRead={markAllAsRead}
          />

          <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
            <Avatar src={user?.avatar} sx={{ width: 36, height: 36, bgcolor: "primary.main", border: "2px solid rgba(255,255,255,0.2)" }}>
              {user?.name?.charAt(0)}
            </Avatar>
          </IconButton>

          <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} PaperProps={{ sx: { minWidth: 220, mt: 1, borderRadius: 2 } }}>
            <Box sx={{ px: 2, py: 1.5 }}>
              <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
              <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
            </Box>
            <Divider />
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/perfil"); }}><ListItemIcon><Person fontSize="small" /></ListItemIcon><ListItemText>Mi Perfil</ListItemText></MenuItem>
            <MenuItem onClick={() => { setAnchorEl(null); navigate("/explorar"); }}><ListItemIcon><Store fontSize="small" /></ListItemIcon><ListItemText>Regresar</ListItemText></MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}><ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon><ListItemText>Cerrar Sesión</ListItemText></MenuItem>
          </Menu>
        </Stack>
      </Toolbar>
    </AppBar>
  );
};

export default DashboardNavbar;
