import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: { main: "#FF4B45", light: "#FF817C", dark: "#C93430", contrastText: "#FFFFFF" },
    secondary: { main: "#FF9F1C", light: "#FFC15E", dark: "#A95B00", contrastText: "#2B1B08" },
    success: { main: "#2EAD67", light: "#62CF91", dark: "#187A42", contrastText: "#FFFFFF" },
    warning: { main: "#F28C28", dark: "#A95408" },
    error: { main: "#D93A3A", dark: "#9E2929" },
    background: { default: "#FFF9F4", paper: "#FFFFFF" },
    text: { primary: "#292522", secondary: "#716A65" },
    divider: "rgba(72,55,45,.12)",
  },
  shape: { borderRadius: 12 },
  components: {
    MuiButton: {
      styleOverrides: { root: { textTransform: "none", fontWeight: 750 } },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
  },
});

export default appTheme;
