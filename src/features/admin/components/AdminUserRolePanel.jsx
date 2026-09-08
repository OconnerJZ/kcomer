import { useState } from "react";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import { AdminPanelSettingsRounded } from "@mui/icons-material";
import { useUpdateAdminUserRoleMutation } from "../api/admin.api";
import { adminRoleCatalogPropType, adminUserPropType } from "../model/adminUserPropTypes";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible actualizar el rol";
const roleLabel = (value = "") => String(value).replaceAll("_", " ");

export default function AdminUserRolePanel({ user, roleCatalog }) {
  const currentRole = user.role?.name || "customer";
  const [role, setRole] = useState(currentRole);
  const [feedback, setFeedback] = useState(null);
  const [updateRole, updateState] = useUpdateAdminUserRoleMutation();

  const saveRole = async () => {
    try {
      setFeedback(null);
      await updateRole({ userId: user.id, role }).unwrap();
      setFeedback({ severity: "success", message: "Rol global actualizado." });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Stack spacing={0.35}>
          <Typography variant="overline" color="text.secondary">ROL GLOBAL</Typography>
          <Typography variant="h6" fontWeight={700}>Permisos de plataforma</Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Este rol controla privilegios globales. No modifica la función del usuario dentro de cada negocio.
        </Typography>

        <FormControl fullWidth size="small">
          <InputLabel id={`admin-user-role-${user.id}`}>Rol</InputLabel>
          <Select
            labelId={`admin-user-role-${user.id}`}
            label="Rol"
            value={role}
            onChange={(event) => setRole(event.target.value)}
          >
            {roleCatalog.map((entry) => (
              <MenuItem key={entry.id} value={entry.name} sx={{ textTransform: "capitalize" }}>
                {roleLabel(entry.name)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}

        <Button
          variant="contained"
          startIcon={<AdminPanelSettingsRounded />}
          onClick={saveRole}
          disabled={updateState.isLoading || role === currentRole}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
        >
          Guardar rol global
        </Button>
      </Stack>
    </Paper>
  );
}

AdminUserRolePanel.propTypes = {
  user: adminUserPropType.isRequired,
  roleCatalog: adminRoleCatalogPropType.isRequired,
};
