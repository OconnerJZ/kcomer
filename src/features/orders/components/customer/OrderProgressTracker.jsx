import { Box, Stack, Typography } from "@mui/material";
import { Check } from "@mui/icons-material";

const STEPS = [
  { key: "accepted", label: "Aceptada" },
  { key: "preparing", label: "Preparando" },
  { key: "ready", label: "Lista" },
  { key: "in_delivery", label: "En camino" },
  { key: "completed", label: "Completada" },
];

const getStepIndex = (status) => STEPS.findIndex((step) => step.key === status);

export default function OrderProgressTracker({ status }) {
  if (["cancelled", "rejected"].includes(status)) return null;

  const currentIndex = status === "pending" ? -1 : getStepIndex(status);

  return (
    <Stack direction="row" alignItems="flex-start" sx={{ width: "100%", py: 0.5 }}>
      {STEPS.map((step, index) => {
        const completed = index <= currentIndex;
        const active = index === currentIndex + 1 && status === "pending" ? index === 0 : index === currentIndex;
        return (
          <Box key={step.key} sx={{ flex: 1, position: "relative", textAlign: "center", minWidth: 0 }}>
            {index < STEPS.length - 1 && (
              <Box
                sx={{
                  position: "absolute",
                  top: 10,
                  left: "50%",
                  right: "-50%",
                  height: 2,
                  bgcolor: index < currentIndex ? "success.main" : "divider",
                }}
              />
            )}
            <Box
              sx={{
                position: "relative",
                zIndex: 1,
                mx: "auto",
                width: 22,
                height: 22,
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                bgcolor: completed ? "success.main" : active ? "primary.main" : "background.paper",
                border: "2px solid",
                borderColor: completed ? "success.main" : active ? "primary.main" : "divider",
                color: "common.white",
              }}
            >
              {completed && <Check sx={{ fontSize: 14 }} />}
            </Box>
            <Typography
              variant="caption"
              sx={{
                display: { xs: index === 0 || index === STEPS.length - 1 ? "block" : "none", sm: "block" },
                mt: 0.75,
                fontSize: "0.65rem",
                color: completed || active ? "text.primary" : "text.disabled",
                fontWeight: active ? 700 : 500,
              }}
            >
              {step.label}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  );
}
