import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Autocomplete, Box, Grid, IconButton, Paper, TextField } from "@mui/material";
import { Card, Drawer } from "antd";
import { Icon } from "@iconify/react";
import { useFilterMenu } from "@Features/explore/context/FilterMenuContext";
import useGeolocation from "@Features/explore/hooks/useGeolocation";

const options = ["Option 1", "Option 2"];

export default function FiltersPanel() {
  const { address } = useGeolocation();
  const { visible } = useFilterMenu();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState();
  const { pathname } = useLocation();

  if (pathname !== "/explorar") return null;

  return (
    <>
      <Box
        sx={{
          zIndex: 1000,
          position: "fixed",
          top: { xs: "0px", sm: "56px", md: "64px" },
          width: "100%",
          padding: "3px",
          backgroundImage: "radial-gradient(circle at 56.6% 38.56%, #fffbae 5%, #ffe9a6 15%, #d8b46c 50%, #c99f54 75%, #bd8c40 100%)",
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
        <article>{address}</article>
        <IconButton onClick={() => setOpen(true)}>
          <Search />
        </IconButton>
      </Box>

      <Drawer title="" placement="top" onClose={() => setOpen(false)} open={open} className="panelFilter">
        <Grid container spacing={5} justifyContent="center" alignItems="center" mt={2}>
          {[
            ["ion:location", "#D02828", "Ubicación"],
            ["ion:fast-food", "#E3A024", "Comida"],
            ["fluent:person-feedback-48-filled", "#003085", "Feedback"],
          ].map(([icon, color, label]) => (
            <Grid item key={label}>
              <Paper elevation={3}>
                <Card
                  className="filterPanel"
                  title={<Icon style={{ fontSize: "40px", color }} icon={icon} />}
                  bordered={false}
                  style={{ width: 300 }}
                >
                  <Autocomplete
                    value={value}
                    onChange={(_, newValue) => setValue(newValue)}
                    options={options}
                    renderInput={(params) => <TextField {...params} label={label} />}
                  />
                </Card>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Drawer>
    </>
  );
}
