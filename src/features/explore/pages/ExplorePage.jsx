import { Box, IconButton, Stack, Typography } from "@mui/material";
import { ArrowDownwardRounded } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import ExploreResults from "@Features/explore/components/ExploreResults";
import Parallax from "@Features/explore/components/Parallax";
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

export default function ExplorePage() {
  const { seccionDestinoRef, scrollToSection } = useExplore();
  const { businesses, helperBusinesses, loadBusinessMenu } = useBusiness();
  const geolocation = useGeolocation();

  return (
    <GeneralContent title="Explorar">
      <Parallax bg={Bg5} stx={{ minHeight: { xs: "calc(100svh - 56px)", sm: 520, md: 620 } }}>
        <Box
          sx={{
            minHeight: { xs: "calc(100svh - 56px)", sm: 520, md: 620 },
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
                  lineHeight: 0.98,
                  letterSpacing: "-.045em",
                  fontSize: { xs: "clamp(2.55rem, 13vw, 3.4rem)", sm: "4rem", md: "5.25rem" },
                  maxWidth: 760,
                }}
              >
                Descubre qué comer hoy.
              </Typography>
              <Typography
                variant="h6"
                sx={{
                  color: "rgba(255,255,255,.82)",
                  maxWidth: 520,
                  fontWeight: 400,
                  lineHeight: 1.55,
                }}
              >
                Negocios locales, menús reales y todo lo que necesitas para elegir sin complicarte.
              </Typography>
              <Box sx={{ pt: 1.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box
                    sx={{
                      position: "relative",
                      width: 60,
                      height: 60,
                      display: "grid",
                      placeItems: "center",
                    }}
                  >
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
                      onClick={scrollToSection}
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
                      <ArrowDownwardRounded
                        sx={{ animation: `${floatArrow} 1.55s ease-in-out infinite` }}
                      />
                    </IconButton>
                  </Box>
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ color: "common.white", fontWeight: 800, lineHeight: 1.1 }}
                    >
                      Ver lugares
                    </Typography>
                    <Typography variant="caption" sx={{ color: "rgba(255,255,255,.68)" }}>
                      Explora lo que hay cerca
                    </Typography>
                  </Box>
                </Stack>
              </Box>
            </Stack>
          </Box>
        </Box>
      </Parallax>

      <ExploreResults
        businesses={businesses}
        geolocation={geolocation}
        helperBusinesses={helperBusinesses}
        loadBusinessMenu={loadBusinessMenu}
        sectionRef={seccionDestinoRef}
      />
    </GeneralContent>
  );
}
