import { useFilterMenu } from "@Context/FilterMenuContext";
import { Search, LocationOn } from "@mui/icons-material";
import {
  Autocomplete,
  Box,
  Grid,
  IconButton,
  Paper,
  TextField,
  CircularProgress,
  Typography,
} from "@mui/material";
import { Card, Drawer } from "antd";
import { useState, useEffect } from "react";
import { Icon } from "@iconify/react";
import { useLocation } from "react-router-dom";
import { mapsService } from "@Services/mapsService";

const options = ["Option 1", "Option 2"];

const FiltersPanel = () => {
  const { visible } = useFilterMenu();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const { pathname } = useLocation();

  // Estados para ubicación
  const [address, setAddress] = useState("");
  const [loadingLocation, setLoadingLocation] = useState(false);

  // Cargar ubicación SOLO al montar (lazy loading)
  useEffect(() => {
    loadLocation();
  }, []);

  const loadLocation = async () => {
    try {
      setLoadingLocation(true);
      
      // Usar servicio con cache
      const coords = await mapsService.getCurrentLocation();
      const geocodeData = await mapsService.reverseGeocode(coords);
      
      if (geocodeData) {
        setAddress(geocodeData.formatted_address);
      }
    } catch (error) {
      console.error('Error obteniendo ubicación:', error);
      setAddress("Ubicación no disponible");
    } finally {
      setLoadingLocation(false);
    }
  };

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  if (pathname !== "/explorar") {
    return null;
  }

  return (
    <>
      <Box
        sx={{
          zIndex: 1000,
          position: "fixed",
          top: { xs: "0px", sm: "56px", md: "64px" },
          width: "100%",
          padding: "3px",
          backgroundImage:
            "radial-gradient(circle at 56.6% 38.56%, #fffbae 5%, #ffe9a6 15%, #d8b46c 50%, #c99f54 75%, #bd8c40 100%)",
          color: "#000",
          backdropFilter: "blur(5px)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s",
          letterSpacing: "0.5px",
        }}
      >
        {loadingLocation ? (
          <CircularProgress size={20} sx={{ mr: 1 }} />
        ) : (
          <LocationOn sx={{ mr: 0.5, fontSize: 20 }} />
        )}
        <Typography variant="body2" noWrap sx={{ maxWidth: '80%' }}>
          {address || "Cargando..."}
        </Typography>
        <IconButton onClick={showDrawer}>
          <Search />
        </IconButton>
      </Box>

      <Drawer
        title=""
        placement="top"
        onClose={onClose}
        open={open}
        className="panelFilter"
      >
        <Grid
          container
          spacing={5}
          justifyContent={"center"}
          alignItems={"center"}
          mt={2}
        >
          <Grid item>
            <Paper elevation={3}>
              <Card
                className="filterPanel"
                title={
                  <Icon
                    style={{ fontSize: "40px", color: "#D02828" }}
                    icon={"ion:location"}
                  />
                }
                bordered={false}
                style={{ width: 300 }}
              >
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  renderInput={(params) => (
                    <TextField {...params} label="Ubicación" />
                  )}
                />
              </Card>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={3}>
              <Card
                className="filterPanel"
                title={
                  <Icon
                    style={{ fontSize: "40px", color: "#E3A024" }}
                    icon={"ion:fast-food"}
                  />
                }
                bordered={false}
                style={{ width: 300 }}
              >
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  renderInput={(params) => (
                    <TextField {...params} label="Comida" />
                  )}
                />
              </Card>
            </Paper>
          </Grid>
          <Grid item>
            <Paper elevation={3}>
              <Card
                className="filterPanel"
                title={
                  <Icon
                    style={{ fontSize: "40px", color: "#003085" }}
                    icon={"fluent:person-feedback-48-filled"}
                  />
                }
                bordered={false}
                style={{ width: 300 }}
              >
                <Autocomplete
                  value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                  id="controllable-states-demo"
                  options={options}
                  renderInput={(params) => (
                    <TextField {...params} label="Feedback" />
                  )}
                />
              </Card>
            </Paper>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
};

export default FiltersPanel;