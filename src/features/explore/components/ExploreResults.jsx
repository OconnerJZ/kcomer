import PropTypes from "prop-types";
import {
  Box,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { Business, LocationOff, RestaurantMenu } from "@mui/icons-material";
import CardPlace from "@Features/explore/components/CardPlace";
import Bg from "@Assets/images/qscome-bg-6.png";

const EmptyExploreState = ({ icon, title, description }) => (
  <Paper elevation={0} sx={{ maxWidth: 520, mx: "auto", p: { xs: 3, sm: 4 }, textAlign: "center", border: "1px solid", borderColor: "rgba(0,0,0,.07)", borderRadius: "8px", bgcolor: "background.paper" }}>
    <Box sx={{ mb: 1.5, color: "text.secondary" }}>{icon}</Box>
    <Typography variant="h6" fontWeight={600}>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>{description}</Typography>
  </Paper>
);

EmptyExploreState.propTypes = {
  description: PropTypes.string.isRequired,
  icon: PropTypes.node.isRequired,
  title: PropTypes.string.isRequired,
};

export default function ExploreResults({ businesses, sponsoredBusinesses = [], geolocation, helperBusinesses, loadBusinessMenu, sectionRef }) {
  return (
    <Box ref={sectionRef} sx={{ position: "relative", px: { xs: 2, sm: 3, md: 5 }, py: { xs: 5, md: 7 }, backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url(${Bg})`, backgroundSize: "contain", backgroundPosition: "center" }}>
      <Box sx={{ maxWidth: 1280, mx: "auto" }}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "flex-start", sm: "flex-end" }} gap={1} sx={{ mb: { xs: 3, md: 4 } }}>
          <Box><Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontWeight: 700 }}>Cerca de ti</Typography><Typography variant="h4" fontWeight={700} sx={{ letterSpacing: "-.03em" }}>Lugares para descubrir</Typography></Box>
          {!helperBusinesses.isLoading && businesses.length > 0 && <Typography variant="body2" color="text.secondary">{businesses.length} {businesses.length === 1 ? "lugar disponible" : "lugares disponibles"}</Typography>}
        </Stack>

        {helperBusinesses.isLoading && <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}><Stack spacing={1.5} alignItems="center"><CircularProgress size={32} thickness={4}/><Typography variant="body2" color="text.secondary">Buscando lugares cerca de ti…</Typography></Stack></Box>}
        {!helperBusinesses.isLoading && geolocation.error && <EmptyExploreState icon={<LocationOff sx={{ fontSize: 42 }}/>} title="Necesitamos tu ubicación" description={geolocation.error || "Permite el acceso a tu ubicación para mostrarte negocios cercanos."}/>} 
        {!helperBusinesses.isLoading && !geolocation.error && helperBusinesses.isError && <EmptyExploreState icon={<Business sx={{ fontSize: 42 }}/>} title="No pudimos cargar los negocios" description="El servicio no está disponible en este momento. Inténtalo nuevamente más tarde."/>}
        {!helperBusinesses.isLoading && !geolocation.error && helperBusinesses.isSuccess && businesses.length === 0 && <EmptyExploreState icon={<RestaurantMenu sx={{ fontSize: 42 }}/>} title="Todavía no hay lugares por aquí" description="Estamos creciendo la red. Pronto podrás descubrir nuevos negocios cerca de ti."/>}

        {!helperBusinesses.isLoading && !geolocation.error && sponsoredBusinesses.length > 0 && (
          <Box sx={{ mb: 4 }}>
            <Stack direction="row" gap={1} alignItems="center" sx={{ mb: 1.5 }}><Typography variant="subtitle1" fontWeight={600}>Recomendaciones patrocinadas</Typography><Chip label="Patrocinado" size="small" variant="outlined"/></Stack>
            <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 2 }}>Publicidad claramente separada. No cambia el orden de los resultados orgánicos.</Typography>
            <Grid container spacing={{ xs: 2.5, md: 3 }} alignItems="flex-start">
              {sponsoredBusinesses.map((business) => <Grid key={`sponsored-${business.id}`} item xs={12} sm={6} lg={4} sx={{ display: "flex", justifyContent: "center" }}><Box sx={{ width: "100%", position: "relative" }}><Chip label="Patrocinado" size="small" sx={{ position: "absolute", zIndex: 2, top: 10, left: 10 }}/><CardPlace data={business} userLocation={geolocation.location} loadBusinessMenu={loadBusinessMenu}/></Box></Grid>)}
            </Grid>
          </Box>
        )}

        {!helperBusinesses.isLoading && !geolocation.error && businesses.length > 0 && (
          <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="flex-start">
            {businesses.map((business) => <Grid key={business.id} item xs={12} sm={6} lg={4} sx={{ display: "flex", justifyContent: "center" }}><CardPlace data={business} userLocation={geolocation.location} loadBusinessMenu={loadBusinessMenu}/></Grid>)}
          </Grid>
        )}
      </Box>
    </Box>
  );
}

ExploreResults.propTypes = {
  businesses: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired })).isRequired,
  sponsoredBusinesses: PropTypes.arrayOf(PropTypes.shape({ id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired })),
  geolocation: PropTypes.shape({ error: PropTypes.string, location: PropTypes.shape({}) }).isRequired,
  helperBusinesses: PropTypes.shape({ isError: PropTypes.bool, isLoading: PropTypes.bool, isSuccess: PropTypes.bool }).isRequired,
  loadBusinessMenu: PropTypes.func.isRequired,
  sectionRef: PropTypes.shape({ current: PropTypes.any }).isRequired,
};
