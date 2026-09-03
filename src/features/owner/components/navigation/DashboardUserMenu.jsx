import { useState } from "react";
import {
  Avatar,
  Box,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { Logout, Person, Store } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import useAuth from "@Features/auth/context/useAuth";

const DashboardUserMenu = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const navigateTo = (path) => {
    setAnchorEl(null);
    navigate(path);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
    navigate("/login");
  };

  return (
    <>
      <IconButton
        aria-label="Abrir menú de usuario"
        onClick={(event) => setAnchorEl(event.currentTarget)}
      >
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
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ sx: { minWidth: 220, mt: 1, borderRadius: "8px" } }}
      >
        <Box sx={{ px: 2, py: 1.5 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 700 }}>{user?.name}</Typography>
          <Typography variant="caption" color="text.secondary">{user?.email}</Typography>
        </Box>
        <Divider />
        <MenuItem onClick={() => navigateTo("/perfil")}>
          <ListItemIcon><Person fontSize="small" /></ListItemIcon>
          <ListItemText>Mi Perfil</ListItemText>
        </MenuItem>
        <MenuItem onClick={() => navigateTo("/explorar")}>
          <ListItemIcon><Store fontSize="small" /></ListItemIcon>
          <ListItemText>Regresar</ListItemText>
        </MenuItem>
        <Divider />
        <MenuItem onClick={handleLogout} sx={{ color: "error.main" }}>
          <ListItemIcon><Logout fontSize="small" color="error" /></ListItemIcon>
          <ListItemText>Cerrar Sesión</ListItemText>
        </MenuItem>
      </Menu>
    </>
  );
};

export default DashboardUserMenu;
