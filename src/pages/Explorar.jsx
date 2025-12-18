import { Box, Grid, CircularProgress, Alert } from "@mui/material";
import CardPlace from "@Components/card/CardPlace";
import GeneralContent from "@Components/layout/GeneralContent";
import Parallax from "@Components/parallax/Parallax";
import Bg5 from "@Assets/images/qscome-bg-5.jpg";
import PlayForWorkIcon from "@mui/icons-material/PlayForWork";
import { Result, Typography } from "antd";
import LocationOffIcon from "@mui/icons-material/LocationOff";
import { namePage } from "@Utils/listMessages";
import { useEffect, useRef, useState } from "react";
import { useFilterMenu } from "@Context/FilterMenuContext";
import useGeolocation from "@Hooks/components/useGeolocation";
import useBusiness from "@Hooks/generales/useBusiness";

const Explorar = () => {
  const { address, error: geoError } = useGeolocation();
  const { visible, setVisible } = useFilterMenu();
  const { businesses, loading, error, loadBusinessMenu } = useBusiness();
  const seccionDestinoRef = useRef(null);

  const scrollToSection = () => {
    if (seccionDestinoRef.current) {
      seccionDestinoRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (seccionDestinoRef.current) {
        const elementRect = seccionDestinoRef.current.getBoundingClientRect();
        const isElementVisible = elementRect.top <= 64;
        setVisible(isElementVisible);
      }
    };

    window.addEventListener('scroll', handleScroll);
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [setVisible]);

  // Cargar menú cuando se expande un negocio
  const handleBusinessExpand = async (businessId) => {
    const business = businesses.find(b => b.id === businessId);
    if (business && (!business.menu || business.menu.length === 0)) {
      await loadBusinessMenu(businessId);
    }
  };

  if (geoError) {
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
          subTitle={geoError}
        />
      </Box>
    );
  }
  
  return (
    <GeneralContent title="Explorar">
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
        {error && (
          <Alert severity="error" sx={{ mb: 3, mx: 2 }}>
            {error}
          </Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 5 }}>
            <CircularProgress />
          </Box>
        ) : businesses.length === 0 ? (
          <Box sx={{ textAlign: 'center', p: 5 }}>
            <Typography variant="h6" color="text.secondary">
              No hay negocios disponibles en tu zona
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={2} justifyContent="center" alignItems="center">
            {businesses.map((data) => (
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
                  key={data.id} 
                  data={data}
                  onExpand={() => handleBusinessExpand(data.id)}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </GeneralContent>
  );
};

export default Explorar;