import { Box, Grid } from "@mui/material";
import CardPlace from "@Components/card/CardPlace";
import GeneralContent from "@Components/layout/GeneralContent";
import Parallax from "@Components/parallax/Parallax";
import Bg5 from "@Assets/images/qscome-bg-5.jpg";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import { Result, Typography } from "antd";
import useExplorar from "@Hooks/generales/useExplorar";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import { namePage } from "@Utils/listMessages";
import { Business } from "@mui/icons-material";

const Explorar = () => {
  const { business, geolocation, seccionDestinoRef, scrollToSection } =
    useExplorar();

  if (geolocation.error) {
    return (
      <Box
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
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
    <GeneralContent title={"Explorar"}>
      <Parallax bg={Bg5}>
        <Box
          style={{
            width: "100%",
            height: "80vh",
            position: "absolute",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Box
            style={{
              display: "flex",
              flexFlow: "column",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Typography className="titlePrimary title">{namePage}</Typography>

            <Box className="bg" onClick={scrollToSection}></Box>
            <Box className="button" onClick={scrollToSection}>
              <i>
                <PlayForWorkIcon sx={{ fontSize: "38px", marginTop: "4px" }} />
              </i>
            </Box>
          </Box>
        </Box>
      </Parallax>

      <Box className="bg-card-explore" ref={seccionDestinoRef}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {business.businesses.length === 0 && (
          
              <Result
                icon={
                  <Business sx={{ fontSize: "5em", color: "red" }} />
                }
                status="warning"
                title="Por el momento no hay negocios registrados"
                subTitle={"ops"}
              />
            
          )}
          {business.businesses.map((data) => (
            <Grid
              key={data.id}
              item
              xs={12}
              sm={6}
              md={4}
              lg={3}
              xl={3}
              sx={{ display: "flex", justifyContent: "center" }}
            >
              <CardPlace
                key={data.title}
                data={data}
                loadBusinessMenu={business.loadBusinessMenu}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </GeneralContent>
  );
};

export default Explorar;
