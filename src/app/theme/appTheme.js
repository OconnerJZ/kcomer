import { createTheme } from "@mui/material/styles";

export const appTheme = createTheme({
  palette: {
    primary: { main: "#C65A50", light: "#D9877F", dark: "#8F3E38", contrastText: "#FFFFFF" },
    secondary: { main: "#66736A", light: "#929B94", dark: "#465048", contrastText: "#FFFFFF" },
    info: { main: "#626B73", light: "#8D959B", dark: "#414950", contrastText: "#FFFFFF" },
    success: { main: "#5F7864", light: "#8EA391", dark: "#405544", contrastText: "#FFFFFF" },
    warning: { main: "#A8753C", light: "#C59B6B", dark: "#704A24", contrastText: "#FFFFFF" },
    error: { main: "#B7473F", dark: "#7E302B" },
    background: { default: "#F5F2EC", paper: "#FEFDFB" },
    text: { primary: "#292724", secondary: "#6F6A63" },
    divider: "rgba(56,50,44,.14)",
  },
  shape: { borderRadius: 8 },
  typography: {
    fontFamily: '"Source Sans 3", "Segoe UI", sans-serif',
    fontSize: 14,
    h1: {
      fontFamily: '"Lora", Georgia, serif',
      fontSize: "2rem",
      fontWeight: 600,
      lineHeight: 1.2,
      letterSpacing: "-.02em",
    },
    h2: {
      fontFamily: '"Lora", Georgia, serif',
      fontSize: "1.75rem",
      fontWeight: 600,
      lineHeight: 1.25,
      letterSpacing: "-.018em",
    },
    h3: {
      fontFamily: '"Lora", Georgia, serif',
      fontSize: "1.5rem",
      fontWeight: 600,
      lineHeight: 1.3,
      letterSpacing: "-.015em",
    },
    h4: {
      fontFamily: '"Lora", Georgia, serif',
      fontWeight: 600,
      letterSpacing: "-.015em",
      fontSize: "1.375rem",
      lineHeight: 1.35,
    },
    h5: {
      fontFamily: '"Lora", Georgia, serif',
      fontWeight: 600,
      letterSpacing: "-.01em",
      fontSize: "1.2rem",
      lineHeight: 1.4,
    },
    h6: {
      fontFamily: '"Lora", Georgia, serif',
      fontSize: "1rem",
      fontWeight: 600,
      lineHeight: 1.45,
    },
    subtitle1: { fontSize: "1rem", fontWeight: 600 },
    subtitle2: { fontSize: ".875rem", fontWeight: 600 },
    body1: { fontSize: "1rem", lineHeight: 1.6 },
    body2: { fontSize: ".875rem", lineHeight: 1.55 },
    button: { fontSize: ".875rem", fontWeight: 600, letterSpacing: ".01em" },
    caption: { fontSize: ".75rem", lineHeight: 1.45 },
    overline: { fontSize: ".6875rem", fontWeight: 600, letterSpacing: ".11em" },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: { backgroundColor: "#F5F2EC", color: "#292724" },
      },
    },
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          textTransform: "none",
          fontWeight: 600,
          minHeight: 40,
          borderRadius: 7,
          boxShadow: "none",
          paddingInline: 18,
        },
        sizeSmall: { minHeight: 34 },
        containedPrimary: {
          "&:hover": { backgroundColor: "#AD4B43", boxShadow: "none" },
        },
        outlined: {
          borderColor: "rgba(56,50,44,.22)",
          color: "#403C37",
          "&:hover": {
            borderColor: "rgba(56,50,44,.4)",
            backgroundColor: "rgba(56,50,44,.035)",
          },
        },
      },
    },
    MuiChip: {
      styleOverrides: { root: { borderRadius: 6, fontWeight: 600 } },
    },
    MuiLinearProgress: {
      styleOverrides: { root: { borderRadius: "6px" } },
    },
    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          border: "1px solid rgba(56,50,44,.14)",
          borderRadius: 8,
          boxShadow: "0 1px 3px rgba(44,38,33,.05)",
          backgroundImage: "none",
        },
      },
    },
    MuiPaper: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        rounded: { borderRadius: 8 },
      },
    },
    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 8,
          backgroundImage: "none",
          maxHeight: "calc(100dvh - 32px)",
          margin: 16,
          boxShadow: "0 8px 24px rgba(38,33,29,.14)",
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
      styleOverrides: { root: { minHeight: 42, textTransform: "none", fontWeight: 600 } },
    },
    MuiAlert: {
      styleOverrides: { root: { borderRadius: 7 } },
    },
    MuiTextField: {
      defaultProps: { variant: "outlined" },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 7,
          backgroundColor: "#FEFDFB",
          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "rgba(56,50,44,.4)",
          },
        },
        notchedOutline: { borderColor: "rgba(56,50,44,.2)" },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: { borderRadius: 7 },
      },
    },
  },
});

export default appTheme;
