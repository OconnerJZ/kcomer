import {
  Box,
  CircularProgress,
  Grid,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import {
  ArrowDownwardRounded,
  Business,
  LocationOff,
  RestaurantMenu,
} from "@mui/icons-material";
import { keyframes } from "@mui/system";
import CardPlace from "@Features/explore/components/CardPlace";
import Parallax from "@Features/explore/components/Parallax";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import Bg5 from "@Assets/images/qscome-bg-5.jpg";
import useBusiness from "@Features/business/hooks/useBusiness";
import useExplore from "@Features/explore/hooks/useExplore";
import useGeolocation from "@Features/explore/hooks/useGeolocation";

const ripple = keyframes`
  0% { transform: scale(.72); opacity: .55; }
  70% { opacity: 0; }
  100% { transform: scale(1.55); opacity: 0; }
`;

const floatArrow = keyframes`
  0%, 100% { transform: translateY(-1px); }
  50% { transform: translateY(4px); }
`;

const EmptyExploreState = ({ icon, title, description }) => (
  <Paper
    elevation={0}
    sx={{
      maxWidth: 520,
      mx: "auto",
      p: { xs: 3, sm: 4 },
      textAlign: "center",
      border: "1px solid",
      borderColor: "rgba(0,0,0,.07)",
      borderRadius: 4,
      bgcolor: "rgba(255,255,255,.78)",
      backdropFilter: "blur(14px)",
    }}
  >
    <Box sx={{ mb: 1.5, color: "text.secondary" }}>{icon}</Box>
    <Typography variant="h6" fontWeight={800}>{title}</Typography>
    <Typography variant="body2" color="text.secondary" sx={{ mt: 1, lineHeight: 1.7 }}>
      {description}
    </Typography>
  </Paper>
);

const WaveExploreButton = ({ onClick }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Box sx={{ position: "relative", width: 60, height: 60, display: "grid", placeItems: "center" }}>
      {[0, 1].map((index) => (
        <Box
          key={index}
          sx={{
            position: "absolute",
            inset: 0,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,.52)",
            animation: `${ripple} 2.35s ease-out ${index * 1.12}s infinite`,
            pointerEvents: "none",
          }}
        />
      ))}
      <IconButton
        onClick={onClick}
        aria-label="ver lugares"
        sx={{
          width: 48,
          height: 48,
          bgcolor: "common.white",
          color: "#282828",
          boxShadow: "0 10px 28px rgba(0,0,0,.16)",
          "&:hover": { bgcolor: "common.white", transform: "scale(1.05)" },
          transition: "transform .2s ease",
        }}
      >
        <ArrowDownwardRounded sx={{ animation: `${floatArrow} 1.55s ease-in-out infinite` }} />
      </IconButton>
    </Box>
    <Box>
      <Typography variant="body2" sx={{ color: "common.white", fontWeight: 800, lineHeight: 1.1 }}>
        Ver lugares
      </Typography>
      <Typography variant="caption" sx={{ color: "rgba(255,255,255,.68)" }}>
        Explora lo que hay cerca
      </Typography>
    </Box>
  </Stack>
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
              <Box sx={{ pt: 1.5 }}>
                <WaveExploreButton onClick={scrollToSection} />
              </Box>
            </Stack>
          </Box>
        </Box>
      </Parallax>

      <Box
        ref={seccionDestinoRef}
        sx={{
          position: "relative",
          px: { xs: 2, sm: 3, md: 5 },
          py: { xs: 5, md: 7 },
          // Mantener visible el background global de AppLayout.
          bgcolor: "transparent",
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
            <Grid container spacing={{ xs: 3, md: 4 }} justifyContent="center" alignItems="flex-start">
              {businesses.map((data) => (
                <Grid key={data.id} item xs={12} sm={6} md={4} lg={3} sx={{ display: "flex", justifyContent: "center" }}>
                  <CardPlace data={data} userLocation={geolocation.location} loadBusinessMenu={loadBusinessMenu} />
                </Grid>
              ))}
            </Grid>
          )}
        </Box>
      </Box>
    </GeneralContent>
  );
}
