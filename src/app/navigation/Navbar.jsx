import * as React from "react";
import {
  AppBar,
  Box,
  CssBaseline,
  Toolbar,
  Typography,
  Button,
  BottomNavigation,
  BottomNavigationAction,
  Badge,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
} from "@mui/material";
import {
  Fastfood,
  Info,
  Store,
  ReceiptLong,
  Login as LoginIcon,
  Person,
  ShoppingBag,
  Logout,
  Dashboard,
} from "@mui/icons-material";
import LogoClassic from "/pwa-512x512.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@Features/cart/context/CartContext";
import { useAuth } from "@Features/auth/context/AuthContext";
import { isCustomer, isOwner } from "@Features/auth/model/roles";

const BASE_NAV_ITEMS = [
  { title: "Explorar", icon: <Fastfood />, link: "explorar" },
  { title: "Nosotros", icon: <Info />, link: "nosotros" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();

  const owner = isOwner(user);
  const customer = isCustomer(user);

  const navItems = React.useMemo(() => {
    const items = [...BASE_NAV_ITEMS];

    if (!isAuthenticated) {
      items.push({ title: "Registro", icon: <Store />, link: "registro" });
      items.push({ title: "Pedido", icon: <ReceiptLong />, link: "orden" });
      return items;
    }

    if (owner) {
      items.push({ title: "Negocio", icon: <Store />, link: "owner" });
      return items;
    }

    if (customer) {
      items.push({ title: "Registro", icon: <Store />, link: "registro" });
      items.push({ title: "Pedido", icon: <ReceiptLong />, link: "orden" });
    }

    return items;
  }, [customer, isAuthenticated, owner]);

  const [value, setValue] = React.useState(-1);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);
  const cartCount = getCartCount();

  React.useEffect(() => {
    const currentPath = location.pathname.split("/")[1];
    setValue(navItems.findIndex((item) => item.link === currentPath));
  }, [location.pathname, navItems]);

  const goFromMenu = (path) => {
    setAnchorEl(null);
    navigate(path);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  return (
    <Box>
      <CssBaseline />
      <AppBar component="nav" sx={{ backgroundColor: "rgba(255,255,255, 0.7)", backdropFilter: "blur(5px)", color: "#3a3b3d", display: { xs: "none", sm: "block" } }}>
        <Toolbar>
          <img src={LogoClassic} alt="logo" width={50} style={{ marginRight: 20, cursor: "pointer" }} onClick={() => navigate("/explorar")} />
          <Typography variant="h6" sx={{ flexGrow: 1 }} />
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {navItems.map((item) => (
              <Badge key={item.title} badgeContent={item.link === "orden" ? cartCount : 0} color="error" sx={{ "& .MuiBadge-badge": { right: -3, top: 2 } }}>
                <Button sx={{ color: "#000", textTransform: "none" }} startIcon={item.icon} onClick={() => navigate(`/${item.link}`)}>
                  {item.title}
                </Button>
              </Badge>
            ))}

            {isAuthenticated ? (
              <>
                <IconButton onClick={(event) => setAnchorEl(event.currentTarget)}>
                  <Avatar src={user?.avatar} sx={{ width: 32, height: 32, bgcolor: "primary.main" }}>{user?.name?.charAt(0)}</Avatar>
                </IconButton>
                <Menu anchorEl={anchorEl} open={menuOpen} onClose={() => setAnchorEl(null)} transformOrigin={{ horizontal: "right", vertical: "top" }} anchorOrigin={{ horizontal: "right", vertical: "bottom" }} PaperProps={{ sx: { minWidth: 200, mt: 1 } }}>
                  <MenuItem disabled>
                    <ListItemText primary={user?.name} secondary={user?.email} primaryTypographyProps={{ fontWeight: 600, fontSize: "0.9rem" }} secondaryTypographyProps={{ fontSize: "0.75rem" }} />
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => goFromMenu("/perfil")}><ListItemIcon><Person fontSize="small" /></ListItemIcon><ListItemText>Mi Perfil</ListItemText></MenuItem>
                  {customer && <MenuItem onClick={() => goFromMenu("/mis-ordenes")}><ListItemIcon><ShoppingBag fontSize="small" /></ListItemIcon><ListItemText>Mis Órdenes</ListItemText></MenuItem>}
                  {owner && <MenuItem onClick={() => goFromMenu("/owner")}><ListItemIcon><Dashboard fontSize="small" /></ListItemIcon><ListItemText>Panel de Negocio</ListItemText></MenuItem>}
                  <Divider />
                  <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}><ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon><ListItemText>Cerrar Sesión</ListItemText></MenuItem>
                </Menu>
              </>
            ) : (
              <Button variant="outlined" startIcon={<LoginIcon />} onClick={() => navigate("/login")} sx={{ ml: 1 }}>Entrar</Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      <Box sx={{ width: "100%", height: "9%", position: "fixed", bottom: 0, left: 0, zIndex: 1000, display: { xs: "flex", sm: "none" }, borderTop: "1px solid #e0e0e0", backgroundColor: "#fff" }}>
        <BottomNavigation showLabels value={value} onChange={(_, newValue) => { const toGo = navItems[newValue]?.link; if (!toGo) return; setValue(newValue); navigate(`/${toGo}`); }} sx={{ width: "100%", "& .MuiBottomNavigationAction-root": { minWidth: "auto" } }}>
          {navItems.map((item) => (
            <BottomNavigationAction key={item.title} label={item.title} icon={<Badge badgeContent={item.link === "orden" ? cartCount : 0} color="error">{item.icon}</Badge>} />
          ))}
          <BottomNavigationAction label={isAuthenticated ? "Perfil" : "Entrar"} icon={isAuthenticated ? <Avatar src={user?.avatar} sx={{ width: 24, height: 24, bgcolor: "primary.main" }}>{user?.name?.charAt(0)}</Avatar> : <LoginIcon />} onClick={() => navigate(isAuthenticated ? "/perfil" : "/login/perfil")} />
        </BottomNavigation>
      </Box>
    </Box>
  );
}
