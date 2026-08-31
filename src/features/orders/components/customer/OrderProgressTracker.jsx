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
  const pickupReady = orderType === "pickup" && status === "ready";
  const size = compact ? 64 : 76;

  return (
    <Box sx={{ display: "grid", gridTemplateColumns: `${size}px minmax(0,1fr)`, gap: { xs: 2, sm: 2.5 }, alignItems: "center", py: .5 }}>
      <Box sx={{ position: "relative", width: size, height: size, display: "grid", placeItems: "center" }}>
          <CircularProgress variant="determinate" value={100} size={size} thickness={3.8} sx={{ position: "absolute", color: "action.hover" }} />
          <CircularProgress variant="determinate" value={progress} size={size} thickness={3.8} sx={{ position: "absolute", color: status === "completed" ? "success.main" : "primary.main", "& .MuiCircularProgress-circle": { strokeLinecap: "round" } }} />
          {status === "completed" ? <CheckRounded color="success" /> : <Typography fontWeight={900}>{progress}%</Typography>}
      </Box>

      <Stack spacing={pickupReady ? 1 : .65} minWidth={0}>
        <Box>
          <Typography variant={compact ? "body2" : "subtitle2"} fontWeight={900}>{currentLabel}</Typography>
          {pickupReady && <Typography variant="caption" color="success.dark" fontWeight={750} sx={{ display: "block", mt: .25, lineHeight: 1.4 }}>Tu orden está lista. Ya puedes ir a recogerla.</Typography>}
        </Box>

        {!compact && <Stack direction="row" alignItems="flex-start" sx={{ width: "100%", minWidth: 0 }}>
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
        </Stack>}
      </Stack>
    </Box>
  );
}
