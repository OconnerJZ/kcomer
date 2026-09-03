import { createContext, useCallback, useContext, useMemo, useState } from "react";
import {
  Alert,
  IconButton,
  Slide,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import CloseRounded from "@mui/icons-material/CloseRounded";

const FeedbackContext = createContext(null);

const DEFAULT_DURATION = 4200;

const SlideTransition = (props) => <Slide {...props} direction="down" />;

export function FeedbackProvider({ children }) {
  const [queue, setQueue] = useState([]);

  const notify = useCallback((message, options = {}) => {
    if (!message) return;
    const item = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      message,
      severity: options.severity || "info",
      title: options.title || "",
      duration: options.duration ?? DEFAULT_DURATION,
    };
    setQueue((current) => [...current, item]);
  }, []);

  const dismiss = useCallback((id) => {
    setQueue((current) => current.filter((item) => item.id !== id));
  }, []);

  const api = useMemo(() => ({
    notify,
    success: (message, options = {}) => notify(message, { ...options, severity: "success" }),
    error: (message, options = {}) => notify(message, { ...options, severity: "error" }),
    warning: (message, options = {}) => notify(message, { ...options, severity: "warning" }),
    info: (message, options = {}) => notify(message, { ...options, severity: "info" }),
  }), [notify]);

  const active = queue[0];

  return (
    <FeedbackContext.Provider value={api}>
      {children}
      <Snackbar
        open={Boolean(active)}
        autoHideDuration={active?.duration || DEFAULT_DURATION}
        onClose={(_, reason) => {
          if (reason !== "clickaway" && active) dismiss(active.id);
        }}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
        TransitionComponent={SlideTransition}
        sx={{ mt: { xs: 1, sm: 7 }, maxWidth: "calc(100vw - 24px)" }}
      >
        {active ? (
          <Alert
            severity={active.severity}
            variant="filled"
            iconMapping={{}}
            action={(
              <IconButton
                size="small"
                aria-label="cerrar notificación"
                color="inherit"
                onClick={() => dismiss(active.id)}
              >
                <CloseRounded fontSize="small" />
              </IconButton>
            )}
            sx={{
              width: { xs: "calc(100vw - 24px)", sm: "auto" },
              minWidth: { sm: 360 },
              maxWidth: 560,
              borderRadius: "8px",
              alignItems: "center",
              boxShadow: "0 6px 18px rgba(25,20,18,.16)",
              "& .MuiAlert-message": { width: "100%" },
            }}
          >
            <Stack spacing={0.15}>
              {active.title && (
                <Typography variant="subtitle2" fontWeight={600} lineHeight={1.15}>
                  {active.title}
                </Typography>
              )}
              <Typography variant="body2" sx={{ opacity: 0.96 }}>
                {active.message}
              </Typography>
            </Stack>
          </Alert>
        ) : undefined}
      </Snackbar>
    </FeedbackContext.Provider>
  );
}

export function useFeedback() {
  const context = useContext(FeedbackContext);
  if (!context) throw new Error("useFeedback debe usarse dentro de FeedbackProvider");
  return context;
}
