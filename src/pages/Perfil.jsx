// src/pages/Perfil.jsx
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Avatar,
  Button,
  TextField,
  Stack,
  Divider,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Alert,
  Chip,
} from "@mui/material";
import {
  Edit,
  Logout,
  Person,
  Email,
  Phone,
  ShoppingBag,
  Store,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GeneralContent from "@Components/layout/GeneralContent";
import { useAuth } from "@Context/AuthContext";

const Perfil = () => {
  const navigate = useNavigate();
  const { user, logout, updateUser } = useAuth();

  const [editMode, setEditMode] = useState(false);
  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      // Actualizar usuario
      await updateUser({
        name: formData.name,
        phone: formData.phone,
      });

      setSuccess("Perfil actualizado exitosamente");
      setEditMode(false);
    } catch (err) {
      setError("Error al actualizar el perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    setLogoutDialogOpen(false);
    navigate("/login");
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: "error",
      owner: "warning",
      customer: "primary",
      delivery: "info",
    };
    return colors[role] || "default";
  };

  const getRoleLabel = (role) => {
    const labels = {
      admin: "Administrador",
      owner: "Propietario",
      customer: "Cliente",
      delivery: "Repartidor",
    };
    return labels[role] || role;
  };

  return (
    <GeneralContent title="Mi Perfil">
      <Box sx={{ maxWidth: 800, mx: "auto", mt: { xs: 2, sm: 4 }, px: 2 }}>
        {/* Header con Avatar */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={3}>
          <Stack direction="row" spacing={3} alignItems="center">
            <Avatar
              src={user?.avatar}
              sx={{
                width: 100,
                height: 100,
                bgcolor: "primary.main",
                fontSize: "2.5rem",
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>

            <Box sx={{ flex: 1 }}>
              <Stack
                direction="row"
                spacing={1}
                alignItems="center"
                sx={{ mb: 1 }}
              >
                <Typography variant="h4" sx={{ fontWeight: 700 }}>
                  {user?.name || "Usuario"}
                </Typography>
                
              </Stack>
              <Typography color="text.secondary">{user?.email}</Typography>
            </Box>
          </Stack>
        </Paper>

        {/* Mensajes */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}
        {success && (
          <Alert
            severity="success"
            sx={{ mb: 2 }}
            onClose={() => setSuccess("")}
          >
            {success}
          </Alert>
        )}

        {/* Información Personal */}
        <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mb: 2 }}
          >
            <Typography variant="h6" sx={{ fontWeight: 600 }}>
              Información Personal
            </Typography>
            <Button
              startIcon={<Edit />}
              onClick={() => setEditMode(!editMode)}
              variant={editMode ? "outlined" : "contained"}
            >
              {editMode ? "Cancelar" : "Editar"}
            </Button>
          </Stack>

          <Divider sx={{ mb: 3 }} />

          <Stack spacing={3}>
            {/* Nombre */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Person color="primary" />
              {editMode ? (
                <TextField
                  name="name"
                  label="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Nombre
                  </Typography>
                  <Typography variant="body1">
                    {user?.name || "No especificado"}
                  </Typography>
                </Box>
              )}
            </Stack>

            {/* Email (no editable) */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Email color="primary" />
              <Box>
                <Typography variant="caption" color="text.secondary">
                  Correo electrónico
                </Typography>
                <Typography variant="body1">{user?.email}</Typography>
              </Box>
            </Stack>

            {/* Teléfono */}
            <Stack direction="row" spacing={2} alignItems="center">
              <Phone color="primary" />
              {editMode ? (
                <TextField
                  name="phone"
                  label="Teléfono"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  size="small"
                  type="tel"
                />
              ) : (
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Teléfono
                  </Typography>
                  <Typography variant="body1">
                    {user?.phone || "No especificado"}
                  </Typography>
                </Box>
              )}
            </Stack>

            {editMode && (
              <Button
                variant="contained"
                onClick={handleSave}
                disabled={loading}
                fullWidth
                sx={{ mt: 2 }}
              >
                {loading ? "Guardando..." : "Guardar Cambios"}
              </Button>
            )}
          </Stack>
        </Paper>

        {/* Acciones Rápidas */}
        <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
          <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
            Acciones Rápidas
          </Typography>

          <Stack spacing={2}>
            <Button
              variant="outlined"
              startIcon={<ShoppingBag />}
              fullWidth
              onClick={() => navigate("/mis-ordenes")}
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              Mis Órdenes
            </Button>

            {user?.role === "owner" && (
              <Button
                variant="outlined"
                startIcon={<Store />}
                fullWidth
                onClick={() => navigate("/business-dashboard")}
                sx={{ justifyContent: "flex-start", py: 1.5 }}
              >
                Panel de Negocio
              </Button>
            )}

            <Button
              variant="outlined"
              color="error"
              startIcon={<Logout />}
              fullWidth
              onClick={() => setLogoutDialogOpen(true)}
              sx={{ justifyContent: "flex-start", py: 1.5 }}
            >
              Cerrar Sesión
            </Button>
          </Stack>
        </Paper>

        {/* Dialog de Confirmación de Logout */}
        <Dialog
          open={logoutDialogOpen}
          onClose={() => setLogoutDialogOpen(false)}
        >
          <DialogTitle>Cerrar sesión</DialogTitle>
          <DialogContent>
            <Typography>¿Estás seguro de que deseas cerrar sesión?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialogOpen(false)}>No</Button>
            <Button onClick={handleLogout} color="error" variant="contained">
              Si, estoy seguro
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </GeneralContent>
  );
};

export default Perfil;
