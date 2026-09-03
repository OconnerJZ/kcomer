import { Alert, Box, MenuItem, Select, Stack, TextField, Typography } from "@mui/material";
import GoogleMapField from "@Shared/components/maps/GoogleMapField";
import { API_KEY_MAPS } from "@Shared/config/env";

export default function DeliveryAddressSection({ addressType, onAddressTypeChange, form, errors, addresses, onChange, onNewAddressChange }) {
  const hasSavedAddresses = addresses.length > 0;
  const options = hasSavedAddresses ? [{ value: "saved", label: "Guardada" }, { value: "new", label: "Nueva" }] : [{ value: "new", label: "Nueva" }];
  const selectedSaved = addresses.find((addr) => String(addr.id ?? addr.addressId) === String(form.userAddressId));

  const applyMapLocation = (location) => {
    const next = {
      ...form.newAddress,
      ...location,
      street: location.address || form.newAddress.street,
      address: location.address || location.formatted_address || form.newAddress.address,
      city: location.city || form.newAddress.city,
      postalCode: location.postalCode || form.newAddress.postalCode,
      state: location.state || form.newAddress.state,
    };
    Object.entries(next).forEach(([key, value]) => onNewAddressChange(key, value));
  };

  return <Box>
    <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em" }}>ENTREGA</Typography>
    <Typography variant="h6" fontWeight={600} sx={{ mb: .5 }}>¿Dónde entregamos?</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>Marca el punto exacto. La dirección escrita seguirá disponible para referencias y número exterior.</Typography>

    <Box sx={{ display: "flex", gap: 1, p: .5, bgcolor: "action.hover", borderRadius: "8px", mb: 2 }}>
      {options.map((option) => <Box key={option.value} onClick={() => onAddressTypeChange(option.value)} sx={{ flex: 1, py: .9, textAlign: "center", borderRadius: "8px", cursor: "pointer", bgcolor: addressType === option.value ? "background.paper" : "transparent", boxShadow: addressType === option.value ? "0 2px 7px rgba(0,0,0,.05)" : 0 }}><Typography variant="body2" fontWeight={addressType === option.value ? 600 : 500}>{option.label}</Typography></Box>)}
    </Box>

    {addressType === "saved" && hasSavedAddresses && <Stack spacing={1.5}>
      <Select value={form.userAddressId} onChange={(e) => onChange("userAddressId", e.target.value)} fullWidth displayEmpty error={!!errors.userAddressId}>
        <MenuItem value="" disabled>Selecciona una dirección</MenuItem>
        {addresses.map((addr) => <MenuItem key={addr.id ?? addr.addressId} value={addr.id ?? addr.addressId}>{addr.label || addr.address || `${addr.street || "Dirección"} ${addr.number || ""}`}</MenuItem>)}
      </Select>
      {selectedSaved && <GoogleMapField value={selectedSaved} onChange={() => {}} label="Punto guardado" apiKey={API_KEY_MAPS} height={220} compact />}
    </Stack>}

    {addressType === "new" && <Stack spacing={1.5}>
      <GoogleMapField value={form.newAddress} onChange={applyMapLocation} label="Selecciona el punto de entrega" apiKey={API_KEY_MAPS} height={260} compact />
      {errors.location && <Alert severity="error">{errors.location}</Alert>}
      <TextField label="Calle o dirección" value={form.newAddress.street || form.newAddress.address} onChange={(e) => onNewAddressChange("street", e.target.value)} fullWidth required error={!!errors.street} helperText={errors.street} size="small" />
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
        <TextField label="Número" value={form.newAddress.number} onChange={(e) => onNewAddressChange("number", e.target.value)} required error={!!errors.number} helperText={errors.number} size="small" sx={{ flex: 1 }} />
        <TextField label="Ciudad" value={form.newAddress.city} onChange={(e) => onNewAddressChange("city", e.target.value)} size="small" sx={{ flex: 1.4 }} />
      </Stack>
      <TextField label="Referencias" value={form.newAddress.references} onChange={(e) => onNewAddressChange("references", e.target.value)} fullWidth placeholder="Portón, color de casa, entre calles..." size="small" />
    </Stack>}
  </Box>;
}
