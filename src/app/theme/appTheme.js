import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: { main: "#315EFB", light: "#7392FF", dark: "#1E40AF", contrastText: "#FFFFFF" },
    secondary: { main: "#FF9F1C", light: "#FFC15E", dark: "#A95B00", contrastText: "#2B1B08" },
    info: { main: "#7C3AED", light: "#A78BFA", dark: "#5B21B6", contrastText: "#FFFFFF" },
    success: { main: "#2EAD67", light: "#62CF91", dark: "#187A42", contrastText: "#FFFFFF" },
    warning: { main: "#F28C28", dark: "#A95408" },
    error: { main: "#D93A3A", dark: "#9E2929" },
    background: { default: "#FFF9F4", paper: "#FFFFFF" },
  text: { primary: "#292522", secondary: "#716A65" },
  divider: "rgba(72,55,45,.12)",
  },
  shape: { borderRadius: 10 },
  typography: {
    fontFamily: '"Montserrat", "Segoe UI", sans-serif',
    h4: {
      fontWeight: 900,
      letterSpacing: "-.035em",
      fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
    },
    h5: {
      fontWeight: 850,
      letterSpacing: "-.025em",
      fontSize: "clamp(1.35rem, 2.4vw, 1.55rem)",
    },
    h6: { fontWeight: 800 },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: { textTransform: "none", fontWeight: 750, minHeight: 40, borderRadius: 10 },
        sizeSmall: { minHeight: 34 },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 999, fontWeight: 700 } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: 999 } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid rgba(72,55,45,.12)",
          borderRadius: 10,
          backgroundImage: "none",
        },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 10,
          backgroundImage: "none",
          maxHeight: "calc(100dvh - 32px)",
          margin: 16,
          "&.MuiDialog-paperFullScreen": { borderRadius: 0, maxHeight: "100dvh", margin: 0 },
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: { root: { padding: "20px 20px 12px" } },
    },
    MuiDialogContent: {
      styleOverrides: { root: { paddingLeft: 20, paddingRight: 20 } },
    },
    MuiDialogActions: {
      styleOverrides: { root: { padding: "12px 20px 20px", flexWrap: "wrap", gap: 8 } },
    },
    MuiTabs: {
      styleOverrides: { root: { minHeight: 42 } },
    },
    MuiTab: {
      styleOverrides: { root: { minHeight: 42, textTransform: "none", fontWeight: 750 } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 10 } },
    },
  },
});

export default appTheme;
