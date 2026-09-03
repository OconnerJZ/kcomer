import PropTypes from "prop-types";
import { Box, Button, CircularProgress, Grid, Paper, Stack, TextField, Typography } from "@mui/material";
import { LocationOnRounded, MyLocationRounded } from "@mui/icons-material";
import GoogleMapField from "@Shared/components/maps/GoogleMapField";
import { API_KEY_MAPS } from "@Shared/config/env";

export default function LocationSettingsTab({ locationInfo, setLocationInfo, onSave, loading }) {
  const handleMapChange = (location) => {
    setLocationInfo((current) => ({
      ...current,
      ...location,
      address: location.address || location.formatted_address || current.address || "",
      city: location.city ?? current.city ?? "",
      postalCode: location.postalCode ?? current.postalCode ?? "",
      latitude: location.latitude ?? current.latitude ?? "",
      longitude: location.longitude ?? current.longitude ?? "",
    }));
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: { xs: 2, sm: 3 },
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        bgcolor: "rgba(255,255,255,.9)",
      }}
    >
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}>
            UBICACIÓN
          </Typography>
          <Typography variant="h6" fontWeight={850}>Dónde encontrarte</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: .5, maxWidth: 700 }}>
            Coloca el marcador exactamente donde está tu negocio. Kcomer completará la dirección y podrás afinarla antes de guardar.
          </Typography>
        </Box>
        <Stack direction="row" spacing={1} alignItems="center" sx={{ color: "text.secondary" }}>
          <MyLocationRounded sx={{ fontSize: 18 }} />
          <Typography variant="caption">Puedes usar tu ubicación actual o mover el pin</Typography>
        </Stack>
      </Stack>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1.45fr) minmax(300px,.7fr)" }, gap: 3, alignItems: "start" }}>
        <GoogleMapField
          value={locationInfo}
          onChange={handleMapChange}
          label="Marca el punto exacto"
          apiKey={API_KEY_MAPS}
          height={{ xs: 300, sm: 360, lg: 420 }}
          compact
        />

        <Stack spacing={2}>
          <Box sx={{ pb: 2, borderBottom: "1px solid", borderColor: "divider" }}>
            <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
              <LocationOnRounded color="primary" fontSize="small" />
              <Typography variant="body2" fontWeight={850}>Dirección visible</Typography>
            </Stack>
            <Stack spacing={1.5}>
              <TextField
                size="small"
                label="Dirección"
                placeholder="Calle, número, colonia"
                value={locationInfo.address || ""}
                onChange={(e) => setLocationInfo((current) => ({ ...current, address: e.target.value }))}
                fullWidth
              />
              <Grid container spacing={1.5}>
                <Grid item xs={12} sm={7} lg={12}>
                  <TextField
                    size="small"
                    label="Ciudad"
                    value={locationInfo.city || ""}
                    onChange={(e) => setLocationInfo((current) => ({ ...current, city: e.target.value }))}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} sm={5} lg={12}>
                  <TextField
                    size="small"
                    label="Código postal"
                    value={locationInfo.postalCode || ""}
                    onChange={(e) => setLocationInfo((current) => ({ ...current, postalCode: e.target.value }))}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Stack>
          </Box>

          <Box sx={{ px: 1.5, py: 1.35, borderRadius: "10px", bgcolor: "rgba(46,173,103,.07)", borderLeft: "3px solid", borderColor: "success.main" }}>
            <Typography variant="caption" color="text.secondary">Coordenadas</Typography>
            <Typography variant="body2" fontWeight={750} sx={{ mt: .35 }}>
              {locationInfo.latitude && locationInfo.longitude
                ? `${Number(locationInfo.latitude).toFixed(6)}, ${Number(locationInfo.longitude).toFixed(6)}`
                : "Selecciona un punto en el mapa"}
            </Typography>
          </Box>

          <Button
            variant="contained"
            disableElevation
            onClick={onSave}
            disabled={loading || !locationInfo.latitude || !locationInfo.longitude}
            sx={{ borderRadius: 999, py: 1.1, textTransform: "none", fontWeight: 800 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar ubicación"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  );
}

LocationSettingsTab.propTypes = {
  locationInfo: PropTypes.shape({
    address: PropTypes.string,
    city: PropTypes.string,
    postalCode: PropTypes.string,
    latitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    longitude: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  }).isRequired,
  setLocationInfo: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};
