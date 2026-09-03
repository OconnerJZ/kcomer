import { useState } from "react";
import { useLocation } from "react-router-dom";
import { Search } from "@mui/icons-material";
import { Autocomplete, Box, Grid, IconButton, Stack, TextField, Typography } from "@mui/material";
import { Drawer } from "antd";
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
          minHeight: 40,
          px: 1.5,
          py: .4,
          backgroundColor: "#F5F2EC",
          borderBottom: "1px solid rgba(168,117,60,.22)",
          color: "text.primary",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          opacity: visible ? 1 : 0,
          transition: "opacity 0.5s",
          letterSpacing: "0.5px",
        }}
      >
        <Typography component="span" variant="caption" fontWeight={600} noWrap sx={{ maxWidth: "calc(100vw - 64px)" }}>{address}</Typography>
        <IconButton size="small" onClick={() => setOpen(true)}>
          <Search />
        </IconButton>
      </Box>

      <Drawer title="" placement="top" onClose={() => setOpen(false)} open={open} className="panelFilter">
        <Grid container spacing={{ xs: 2, md: 3 }} justifyContent="center" alignItems="stretch" mt={2}>
          {[
            ["ion:location", "#5F7864", "Ubicación"],
            ["ion:fast-food", "#A8753C", "Comida"],
            ["fluent:person-feedback-48-filled", "#C65A50", "Feedback"],
          ].map(([icon, color, label]) => (
            <Grid item xs={12} sm={6} md={4} key={label}>
              <Stack spacing={1.5} sx={{ height: "100%", p: { xs: 1.5, sm: 2 }, border: "1px solid", borderColor: "divider", borderRadius: "8px", bgcolor: "rgba(255,255,255,.9)" }}>
                  <Stack direction="row" spacing={1} alignItems="center"><Icon style={{ fontSize: "28px", color }} icon={icon} /><Typography fontWeight={600}>{label}</Typography></Stack>
                  <Autocomplete
                    value={value}
                    onChange={(_, newValue) => setValue(newValue)}
                    options={options}
                    renderInput={(params) => <TextField {...params} label={label} />}
                  />
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Drawer>
    </>
  );
}
