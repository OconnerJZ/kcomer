import {
  Box,
  Button,
  CircularProgress,
  Grid,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowDownward,
  Business,
  LocationOff,
  RestaurantMenu,
} from "@mui/icons-material";
import CardPlace from "@Features/explore/components/CardPlace";
import Parallax from "@Features/explore/components/Parallax";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import Bg5 from "@Assets/images/qscome-bg-5.jpg";
import useBusiness from "@Features/business/hooks/useBusiness";
import useExplore from "@Features/explore/hooks/useExplore";
import useGeolocation from "@Features/explore/hooks/useGeolocation";

const EmptyExploreState = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      maxWidth: 520,
      mx: "auto",
      p: { xs: 3, sm: 4 },
      textAlign: "center",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 3,
      bgcolor: "rgba(255,255,255,.86)",
    }}
  >
    <Box sx={{ mb: 1.5, color: "text.secondary" }}>{icon}</Box>
    <Typography variant="h6" fontWeight={800}>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
      {description}
    </Typography>
  </Paper>
);

export default function ExplorePage() {
  const { seccionDestinoRef, scrollToSection } = useExplore();
  const { businesses, helperBusinesses, loadBusinessMenu } = useBusiness();
  const geolocation = useGeolocation();

  return (
    <GeneralContent title="Explorar">
      <Parallax bg={Bg5} stx={{ minHeight: { xs: 520, md: 620 } }}>
        <Box
          sx={{
            minHeight: { xs: 520, md: 620 },
            display: "flex",
            alignItems: "center",
            px: { xs: 2.5, sm: 5, md: 8 },
          }}
        >
          <Box sx={{ width: "100%", maxWidth: 1180, mx: "auto" }}>
            <Stack spacing={2.25} sx={{ maxWidth: 650 }}>
              <Typography
                variant="overline"
                sx={{ color: "rgba(255,255,255,.78)", letterSpacing: ".18em", fontWeight: 700 }}
              >
                Kcomer · Explora cerca de ti
              </Typography>
              <Typography
                component="h1"
                sx={{
                  color: "white",
                  fontWeight: 900,
                  lineHeight: .98,
                  letterSpacing: "-.045em",
                  fontSize: { xs: "3rem", sm: "4rem", md: "5.25rem" },
                  maxWidth: 760,
                }}
              >
                Descubre qué comer hoy.
              </Typography>
              <Typography
                variant="h6"
                sx={{ color: "rgba(255,255,255,.82)", maxWidth: 520, fontWeight: 400, lineHeight: 1.55 }}
              >
                Negocios locales, menús reales y todo lo que necesitas para elegir sin complicarte.
              </Typography>
              <Box sx={{ pt: 1 }}>
                <Button
                  variant="contained"
                  onClick={scrollToSection}
                  endIcon={<ArrowDownward />}
                  disableElevation
                  sx={{
                    px: 2.5,
                    py: 1.15,
                    borderRadius: 2,
                    textTransform: "none",
                    fontWeight: 800,
                    bgcolor: "white",
                    color: "text.primary",
                    "&:hover": { bgcolor: "rgba(255,255,255,.9)" },
                  }}
                >
                  Ver lugares
                </Button>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Parallax>

      <Box
        ref={seccionDestinoRef}
        sx={{
          bgcolor: "#f7f7f7",
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 5, md: 7 },
        }}
      >
        <Box sx={{ maxWidth: 1280, mx: "auto" }}>
          <Stack
            direction={{ xs: "column", sm: "row" }}
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "flex-end" }}
            gap={1}
            sx={{ mb: { xs: 3, md: 4 } }}
          >
            <Box>
              <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontWeight: 700 }}>
                Cerca de ti
              </Typography>
              <Typography variant="h4" fontWeight={900} sx={{ letterSpacing: "-.03em" }}>
                Lugares para descubrir
              </Typography>
            </Box>
            {!helperBusinesses.isLoading && businesses.length > 0 && (
              <Typography variant="body2" color="text.secondary">
                {businesses.length} {businesses.length === 1 ? "lugar disponible" : "lugares disponibles"}
              </Typography>
            )}
          </Stack>

          {helperBusinesses.isLoading && (
            <Box sx={{ minHeight: 280, display: "grid", placeItems: "center" }}>
              <Stack spacing={1.5} alignItems="center">
                <CircularProgress size={32} thickness={4} />
                <Typography variant="body2" color="text.secondary">Buscando lugares cerca de ti…</Typography>
              </Stack>
            </Box>
          )}

          {!helperBusinesses.isLoading && geolocation.error && (
            <EmptyExploreState
              icon={<LocationOff sx={{ fontSize: 42 }} />}
              title="Necesitamos tu ubicación"
              description={geolocation.error || "Permite el acceso a tu ubicación para mostrarte negocios cercanos."}
            />
          )}

          {!helperBusinesses.isLoading && !geolocation.error && helperBusinesses.isError && (
            <EmptyExploreState
              icon={<Business sx={{ fontSize: 42 }} />}
              title="No pudimos cargar los negocios"
              description="El servicio no está disponible en este momento. Inténtalo nuevamente más tarde."
            />
          )}

          {!helperBusinesses.isLoading && !geolocation.error && helperBusinesses.isSuccess && businesses.length === 0 && (
            <EmptyExploreState
              icon={<RestaurantMenu sx={{ fontSize: 42 }} />}
              title="Todavía no hay lugares por aquí"
              description="Estamos creciendo la red. Pronto podrás descubrir nuevos negocios cerca de ti."
            />
          )}

          {!helperBusinesses.isLoading && !geolocation.error && businesses.length > 0 && (
            <Grid container spacing={{ xs: 2.5, md: 3 }} justifyContent="center" alignItems="flex-start">
              {businesses.map((data) => (
                <Grid key={data.id} item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                  <CardPlace data={data} loadBusinessMenu={loadBusinessMenu} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </GeneralContent>
  );
}
