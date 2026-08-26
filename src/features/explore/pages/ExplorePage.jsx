import { Box, Grid } from "@mui/material";
import { Business } from "@mui/icons-material";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import { Result, Typography } from "antd";
import CardPlace from "@Features/explore/components/CardPlace";
import Parallax from "@Features/explore/components/Parallax";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import Bg5 from "@Assets/images/qscome-bg-5.jpg";
import useBusiness from "@Features/business/hooks/useBusiness";
import useExplore from "@Features/explore/hooks/useExplore";
import useGeolocation from "@Features/explore/hooks/useGeolocation";

const EXPLORE_TITLE = "Descubre qué comer hoy";

export default function ExplorePage() {
  const { seccionDestinoRef, scrollToSection } = useExplore();
  const { businesses, helperBusinesses, loadBusinessMenu } = useBusiness();
  const geolocation = useGeolocation();

  if (helperBusinesses.isLoading) {
    return (
      <Box style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Result status="info" title="Cargando negocios..." />
      </Box>
    );
  }

  if (geolocation.error) {
    return (
      <Box style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)" }}>
        <Result
          icon={<LocationOffIcon sx={{ fontSize: "5em", color: "red" }} />}
          status="error"
          title="Permita acceder a su ubicación en su dispositivo"
          subTitle={geolocation.error}
        />
      </Box>
    );
  }

  return (
    <GeneralContent title="Explorar">
      <Parallax bg={Bg5}>
        <Box style={{ width: "100%", height: "80vh", position: "absolute", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <Box style={{ display: "flex", flexFlow: "column", alignItems: "center", justifyContent: "center" }}>
            <Typography className="titlePrimary title">{EXPLORE_TITLE}</Typography>
            <Box className="bg" onClick={scrollToSection} />
            <Box className="button" onClick={scrollToSection}>
              <i><PlayForWorkIcon sx={{ fontSize: "38px", marginTop: "4px" }} /></i>
            </Box>
          </Box>
        </Box>
      </Parallax>

      <Box className="bg-card-explore" ref={seccionDestinoRef}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {helperBusinesses.isError && (
            <Result
              icon={<Business sx={{ fontSize: "5em", color: "red" }} />}
              status="warning"
              title={helperBusinesses?.status === "rejected" ? "Servicio no disponible. Intente más tarde" : "Favor intentar nuevamente más tarde"}
              subTitle=""
            />
          )}

          {helperBusinesses.isSuccess && businesses.length === 0 && (
            <Result
              icon={<Business sx={{ fontSize: "5em", color: "red" }} />}
              status="warning"
              title="Por el momento no hay negocios registrados"
              subTitle="Ayúdanos compartiendo la página para crecer nuestra red"
            />
          )}

          {businesses.map((data) => (
            <Grid key={data.id} item xs={12} sm={6} md={4} lg={3} xl={3} sx={{ display: "flex", justifyContent: "center" }}>
              <CardPlace data={data} loadBusinessMenu={loadBusinessMenu} />
            </Grid>
          ))}
        </Grid>
      </Box>
    </GeneralContent>
  );
}
