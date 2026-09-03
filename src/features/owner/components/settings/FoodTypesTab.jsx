import PropTypes from "prop-types";
import {
  Box,
  Button,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";
import { Check, RestaurantMenu } from "@mui/icons-material";
import SettingsSection from "./SettingsSection";

const FoodTypesTab = ({
  availableFoodTypes,
  selectedFoodTypes,
  loadingCatalogs,
  onToggle,
  onSave,
  loading,
}) => {
  const selectedCount = selectedFoodTypes.length;

  return (
    <SettingsSection
      eyebrow="CATEGORÍAS"
      title="Qué tipo de comida ofreces"
      description="Estas categorías ayudan a descubrir tu negocio. Selecciona solo las que realmente representan tu menú."
    >
      {loadingCatalogs ? (
        <Box sx={{ display: "flex", justifyContent: "center", p: 4 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2.5}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            gap={1}
          >
            <Box>
              <Typography variant="h5" fontWeight={800} component="span">
                {selectedCount}
              </Typography>
              <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.75 }}>
                {selectedCount === 1 ? "categoría seleccionada" : "categorías seleccionadas"}
              </Typography>
            </Box>
            <Typography variant="caption" color="text.secondary">
              Puedes cambiar esto cuando evolucione tu menú.
            </Typography>
          </Stack>

          {availableFoodTypes.length === 0 ? (
            <Box
              sx={{
                py: 5,
                textAlign: "center",
                border: "1px dashed",
                borderColor: "divider",
                borderRadius: "10px",
              }}
            >
              <RestaurantMenu sx={{ color: "text.disabled", fontSize: 38, mb: 1 }} />
              <Typography variant="body2" fontWeight={800}>No hay categorías disponibles</Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2,minmax(0,1fr))",
                  lg: "repeat(3,minmax(0,1fr))",
                },
                gap: 1.25,
              }}
            >
              {availableFoodTypes.map((type) => {
                const selected = selectedFoodTypes.some(
                  (id) => String(id) === String(type.id),
                );
                return (
                  <Button
                    key={type.id}
                    onClick={() => onToggle(type.id)}
                    variant="outlined"
                    sx={{
                      minHeight: 64,
                      px: 1.5,
                      justifyContent: "space-between",
                      borderRadius: "10px",
                      borderColor: selected ? "rgba(255,159,28,.42)" : "divider",
                      bgcolor: selected ? "rgba(255,159,28,.07)" : "background.paper",
                      color: "text.primary",
                      "&:hover": {
                        borderColor: selected ? "secondary.main" : "text.disabled",
                        bgcolor: selected ? "rgba(255,159,28,.10)" : "grey.50",
                      },
                    }}
                  >
                    <Stack direction="row" spacing={1.2} alignItems="center">
                      <Box
                        sx={{
                          width: 34,
                          height: 34,
                          borderRadius: "10px",
                          display: "grid",
                          placeItems: "center",
                          bgcolor: selected ? "rgba(255,159,28,.12)" : "grey.100",
                          color: selected ? "secondary.dark" : "text.secondary",
                        }}
                      >
                        <RestaurantMenu fontSize="small" />
                      </Box>
                      <Typography variant="body2" fontWeight={700} textAlign="left">
                        {type.label || type.name}
                      </Typography>
                    </Stack>
                    {selected && <Check sx={{ color: "secondary.dark" }} fontSize="small" />}
                  </Button>
                );
              })}
            </Box>
          )}

          <Stack direction="row" justifyContent="flex-end">
            <Button
              variant="contained"
              disableElevation
              onClick={onSave}
              disabled={loading}
              sx={{ width: { xs: "100%", sm: "auto" }, minWidth: 160 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar categorías"}
            </Button>
          </Stack>
        </Stack>
      )}
    </SettingsSection>
  );
};

FoodTypesTab.propTypes = {
  availableFoodTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
    label: PropTypes.string,
  })).isRequired,
  selectedFoodTypes: PropTypes.arrayOf(
    PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  ).isRequired,
  loadingCatalogs: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default FoodTypesTab;
