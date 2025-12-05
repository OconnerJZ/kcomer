// src/components/layout/Navbar.jsx
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
  Divider,
} from "@mui/material";
import {
  Fastfood,
  Info,
  Store,
  ReceiptLong,
  Login as LoginIcon,
  Logout,
  Dashboard,
} from "@mui/icons-material";
import LogoClassic from "@Assets/images/qscomeLogo.png";
import { useNavigate, useLocation } from "react-router-dom";
import { useCart } from "@Hooks/components/useCart";
import { useAuth } from "@Context/AuthContext";

const navItems = [
  { title: "Explorar", icon: <Fastfood />, link: "explorar" },
  { title: "Nosotros", icon: <Info />, link: "nosotros" },
  { title: "Registro", icon: <Store />, link: "registro" },
  { title: "Pedido", icon: <ReceiptLong />, link: "orden" }
];

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { getCartCount } = useCart();
  const { user, isAuthenticated, logout } = useAuth();
  
  const [value, setValue] = React.useState(() => {
    const currentPath = location.pathname.split('/')[1];
    return navItems.findIndex(item => item.link === currentPath);
  });

  const [anchorEl, setAnchorEl] = React.useState(null);
  const menuOpen = Boolean(anchorEl);

  const cartCount = getCartCount();

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/explorar');
  };

  return (
    <Box>
      <CssBaseline />
      
      {/* Desktop Navbar */}
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "rgba(255,255,255, 0.7)",
          backdropFilter: "blur(5px)",
          color: "#3a3b3d",
          display: { xs: "none", sm: "block" },
        }}
      >
        <Toolbar>
          <img 
            src={LogoClassic} 
            alt="logo" 
            width={50} 
            style={{ marginRight: 20, cursor: 'pointer' }} 
            onClick={() => navigate('/explorar')}
          />

          <Typography variant="h6" sx={{ flexGrow: 1 }}></Typography>

          {/* Nav Items */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {navItems.map((item) => (
              <Badge 
                key={item.title}
                badgeContent={item.link === 'orden' ? cartCount : 0}
                color="error"
                sx={{ '& .MuiBadge-badge': { right: -3, top: 2 } }}
              >
                <Button
                  sx={{ color: "#000", textTransform: "none" }}
                  startIcon={item.icon}
                  onClick={() => navigate(item.link)}
                >
                  {item.title}
                </Button>
              </Badge>
            ))}

            {/* User Menu */}
            {isAuthenticated ? (
              <>
                <IconButton onClick={handleMenuOpen}>
                  <Avatar 
                    src={user?.avatar} 
                    sx={{ width: 32, height: 32, bgcolor: 'primary.main' }}
                  >
                    {user?.name?.charAt(0)}
                  </Avatar>
                </IconButton>
                
                <Menu
                  anchorEl={anchorEl}
                  open={menuOpen}
                  onClose={handleMenuClose}
                  onClick={handleMenuClose}
                >
                  <MenuItem disabled>
                    <Typography variant="body2" color="text.secondary">
                      {user?.email}
                    </Typography>
                  </MenuItem>
                  <Divider />
                  <MenuItem onClick={() => navigate('/mis-ordenes')}>
                    <ReceiptLong fontSize="small" sx={{ mr: 1 }} />
                    Mis Órdenes
                  </MenuItem>
                  {user?.role === 'business' && (
                    <MenuItem onClick={() => navigate('/business-dashboard')}>
                      <Dashboard fontSize="small" sx={{ mr: 1 }} />
                      Panel de Negocio
                    </MenuItem>
                  )}
                  <Divider />
                  <MenuItem onClick={handleLogout}>
                    <Logout fontSize="small" sx={{ mr: 1 }} />
                    Cerrar Sesión
                  </MenuItem>
                </Menu>
              </>
            ) : (
              <Button
                variant="outlined"
                startIcon={<LoginIcon />}
                onClick={() => navigate('/login')}
                sx={{ ml: 1 }}
              >
                Entrar
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Mobile Bottom Navigation */}
      <Box
        sx={{
          width: "100%",
          height: "9%",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          display: { xs: "flex", sm: "none" },
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(navItems[newValue].link);
          }}
          sx={{
            width: "100%",
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
            },
          }}
        >
          {navItems.map((item, idx) => (
            <BottomNavigationAction
              key={item.title}
              label={item.title}
              icon={
                <Badge 
                  badgeContent={item.link === 'orden' ? cartCount : 0}
                  color="error"
                >
                  {item.icon}
                </Badge>
              }
            />
          ))}
          
          {/* User icon for mobile */}
          <BottomNavigationAction
            label={isAuthenticated ? "Perfil" : "Entrar"}
            icon={
              isAuthenticated ? (
                <Avatar 
                  src={user?.avatar} 
                  sx={{ width: 24, height: 24, bgcolor: 'primary.main' }}
                >
                  {user?.name?.charAt(0)}
                </Avatar>
              ) : (
                <LoginIcon />
              )
            }
            onClick={(e) => {
              if (isAuthenticated) {
                handleMenuOpen(e);
              } else {
                navigate('/login');
              }
            }}
          />
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Navbar;