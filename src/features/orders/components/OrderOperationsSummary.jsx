import { Box, Paper, Stack, Typography } from "@mui/material";
import {
  FiberNew,
  RestaurantMenu,
  CheckCircleOutline,
  WarningAmber,
} from "@mui/icons-material";

const ITEMS = [
  { key: "new", label: "Nuevas", icon: FiberNew },
  { key: "preparing", label: "En preparación", icon: RestaurantMenu },
  { key: "ready", label: "Listas", icon: CheckCircleOutline },
  { key: "overdue", label: "Retrasadas", icon: WarningAmber },
];

export default function OrderOperationsSummary({ counts, activeKey, onSelect }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: { xs: "repeat(2, minmax(0, 1fr))", md: "repeat(4, minmax(0, 1fr))" },
        gap: 1.25,
        mb: 2,
      }}
    >
      {ITEMS.map(({ key, label, icon: Icon }) => {
        const active = activeKey === key;
        return (
          <Paper
            key={key}
            component="button"
            type="button"
            onClick={() => onSelect(active ? null : key)}
            elevation={0}
            sx={{
              border: active ? "1px solid" : "1px solid #e7e7e7",
              borderColor: active ? "primary.main" : "#e7e7e7",
              bgcolor: active ? "rgba(255,75,69,0.06)" : "rgba(255,255,255,0.72)",
              backdropFilter: "blur(4px)",
              borderRadius: 2,
              p: { xs: 1.25, sm: 1.5 },
              textAlign: "left",
              cursor: "pointer",
              width: "100%",
              color: "inherit",
              transition: "transform .15s ease, border-color .15s ease, background-color .15s ease",
              "&:hover": {
                transform: "translateY(-1px)",
                borderColor: "primary.main",
              },
            }}
          >
            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
              <Box>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.25 }}>
                  {label}
                </Typography>
                <Typography variant="h5" fontWeight={700} lineHeight={1}>
                  {counts?.[key] || 0}
                </Typography>
              </Box>
              <Icon sx={{ fontSize: 25, color: active ? "primary.main" : "text.secondary" }} />
            </Stack>
          </Paper>
        );
      })}
    </Box>
  );
}
