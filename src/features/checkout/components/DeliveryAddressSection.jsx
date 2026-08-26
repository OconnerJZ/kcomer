import { Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";

export default function DeliveryAddressSection({ addressType, onAddressTypeChange, form, errors, addresses, onChange, onNewAddressChange }) {
  const hasSavedAddresses = addresses.length > 0;
  const options = hasSavedAddresses
    ? [{ value: "saved", label: "Guardada" }, { value: "new", label: "Nueva" }]
    : [{ value: "new", label: "Nueva" }];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <span style={{ fontSize: 22 }}>📍</span>
        <Typography variant="subtitle1" fontWeight={600}>Dirección de entrega</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, p: 0.5, bgcolor: "#f5f5f5", borderRadius: 2, mb: 2 }}>
        {options.map((option) => {
          const selected = addressType === option.value;
          return (
            <Box
              key={option.value}
              onClick={() => onAddressTypeChange(option.value)}
              sx={{
                flex: 1,
                py: 1,
                px: 2,
                textAlign: "center",
                borderRadius: 1.5,
                cursor: "pointer",
                transition: "all 0.3s",
                bgcolor: selected ? "white" : "transparent",
                boxShadow: selected ? 2 : 0,
                "&:hover": { bgcolor: selected ? "white" : "#eeeeee" },
              }}
            >
              <Typography variant="body2" fontWeight={selected ? 600 : 400} color={selected ? "primary" : "text.secondary"}>
                {option.label}
              </Typography>
            </Box>
          );
        })}
      </Box>

      {addressType === "saved" && hasSavedAddresses && (
        <Select
          value={form.userAddressId}
          onChange={(e) => onChange("userAddressId", e.target.value)}
          fullWidth
          displayEmpty
          error={!!errors.userAddressId}
          size="medium"
        >
          <MenuItem value="" disabled>Selecciona una dirección</MenuItem>
          {addresses.map((addr) => (
            <MenuItem key={addr.id} value={addr.id}>
              <Box>
                <Typography variant="body2">{addr.street} #{addr.number}</Typography>
                {addr.references && <Typography variant="caption" color="text.secondary">{addr.references}</Typography>}
              </Box>
            </MenuItem>
          ))}
        </Select>
      )}

      {addressType === "new" && (
        <Stack spacing={1.5}>
          <TextField label="Calle" value={form.newAddress.street} onChange={(e) => onNewAddressChange("street", e.target.value)} fullWidth required error={!!errors.street} helperText={errors.street} size="small" />
          <TextField label="Número" value={form.newAddress.number} onChange={(e) => onNewAddressChange("number", e.target.value)} fullWidth required error={!!errors.number} helperText={errors.number} size="small" />
          <TextField label="Referencias (opcional)" value={form.newAddress.references} onChange={(e) => onNewAddressChange("references", e.target.value)} fullWidth placeholder="Ej: Entre calles X y Y" size="small" />
        </Stack>
      )}
    </Box>
  );
}
