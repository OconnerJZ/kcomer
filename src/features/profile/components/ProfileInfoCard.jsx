import { Box, Button, Divider, Paper, Stack, TextField, Typography } from "@mui/material";
import { Edit, Email, Person, Phone } from "@mui/icons-material";

export default function ProfileInfoCard({
  user,
  editMode,
  onToggleEdit,
  formData,
  onChange,
  onSave,
  loading,
}) {
  return (
    <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }} elevation={2}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Información Personal
        </Typography>
        <Button startIcon={<Edit />} onClick={onToggleEdit} variant={editMode ? "outlined" : "contained"}>
          {editMode ? "Cancelar" : "Editar"}
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={3}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Person color="primary" />
          {editMode ? (
            <TextField name="name" label="Nombre completo" value={formData.name} onChange={onChange} fullWidth size="small" />
          ) : (
            <Box>
              <Typography variant="caption" color="text.secondary">Nombre</Typography>
              <Typography variant="body1">{user?.name || "No especificado"}</Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Email color="primary" />
          <Box>
            <Typography variant="caption" color="text.secondary">Correo electrónico</Typography>
            <Typography variant="body1">{user?.email}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={2} alignItems="center">
          <Phone color="primary" />
          {editMode ? (
            <TextField name="phone" label="Teléfono" value={formData.phone} onChange={onChange} fullWidth size="small" type="tel" />
          ) : (
            <Box>
              <Typography variant="caption" color="text.secondary">Teléfono</Typography>
              <Typography variant="body1">{user?.phone || "No especificado"}</Typography>
            </Box>
          )}
        </Stack>

        {editMode && (
          <Button variant="contained" onClick={onSave} disabled={loading} fullWidth sx={{ mt: 2 }}>
            {loading ? "Guardando..." : "Guardar Cambios"}
          </Button>
        )}
      </Stack>
    </Paper>
  );
}
