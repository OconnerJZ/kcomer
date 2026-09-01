import { Button, Paper, Stack, Typography } from "@mui/material";
import { AddBusinessRounded, GroupAdd, Logout, ShoppingBag, Store } from "@mui/icons-material";

export default function ProfileActions({ user, onNavigate, onLogoutRequest }) {
  const hasBusinessAccess = user?.role === "owner" || user?.role === "admin" || Boolean(user?.businesses?.length);

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>Acciones Rápidas</Typography>
      <Stack spacing={1.25}>
        <Button variant="outlined" startIcon={<ShoppingBag />} fullWidth onClick={() => onNavigate("/mis-ordenes")} sx={{ justifyContent: "flex-start", py: 1.5 }}>Mis Órdenes</Button>

        {hasBusinessAccess ? (
          <Button variant="outlined" startIcon={<Store />} fullWidth onClick={() => onNavigate("/owner")} sx={{ justifyContent: "flex-start", py: 1.5 }}>Panel de Negocio</Button>
        ) : (
          <Button
            variant="contained"
            disableElevation
            startIcon={<AddBusinessRounded />}
            fullWidth
            onClick={() => onNavigate("/crear-negocio")}
            sx={{ justifyContent: "flex-start", py: 1.5, borderRadius: 2.5 }}
          >
            Registrar mi negocio
          </Button>
        )}

        <Button variant="outlined" startIcon={<GroupAdd />} fullWidth onClick={() => onNavigate("/business-invitations")} sx={{ justifyContent: "flex-start", py: 1.5 }}>Unirme con un código</Button>

        <Button variant="outlined" color="error" startIcon={<Logout />} fullWidth onClick={onLogoutRequest} sx={{ justifyContent: "flex-start", py: 1.5 }}>Cerrar Sesión</Button>
      </Stack>
    </Paper>
  );
}
