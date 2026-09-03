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
      bgcolor: "background.default",
    }}
  >
    <Paper
      elevation={0}
      sx={{
        mx: "auto",
        width: "100%",
        maxWidth: 720,
        overflow: "hidden",
        borderRadius: "8px",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 3px 12px rgba(32,28,26,.07)",
        bgcolor: "background.paper",
      }}
    >
      <Box
        sx={{
          p: { xs: 2.5, sm: 4 },
          pb: 2,
          backgroundColor: "#34312D",
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
              borderRadius: "8px",
              display: "grid",
              placeItems: "center",
              bgcolor: "rgba(198,90,80,.16)",
              color: "#E6A39D",
            }}
          >
            <StorefrontRounded />
          </Box>
          <Box>
            <Typography variant="overline" sx={{ opacity: 0.65, letterSpacing: ".14em" }}>
              CREAR NEGOCIO
            </Typography>
            <Typography variant="h4" fontWeight={600}>Hazlo fácil de descubrir.</Typography>
          </Box>
        </Stack>
      </Box>

      <LinearProgress
        variant="determinate"
        value={((currentTab + 1) / steps.length) * 100}
        sx={{ height: 4 }}
      />
      <Box sx={{ p: { xs: 2.5, sm: 4 } }}>
        <Typography variant="caption" color="primary" fontWeight={600}>
          PASO {currentTab + 1} / {steps.length}
        </Typography>
        <Typography variant="h5" fontWeight={600}>{step.label}</Typography>
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
