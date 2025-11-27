import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import FastfoodIcon from "@mui/icons-material/Fastfood";
import InfoIcon from "@mui/icons-material/Info";
import StoreIcon from "@mui/icons-material/Store";
import LogoClassic from "@Assets/images/qscome-logo-classic.png";
import { useNavigate } from "react-router-dom";

const navItems = [
  { title: "Explorar", icon: <FastfoodIcon />, link: "explorar" },
  { title: "Nosotros", icon: <InfoIcon />, link: "nosotros" },
  { title: "Negocio", icon: <StoreIcon />, link: "registro" },
];

const Navbar = () => {
  const navigate = useNavigate();
  const [value, setValue] = React.useState(0);

  return (
    <Box>
      <CssBaseline />
      <AppBar
        component="nav"
        sx={{
          backgroundColor: "rgba(255,255,255, 0.7)",
          backdropFilter: "blur(5px)",
          color: "#3a3b3d",
          display: { xs: "none", sm: "block" }, // solo desktop
        }}
      >
        <Toolbar>
          <img src={LogoClassic} alt="logo" width={50} style={{ marginRight: 20 }} />

          <Typography
            variant="h6"
            sx={{ flexGrow: 1 }}
          ></Typography>

          <Box>
            {navItems.map((item) => (
              <Button
                key={item.title}
                sx={{ color: "#000", textTransform: "none" }}
                startIcon={item.icon}
                onClick={() => navigate(item.link)}
              >
                {item.title}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>

      <Box
        sx={{
          width: "100%",
          position: "fixed",
          bottom: 0,
          left: 0,
          zIndex: 1000,
          display: { xs: "flex", sm: "none" }, // solo mobile
          borderTop: "1px solid #e0e0e0",
          backgroundColor: "#fff",
        }}
      >
        <BottomNavigation
          showLabels
          value={value}
          onChange={(event, newValue) => {
            setValue(newValue);
            navigate(navItems[newValue].link);
          }}
          sx={{
            width: "100%",
            "& .MuiBottomNavigationAction-root": {
              minWidth: "auto",
            },
          }}
        >
          {navItems.map((item) => (
            <BottomNavigationAction
              key={item.title}
              label={item.title}
              icon={item.icon}
            />
          ))}
        </BottomNavigation>
      </Box>
    </Box>
  );
};

export default Navbar;
