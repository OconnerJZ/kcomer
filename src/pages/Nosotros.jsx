import GeneralContent from "@Components/layout/GeneralContent";
import { Box, Grid } from "@mui/material";
import { namePage, nosotros } from "@Utils/listMessages";

const Nosotros = () => {
  return (
    <GeneralContent >
      <Box component="header" className="hero">
        <div className="logo">{namePage}</div>
        <p className="hero-sub">
          {nosotros.spot}
        </p>
      </Box>
      <Box component="main" sx={{ display: "flex !important", flexDirection:"column" }} mt={1} mb={1}>
        <Box mb={2}>
          <Grid
            container
            spacing={{ xs: 2, md: 3 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <div className="pkg">
                <div className="box-art sticker-7" aria-hidden></div>
                <div className="sticker-tag">Fresh</div>
                <h3>Explora negocios</h3>
                <p>
                  Encuentra lugares nuevos según tu humor y tus antojos del día.
                </p>
                <div className="corner-sticker" aria-hidden></div>
              </div>
            </Grid>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <div className="pkg">
                <div className="box-art sticker-2" aria-hidden></div>
                <div className="sticker-tag">Top</div>
                <h3>Habla con la comunidad</h3>
                <p>
                  Califica, deja tus reseñas, comparte tus fotos y mira qué
                  recomiendan otros comelones como tú.
                </p>
                <div className="corner-sticker" aria-hidden></div>
              </div>
            </Grid>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <div className="pkg">
                <div className="box-art sticker-3" aria-hidden></div>
                <div className="sticker-tag">Easy</div>
                <h3>Todo desde tu cel o compu</h3>
                <p>
                  Revisa menús, checa horarios, reserva o pide para llevar sin
                  complicarte la vida.
                </p>
                <div className="corner-sticker" aria-hidden></div>
              </div>
            </Grid>
          </Grid>
        </Box>
        <Box mt={2}>
          <Grid
            container
            spacing={{ xs: 2, md: 4 }}
            columns={{ xs: 4, sm: 8, md: 12 }}
            sx={{
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <div className="pkg">
                <div className="box-art sticker-1" aria-hidden></div>
                <div className="sticker-tag">1</div>
                <h3>Descubre</h3>
                <p>Explora según barrio, estilo o antojo del día.</p>
                <div className="corner-sticker" aria-hidden></div>
              </div>
            </Grid>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <div className="pkg">
                <div className="box-art sticker-8" aria-hidden></div>
                <div className="sticker-tag">2</div>
                <h3>Explora menús</h3>
                <p>Mira fotos, precios y todo lo que necesitas para decidir.</p>
                <div className="corner-sticker" aria-hidden></div>
              </div>
            </Grid>
            <Grid item size={{ xs: 2, sm: 4, md: 4 }}>
              <div className="pkg">
                <div className="box-art sticker-4" aria-hidden></div>
                <div className="sticker-tag">3</div>
                <h3>Reseñas reales</h3>
                <p>
                  Comparte tu experiencia y descubre qué lugares valen la pena.
                </p>
                <div className="corner-sticker" aria-hidden></div>
              </div>
            </Grid>
          </Grid>
        </Box>
      </Box>
    </GeneralContent>
  );
};

export default Nosotros;
