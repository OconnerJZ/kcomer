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
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, mb: { xs: 2, sm: 3 }, borderRadius: "8px", border: "1px solid", borderColor: "divider" }}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.25} sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 600 }}>
          Información Personal
        </Typography>
        <Button startIcon={<Edit />} onClick={onToggleEdit} variant={editMode ? "outlined" : "contained"} sx={{ alignSelf: { xs: "stretch", sm: "center" } }}>
          {editMode ? "Cancelar" : "Editar"}
        </Button>
      </Stack>

      <Divider sx={{ mb: 3 }} />

      <Stack spacing={{ xs: 2, sm: 3 }}>
        <Stack direction="row" spacing={1.5} alignItems="center">
          <Person color="primary" />
          {editMode ? (
            <TextField name="name" label="Nombre completo" value={formData.name} onChange={onChange} fullWidth size="small" />
          ) : (
            <Box minWidth={0}>
              <Typography variant="caption" color="text.secondary">Nombre</Typography>
              <Typography variant="body1">{user?.name || "No especificado"}</Typography>
            </Box>
          )}
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Email color="primary" />
          <Box minWidth={0}>
            <Typography variant="caption" color="text.secondary">Correo electrónico</Typography>
            <Typography variant="body1" sx={{ overflowWrap: "anywhere" }}>{user?.email}</Typography>
          </Box>
        </Stack>

        <Stack direction="row" spacing={1.5} alignItems="center">
          <Phone color="primary" />
          {editMode ? (
            <TextField name="phone" label="Teléfono" value={formData.phone} onChange={onChange} fullWidth size="small" type="tel" />
          ) : (
            <Box minWidth={0}>
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
