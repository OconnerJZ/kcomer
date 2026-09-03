import PropTypes from "prop-types";
import {
  Box,
  Button,
  Fade,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { StorefrontRounded } from "@mui/icons-material";
import FormField from "./FormField";
import Bg from "@Assets/images/qscome-bg-6.png";

const BusinessRegistrationWizard = ({
  currentTab,
  steps,
  step,
  formValues,
  setFormValues,
  errors,
  loading,
  loadingFoodTypes,
  onBack,
  onNext,
}) => (
  <Box
    sx={{
      minHeight: "calc(100vh - 64px)",
      py: { xs: 3, md: 5 },
      px: 2,
      backgroundImage: `linear-gradient(rgba(255,255,255,.78),rgba(255,255,255,.92)), url(${Bg})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    }}
  >
    <Paper
      elevation={0}
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: 720,
        overflow: "hidden",
        borderRadius: "10px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 18px 50px rgba(32,28,26,.10)",
        bgcolor: "rgba(255,255,255,.92)",
        backdropFilter: "blur(18px)",
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, sm: 4 },
          pb: 2,
          background: "linear-gradient(135deg,#201c1b 0%,#302724 100%)",
          color: "white",
        }}
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          alignItems={{ xs: "flex-start", sm: "center" }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: "10px",
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(255,159,28,.18)",
              color: "secondary.light",
            }}
          >
            <StorefrontRounded />
          </Box>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.65, letterSpacing: ".14em" }}>
              CREAR NEGOCIO
            </Typography>
            <Typography variant="h4" fontWeight={900}>Hazlo fácil de descubrir.</Typography>
          </Box>
        </Stack>
      </Box>

      <LinearProgress
        variant="determinate"
        value={((currentTab + 1) / steps.length) * 100}
        sx={{ height: 4 }}
      />
      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="caption" color="primary" fontWeight={800}>
          PASO {currentTab + 1} / {steps.length}
        </Typography>
        <Typography variant="h5" fontWeight={850}>{step.label}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
          {step.subtitle}
        </Typography>

        <Fade in key={currentTab} timeout={240}>
          <Box>
            {loadingFoodTypes && currentTab === 0 ? (
              <Typography color="text.secondary">Cargando tipos de comida...</Typography>
            ) : step.fields.map((field) => (
              <FormField
                key={field.name}
                field={field}
                formValues={formValues}
                setFormValues={setFormValues}
                error={errors[field.name]}
              />
            ))}
          </Box>
        </Fade>

        <Stack
          direction={{ xs: "column-reverse", sm: "row" }}
          gap={1}
          justifyContent="space-between"
          sx={{ mt: 4 }}
        >
          <Button onClick={onBack} disabled={currentTab === 0 || loading}>Anterior</Button>
          <Button
            variant="contained"
            disableElevation
            onClick={onNext}
            disabled={loading || loadingFoodTypes}
            sx={{ px: 3 }}
          >
            {loading
              ? "Guardando..."
              : currentTab === steps.length - 1 ? "Crear negocio" : "Continuar"}
          </Button>
        </Stack>
      </Box>
    </Paper>
  </Box>
);

BusinessRegistrationWizard.propTypes = {
  currentTab: PropTypes.number.isRequired,
  steps: PropTypes.arrayOf(PropTypes.object).isRequired,
  step: PropTypes.shape({
    label: PropTypes.string.isRequired,
    subtitle: PropTypes.string.isRequired,
    fields: PropTypes.arrayOf(PropTypes.object).isRequired,
  }).isRequired,
  formValues: PropTypes.object.isRequired,
  setFormValues: PropTypes.func.isRequired,
  errors: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired,
  loadingFoodTypes: PropTypes.bool.isRequired,
  onBack: PropTypes.func.isRequired,
  onNext: PropTypes.func.isRequired,
};

export default BusinessRegistrationWizard;
