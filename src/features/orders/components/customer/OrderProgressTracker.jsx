import { Box, CircularProgress, Stack, Typography } from "@mui/material";
import { CheckRounded } from "@mui/icons-material";

const DELIVERY_STEPS = [
  { key: "pending", label: "Recibida" },
  { key: "accepted", label: "Aceptada" },
  { key: "preparing", label: "Preparando" },
  { key: "ready", label: "Lista" },
  { key: "in_delivery", label: "En camino" },
  { key: "completed", label: "Completada" },
];

const PICKUP_STEPS = [
  { key: "pending", label: "Recibida" },
  { key: "accepted", label: "Aceptada" },
  { key: "preparing", label: "Preparando" },
  { key: "ready", label: "Lista" },
  { key: "completed", label: "Completada" },
];

const getProgress = (status, steps) => {
  const index = steps.findIndex((step) => step.key === status);
  if (index < 0) return 0;
  return Math.round(((index + 1) / steps.length) * 100);
};

export default function OrderProgressTracker({ status, orderType = "pickup", compact = false }) {
  if (status === "cancelled") return null;

  const steps = orderType === "delivery" ? DELIVERY_STEPS : PICKUP_STEPS;
  const currentIndex = steps.findIndex((step) => step.key === status);
  const progress = getProgress(status, steps);
  const currentLabel = steps[currentIndex]?.label || "Procesando";

  if (compact) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: .25 }}>
        <Box sx={{ position: "relative", width: 64, height: 64, display: "grid", placeItems: "center" }}>
          <CircularProgress variant="determinate" value={100} size={64} thickness={3.7} sx={{ position: "absolute", color: "action.hover" }} />
          <CircularProgress variant="determinate" value={progress} size={64} thickness={3.7} sx={{ position: "absolute", color: status === "completed" ? "success.main" : "primary.main", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
          {status === "completed" ? <CheckRounded color="success" sx={{ fontSize: 24 }} /> : <Typography variant="caption" fontWeight={900} sx={{ fontSize: ".72rem" }}>{progress}%</Typography>}
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "auto minmax(0,1fr)", sm: "110px minmax(0,1fr)" }, gap: { xs: 2, sm: 2.5 }, alignItems: "center", py: .5 }}>
      <Stack alignItems="center" spacing={.75}>
        <Box sx={{ position: "relative", width: 76, height: 76, display: "grid", placeItems: "center" }}>
          <CircularProgress variant="determinate" value={100} size={76} thickness={3.8} sx={{ position: "absolute", color: "action.hover" }} />
          <CircularProgress variant="determinate" value={progress} size={76} thickness={3.8} sx={{ position: "absolute", color: status === "completed" ? "success.main" : "primary.main", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
          {status === "completed" ? <CheckRounded color="success" /> : <Typography fontWeight={900}>{progress}%</Typography>}
        </Box>
        <Typography variant="caption" fontWeight={800}>{currentLabel}</Typography>
      </Stack>

      <Stack direction="row" alignItems="flex-start" sx={{ width: "100%", minWidth: 0 }}>
        {steps.map((step, index) => {
          const completed = index < currentIndex || status === "completed";
          const active = index === currentIndex;
          return (
            <Box key={step.key} sx={{ flex: 1, position: "relative", textAlign: "center", minWidth: 0 }}>
              {index < steps.length - 1 && (
                <Box sx={{ position: "absolute", top: 8, left: "50%", right: "-50%", height: 2, bgcolor: index < currentIndex ? "primary.main" : "divider" }} />
              )}
              <Box sx={{ position: "relative", zIndex: 1, mx: "auto", width: 18, height: 18, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: completed || active ? (status === "completed" ? "success.main" : "primary.main") : "background.paper", border: "2px solid", borderColor: completed || active ? (status === "completed" ? "success.main" : "primary.main") : "divider", color: "common.white" }}>
                {completed && <CheckRounded sx={{ fontSize: 12 }} />}
              </Box>
              <Typography variant="caption" sx={{ display: { xs: index === 0 || index === currentIndex || index === steps.length - 1 ? "block" : "none", sm: "block" }, mt: .7, fontSize: ".61rem", color: completed || active ? "text.primary" : "text.disabled", fontWeight: active ? 800 : 500 }}>
                {step.label}
              </Typography>
            </Box>
          );
        })}
      </Stack>
    </Box>
  );
}
