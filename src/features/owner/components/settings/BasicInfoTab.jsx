import PropTypes from "prop-types";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import { Business, Edit } from "@mui/icons-material";
import SettingsSection from "./SettingsSection";

const BasicInfoTab = ({
  basicInfo,
  setBasicInfo,
  logoFile,
  logoPreview,
  onLogoChange,
  onSave,
  loading,
}) => (
  <SettingsSection
    eyebrow="IDENTIDAD"
    title="Información general"
    description="Define cómo se presenta tu negocio y los datos base que utiliza Kcomer durante la operación."
  >
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "1fr", md: "220px minmax(0,1fr)" },
        gap: 3.5,
        alignItems: "start",
      }}
    >
      <Box
        sx={{
          p: 2.5,
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 3,
          textAlign: "center",
          bgcolor: "rgba(248,248,248,.7)",
        }}
      >
        <Avatar
          src={logoPreview || basicInfo.logo}
          sx={{
            width: 112,
            height: 112,
            mx: "auto",
            mb: 2,
            bgcolor: "grey.100",
            color: "text.secondary",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <Business sx={{ fontSize: 42 }} />
        </Avatar>
        <Typography variant="body2" fontWeight={800}>Logo del negocio</Typography>
        <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4, mb: 1.75 }}>
          Ideal en formato cuadrado, hasta 5 MB.
        </Typography>
        <Button
          variant="outlined"
          component="label"
          startIcon={<Edit />}
          sx={{ textTransform: "none", borderRadius: 2 }}
        >
          {logoFile ? "Cambiar logo" : "Actualizar logo"}
          <input type="file" hidden accept="image/*" onChange={onLogoChange} />
        </Button>
      </Box>

      <Stack spacing={2.1}>
        <TextField
          label="Nombre del negocio"
          value={basicInfo.name}
          onChange={(event) => setBasicInfo({ ...basicInfo, name: event.target.value })}
          fullWidth
          required
        />
        <TextField
          label="Descripción"
          value={basicInfo.description}
          onChange={(event) => setBasicInfo({ ...basicInfo, description: event.target.value })}
          multiline
          minRows={3}
          maxRows={5}
          fullWidth
        />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono"
              value={basicInfo.phone}
              onChange={(event) => setBasicInfo({ ...basicInfo, phone: event.target.value })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              type="email"
              value={basicInfo.email}
              onChange={(event) => setBasicInfo({ ...basicInfo, email: event.target.value })}
              fullWidth
            />
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Preparación estimada"
              helperText="Minutos promedio de cocina"
              type="number"
              value={basicInfo.prepTimeMin}
              onChange={(event) => setBasicInfo({
                ...basicInfo,
                prepTimeMin: parseInt(event.target.value, 10) || 0,
              })}
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Entrega estimada"
              helperText="Minutos promedio hasta el cliente"
              type="number"
              value={basicInfo.estimatedDeliveryMin}
              onChange={(event) => setBasicInfo({
                ...basicInfo,
                estimatedDeliveryMin: parseInt(event.target.value, 10) || 0,
              })}
              fullWidth
            />
          </Grid>
        </Grid>
        <Box sx={{ px: 1.5, py: 1.1, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <FormControlLabel
            sx={{ m: 0, width: "100%", justifyContent: "space-between", flexDirection: "row-reverse" }}
            control={(
              <Switch
                checked={basicInfo.open}
                onChange={(event) => setBasicInfo({ ...basicInfo, open: event.target.checked })}
              />
            )}
            label={(
              <Box>
                <Typography variant="body2" fontWeight={800}>
                  {basicInfo.open ? "Negocio abierto" : "Negocio cerrado"}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {basicInfo.open
                    ? "Tus clientes pueden ver el negocio como disponible."
                    : "El negocio se mostrará temporalmente cerrado."}
                </Typography>
              </Box>
            )}
          />
        </Box>
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            disableElevation
            onClick={onSave}
            disabled={loading}
            sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 150 }}
          >
            {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar cambios"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  </SettingsSection>
);

BasicInfoTab.propTypes = {
  basicInfo: PropTypes.shape({
    name: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    phone: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    prepTimeMin: PropTypes.number.isRequired,
    estimatedDeliveryMin: PropTypes.number.isRequired,
    open: PropTypes.bool.isRequired,
    logo: PropTypes.string,
  }).isRequired,
  setBasicInfo: PropTypes.func.isRequired,
  logoFile: PropTypes.object,
  logoPreview: PropTypes.string,
  onLogoChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default BasicInfoTab;
