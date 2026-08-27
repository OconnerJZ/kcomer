import { Box, Button, CircularProgress, Paper, Stack, TextField, Typography } from "@mui/material";
import LocationOnRounded from "@mui/icons-material/LocationOnRounded";
import GoogleMapField from "@Shared/components/maps/GoogleMapField";
import { API_KEY_MAPS } from "@Shared/config/env";

export default function OwnerLocationTab({ locationInfo, setLocationInfo, onSave, loading }) {
  const handleMapChange = (location) => {
    setLocationInfo((current) => ({
      ...current,
      ...location,
      address: location?.address ?? current.address,
      city: location?.city ?? current.city,
      postalCode: location?.postalCode ?? current.postalCode,
      latitude: location?.latitude ?? current.latitude,
      longitude: location?.longitude ?? current.longitude,
    }));
  };

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3.5, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255,255,255,.9)", overflow: "hidden" }}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: 0.75 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2.2, display: "grid", placeItems: "center", bgcolor: "rgba(255,75,69,.10)", color: "primary.main" }}><LocationOnRounded fontSize="small" /></Box>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}>UBICACIÓN</Typography>
          <Typography variant="h6" fontWeight={850}>Dónde encontrarte</Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 720 }}>
        Mueve el marcador o toca el mapa para precisar el punto. La dirección detectada se puede corregir antes de guardar.
      </Typography>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1.4fr) minmax(280px,.7fr)" }, gap: 2.5, alignItems: "start" }}>
        <Box sx={{ borderRadius: 3, overflow: "hidden", border: "1px solid", borderColor: "divider", boxShadow: "0 14px 38px rgba(35,29,26,.06)" }}>
          <GoogleMapField value={locationInfo} onChange={handleMapChange} label="Ubicación del negocio" apiKey={API_KEY_MAPS} height={390} compact />
        </Box>

        <Stack spacing={1.75} sx={{ p: { xs: 0, lg: 0.5 } }}>
          <TextField label="Dirección" placeholder="Calle, número, colonia" value={locationInfo.address || ""} onChange={(e) => setLocationInfo((current) => ({ ...current, address: e.target.value }))} multiline minRows={2} fullWidth />
          <TextField label="Ciudad" value={locationInfo.city || ""} onChange={(e) => setLocationInfo((current) => ({ ...current, city: e.target.value }))} fullWidth />
          <TextField label="Código postal" value={locationInfo.postalCode || ""} onChange={(e) => setLocationInfo((current) => ({ ...current, postalCode: e.target.value }))} fullWidth />
          {(locationInfo.latitude || locationInfo.longitude) && (
            <Box sx={{ px: 1.5, py: 1.1, borderRadius: 2, bgcolor: "rgba(255,75,69,.055)", border: "1px solid rgba(255,75,69,.12)" }}>
              <Typography variant="caption" color="text.secondary">Punto seleccionado</Typography>
              <Typography variant="body2" fontWeight={750}>{Number(locationInfo.latitude || 0).toFixed(5)}, {Number(locationInfo.longitude || 0).toFixed(5)}</Typography>
            </Box>
          )}
          <Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ alignSelf: "flex-end", textTransform: "none", borderRadius: 2.2, minWidth: 160 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar ubicación"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}
