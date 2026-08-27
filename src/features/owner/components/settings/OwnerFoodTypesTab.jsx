import { Box, Button, Chip, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import CategoryRounded from "@mui/icons-material/CategoryRounded";
import CheckRounded from "@mui/icons-material/CheckRounded";

export default function OwnerFoodTypesTab({ availableFoodTypes = [], selectedFoodTypes = [], loadingCatalogs, onToggle, onSave, loading }) {
  const selectedIds = new Set((selectedFoodTypes || []).map(Number));

  return (
    <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 3.5, border: "1px solid", borderColor: "divider", bgcolor: "rgba(255,255,255,.9)" }}>
      <Stack direction="row" spacing={1.2} alignItems="center" sx={{ mb: .8 }}>
        <Box sx={{ width: 38, height: 38, borderRadius: 2.2, display: "grid", placeItems: "center", bgcolor: "rgba(255,171,64,.12)", color: "warning.dark" }}><CategoryRounded fontSize="small" /></Box>
        <Box>
          <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}>CATEGORÍAS</Typography>
          <Typography variant="h6" fontWeight={850}>Qué tipo de comida ofreces</Typography>
        </Box>
      </Stack>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5, maxWidth: 680 }}>
        Estas opciones vienen directamente del catálogo de tipos de comida. Las seleccionadas ayudan a que los clientes descubran tu negocio.
      </Typography>

      {loadingCatalogs ? (
        <Box sx={{ display: "grid", placeItems: "center", py: 5 }}><CircularProgress size={28} /></Box>
      ) : availableFoodTypes.length === 0 ? (
        <Box sx={{ p: 3, border: "1px dashed", borderColor: "divider", borderRadius: 3, textAlign: "center" }}>
          <Typography variant="body2" fontWeight={750}>No hay categorías disponibles</Typography>
          <Typography variant="caption" color="text.secondary">Revisa el catálogo /api/catalogs/food-types.</Typography>
        </Box>
      ) : (
        <Stack spacing={2.25}>
          <Box>
            <Typography variant="body2" fontWeight={800}>{selectedIds.size} seleccionadas</Typography>
            <Typography variant="caption" color="text.secondary">Toca una categoría para activarla o quitarla.</Typography>
          </Box>
          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {availableFoodTypes.map((type) => {
              const id = Number(type.id);
              const selected = selectedIds.has(id);
              return (
                <Chip
                  key={id}
                  label={type.label || `Categoría ${id}`}
                  icon={selected ? <CheckRounded /> : undefined}
                  clickable
                  onClick={() => onToggle(id)}
                  variant={selected ? "filled" : "outlined"}
                  sx={{
                    height: 38,
                    px: .4,
                    borderRadius: 999,
                    fontWeight: selected ? 800 : 650,
                    bgcolor: selected ? "rgba(255,75,69,.12)" : "background.paper",
                    color: selected ? "primary.dark" : "text.primary",
                    borderColor: selected ? "rgba(255,75,69,.30)" : "divider",
                    "& .MuiChip-icon": { color: "primary.main" },
                  }}
                />
              );
            })}
          </Box>
          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2.2, minWidth: 170 }}>
              {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar categorías"}
            </Button>
          </Stack>
        </Stack>
      )}
    </Paper>
  );
}
