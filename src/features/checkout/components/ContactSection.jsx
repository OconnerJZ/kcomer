import { Box, TextField, Typography } from "@mui/material";

export default function ContactSection({ form, errors, onChange }) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          Datos de contacto
        </Typography>
      </Box>

      <TextField
        label="Teléfono"
        value={form.customerPhone}
        onChange={(e) => onChange("customerPhone", e.target.value)}
        fullWidth
        required
        error={!!errors.customerPhone}
        helperText={errors.customerPhone}
        sx={{ mb: 3 }}
      />

      <TextField
        label="Notas adicionales"
        placeholder="¿Alguna instrucción especial? (opcional)"
        multiline
        rows={2}
        value={form.notes}
        onChange={(e) => onChange("notes", e.target.value)}
        fullWidth
      />
    </Box>
  );
}
