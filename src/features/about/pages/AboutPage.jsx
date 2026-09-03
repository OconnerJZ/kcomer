import { Box, Grid } from "@mui/material";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import Bg from "@Assets/images/qscome-bg-6.png";
import Bg4 from "@Assets/images/qsome-bg-4.jpg";

const NAME_PAGE = "qsCome";
const ABOUT_SPOT =
  "¡Bienvenido!, el lugar donde los antojos se encuentran con los mejores spots de comida. Aquí vienes a descubrir, disfrutar y compartir lo que más nos une: ¡comer rico!";

const AboutPage = () => {
  return (
    <GeneralContent>
      <Box
        component="header"
        className="hero"
        sx={{
          textAlign: "center",
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,.78), rgba(0,0,0,0)), url(${Bg4})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          "& .logo": { margin: 0 },
        }}
      >
        <div className="logo">{NAME_PAGE}</div>
        <p className="hero-sub">{ABOUT_SPOT}</p>
      </Box>

      <Box
        component="main"
        sx={{
          display: "flex",
          flexDirection: "column",
          backgroundImage: `linear-gradient(rgba(255, 255, 255, 0.80), rgba(255, 255, 255, 0.80)), url(${Bg})`,
          backgroundSize: "contain",
          backgroundPosition: "center",
          px: { xs: 1.5, sm: 3 },
          py: { xs: 3, sm: 5 },
        }}
      >
        <Box mb={2}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            sx={{ justifyContent: "center", alignItems: "stretch" }}
          >
            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <div className="pkg">
                <div className="box-art sticker-7" aria-hidden />
                <h3>Explora negocios</h3>
                <p>Encuentra lugares nuevos según tu humor y tus antojos del día.</p>
                <div className="corner-sticker" aria-hidden />
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <div className="pkg">
                <div className="box-art sticker-8" aria-hidden />
                <h3>Explora menús</h3>
                <p>Mira fotos, precios y todo lo que necesitas para decidir.</p>
                <div className="corner-sticker" aria-hidden />
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <div className="pkg">
                <div className="box-art sticker-3" aria-hidden />
                <h3>Todo desde tu cel o compu</h3>
                <p>
                  Revisa menús, checa horarios, reserva o pide para llevar sin
                  complicarte la vida.
                </p>
                <div className="corner-sticker" aria-hidden />
              </div>
            </Grid>

            <Grid item xs={12} sm={6} md={4} sx={{ display: "flex" }}>
              <div className="pkg">
                <div className="box-art sticker-4" aria-hidden />
                <h3>Reseñas reales</h3>
                <p>Comparte tu experiencia y descubre qué lugares valen la pena.</p>
                <div className="corner-sticker" aria-hidden />
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </GeneralContent>
  );
};

export default AboutPage;
