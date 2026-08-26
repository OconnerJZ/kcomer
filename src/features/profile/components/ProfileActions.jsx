import { Button, Paper, Stack, Typography } from "@mui/material";
import { Logout, ShoppingBag, Store } from "@mui/icons-material";

export default function ProfileActions({ user, onNavigate, onLogoutRequest }) {
  return (
    <Paper sx={{ p: 3, borderRadius: 2 }} elevation={2}>
      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
        Acciones Rápidas
      </Typography>

      <Stack spacing={2}>
        <Button
          variant="outlined"
          startIcon={<ShoppingBag />}
          fullWidth
          onClick={() => onNavigate("/mis-ordenes")}
          sx={{ justifyContent: "flex-start", py: 1.5 }}
        >
          Mis Órdenes
        </Button>

        {user?.role === "owner" && (
          <Button
            variant="outlined"
            startIcon={<Store />}
            fullWidth
            onClick={() => onNavigate("/owner")}
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
          onClick={onLogoutRequest}
          sx={{ justifyContent: "flex-start", py: 1.5 }}
        >
          Cerrar Sesión
        </Button>
      </Stack>
    </Paper>
  );
}
