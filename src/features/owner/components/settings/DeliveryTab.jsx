import PropTypes from "prop-types";
import {
  Box,
  Button,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { LocalShipping } from "@mui/icons-material";
import SettingsSection from "./SettingsSection";

const DeliveryTab = ({ deliverySettings, setDeliverySettings, onSave, loading }) => {
  const radius = Number(deliverySettings.deliveryRadiusKm || 0);
  const fee = Number(deliverySettings.deliveryFee || 0);
  const minimum = Number(deliverySettings.minOrderAmount || 0);
  const eta = Number(deliverySettings.estimatedTimeMin || 0);

  const updateSetting = (field, value) => {
    setDeliverySettings({ ...deliverySettings, [field]: value });
  };

  return (
    <SettingsSection
      eyebrow="DELIVERY"
      title="Entrega a domicilio"
      description="Configura lo que el cliente necesita saber antes de ordenar: cobertura, costo, mínimo y tiempo estimado."
    >
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "minmax(0,1fr) 300px" }, gap: 3 }}>
        <Stack spacing={2}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Radio de entrega"
                type="number"
                value={deliverySettings.deliveryRadiusKm}
                onChange={(event) => updateSetting(
                  "deliveryRadiusKm",
                  parseFloat(event.target.value) || 0,
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Tiempo estimado"
                type="number"
                value={deliverySettings.estimatedTimeMin}
                onChange={(event) => updateSetting(
                  "estimatedTimeMin",
                  parseInt(event.target.value, 10) || 0,
                )}
                fullWidth
              />
            </Grid>
          </Grid>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                label="Costo de envío"
                type="number"
                value={deliverySettings.deliveryFee}
                onChange={(event) => updateSetting(
                  "deliveryFee",
                  parseFloat(event.target.value) || 0,
                )}
                fullWidth
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <TextField
                label="Monto mínimo"
                type="number"
                value={deliverySettings.minOrderAmount}
                onChange={(event) => updateSetting(
                  "minOrderAmount",
                  parseFloat(event.target.value) || 0,
                )}
                fullWidth
              />
            </Grid>
          </Grid>
          <Box sx={{ p: 1.5, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
            <FormControlLabel
              sx={{ m: 0, width: "100%", justifyContent: "space-between", flexDirection: "row-reverse" }}
              control={(
                <Switch
                  checked={deliverySettings.useOwnDelivery}
                  onChange={(event) => updateSetting("useOwnDelivery", event.target.checked)}
                />
              )}
              label={(
                <Box>
                  <Typography variant="body2" fontWeight={800}>Repartidores propios</Typography>
                  <Typography variant="caption" color="text.secondary">
                    Tu negocio gestiona directamente las entregas.
                  </Typography>
                </Box>
              )}
            />
          </Box>
          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              onClick={onSave}
              disabled={loading}
              sx={{ width: { xs: "100%", sm: "auto" } }}
            >
              Guardar delivery
            </Button>
          </Stack>
        </Stack>

        <Box
          sx={{
            p: 2.25,
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
            bgcolor: "rgba(255,159,28,.06)",
          }}
        >
          <Stack direction="row" spacing={1}>
            <LocalShipping sx={{ color: "secondary.dark" }} />
            <Typography fontWeight={800}>Vista para el cliente</Typography>
          </Stack>
          <Typography variant="h6" fontWeight={800} sx={{ mt: 2 }}>{radius} km</Typography>
          <Typography variant="body2">Envío: {fee ? `$${fee.toFixed(2)}` : "Sin costo"}</Typography>
          <Typography variant="body2">Tiempo: {eta} min</Typography>
          <Typography variant="body2">
            Mínimo: {minimum ? `$${minimum.toFixed(2)}` : "Sin mínimo"}
          </Typography>
        </Box>
      </Box>
    </SettingsSection>
  );
};

DeliveryTab.propTypes = {
  deliverySettings: PropTypes.shape({
    deliveryRadiusKm: PropTypes.number.isRequired,
    deliveryFee: PropTypes.number.isRequired,
    minOrderAmount: PropTypes.number.isRequired,
    estimatedTimeMin: PropTypes.number.isRequired,
    useOwnDelivery: PropTypes.bool.isRequired,
  }).isRequired,
  setDeliverySettings: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default DeliveryTab;
