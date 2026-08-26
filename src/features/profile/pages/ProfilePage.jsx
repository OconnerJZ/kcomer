import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import GeneralContent from "@Components/layout/GeneralContent";
import ProfileActions from "../components/ProfileActions";
import ProfileInfoCard from "../components/ProfileInfoCard";
import useProfile from "../hooks/useProfile";

export default function ProfilePage() {
  const {
    user,
    editMode,
    setEditMode,
    logoutDialogOpen,
    setLogoutDialogOpen,
    formData,
    loading,
    error,
    setError,
    success,
    setSuccess,
    handleChange,
    handleSave,
    handleLogout,
    navigate,
  } = useProfile();

  return (
    <GeneralContent title="Mi Perfil">
      <Box sx={{ maxWidth: 800, mx: "auto", mt: { xs: 2, sm: 4 }, px: 2 }}>
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
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {user?.name || "Usuario"}
              </Typography>
              <Typography color="text.secondary">{user?.email}</Typography>
            </Box>
          </Stack>
        </Paper>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError("")}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccess("")}>
            {success}
          </Alert>
        )}

        <ProfileInfoCard
          user={user}
          editMode={editMode}
          onToggleEdit={() => setEditMode((current) => !current)}
          formData={formData}
          onChange={handleChange}
          onSave={handleSave}
          loading={loading}
        />

        <ProfileActions
          user={user}
          onNavigate={navigate}
          onLogoutRequest={() => setLogoutDialogOpen(true)}
        />

        <Dialog open={logoutDialogOpen} onClose={() => setLogoutDialogOpen(false)}>
          <DialogTitle>Cerrar sesión</DialogTitle>
          <DialogContent>
            <Typography>¿Estás seguro de que deseas cerrar sesión?</Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setLogoutDialogOpen(false)}>No</Button>
            <Button onClick={handleLogout} color="error" variant="contained">
              Sí, estoy seguro
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </GeneralContent>
  );
}
