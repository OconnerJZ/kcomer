import PropTypes from "prop-types";
import { Add, Restaurant } from "@mui/icons-material";
import { Box, Button, CircularProgress, Paper, Stack, Typography } from "@mui/material";

export const OwnerMenuHeader = ({ onCreate }) => (
  <Box sx={{ pb: { xs: 2, sm: 2.5 }, mb: 2.5, borderBottom: "1px solid", borderColor: "divider" }}>
    <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={2}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: "0.16em", fontSize: "0.68rem" }}>Menú del negocio</Typography>
        <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: "-0.02em" }}>Tu catálogo, simple y vivo</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>Actualiza disponibilidad, precios, presentación y opciones de personalización.</Typography>
      </Box>
      <Button variant="contained" startIcon={<Add />} onClick={onCreate} disableElevation sx={{ textTransform: "none", borderRadius: "10px", px: 2.25, py: 1 }}>
        Agregar platillo
      </Button>
    </Stack>
  </Box>
);

export const MenuInitialLoading = () => (
  <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}><CircularProgress /></Box>
);

export const EmptyMenuState = ({ onCreate }) => (
  <Paper elevation={0} sx={{ p: 5, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: "10px" }}>
    <Restaurant sx={{ fontSize: 48, color: "text.disabled", mb: 1.5 }} />
    <Typography variant="h6" gutterBottom>No hay platillos todavía</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>Agrega el primero y empieza a construir una experiencia de menú atractiva.</Typography>
    <Button variant="contained" startIcon={<Add />} onClick={onCreate} disableElevation sx={{ textTransform: "none", borderRadius: "10px" }}>Agregar platillo</Button>
  </Paper>
);

export const EmptyMenuResults = () => (
  <Paper elevation={0} sx={{ p: 4, textAlign: "center", border: "1px solid", borderColor: "divider", borderRadius: "10px" }}>
    <Typography variant="body1" fontWeight={700}>No encontramos coincidencias</Typography>
    <Typography variant="body2" color="text.secondary">Prueba otra búsqueda o categoría.</Typography>
  </Paper>
);

OwnerMenuHeader.propTypes = { onCreate: PropTypes.func.isRequired };
EmptyMenuState.propTypes = { onCreate: PropTypes.func.isRequired };
