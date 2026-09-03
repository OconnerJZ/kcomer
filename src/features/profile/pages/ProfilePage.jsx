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
import GeneralContent from "@Shared/components/layout/GeneralContent";
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
      <Box sx={{ maxWidth: 800, mx: "auto", py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2.5 } }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: "8px", border: "1px solid", borderColor: "divider" }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={{ xs: 1.5, sm: 3 }} alignItems="center" textAlign={{ xs: "center", sm: "left" }}>
            <Avatar
              src={user?.avatar}
              sx={{
                width: { xs: 76, sm: 100 },
                height: { xs: 76, sm: 100 },
                bgcolor: "primary.main",
                fontSize: "2.5rem",
              }}
            >
              {user?.name?.charAt(0) || "U"}
            </Avatar>

            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                {user?.name || "Usuario"}
              </Typography>
              <Typography color="text.secondary" sx={{ overflowWrap: "anywhere" }}>{user?.email}</Typography>
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
