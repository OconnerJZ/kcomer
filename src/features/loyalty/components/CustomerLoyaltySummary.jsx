import { Box, Chip, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { LoyaltyRounded } from "@mui/icons-material";
import { useGetMyLoyaltyProgramsQuery } from "../api/loyalty.api";

export default function CustomerLoyaltySummary() {
  const { data: response, isLoading, error } = useGetMyLoyaltyProgramsQuery();
  if (isLoading || error) return null;
  const programs = (response?.data || response || []).filter((item) =>
    item.active || item.configuredActive || Number(item.progress?.availableRewards || 0) > 0 || Number(item.progress?.lifetimeStamps || 0) > 0,
  );
  if (!programs.length) return null;

  return (
    <Box sx={{ mb: 2.5 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1.25 }}>
        <LoyaltyRounded color="primary" fontSize="small" />
        <Typography variant="h6" fontWeight={600}>Tus recompensas</Typography>
      </Stack>
      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2,minmax(0,1fr))" }, gap: 1.25 }}>
        {programs.map((item) => {
          const required = Number(item.program?.ordersRequired || 1);
          const stamps = Number(item.progress?.stamps || 0);
          const progress = Math.min(100, Math.round((stamps / required) * 100));
          const availableRewards = Number(item.progress?.availableRewards || 0);
          return (
            <Paper key={item.businessId} variant="outlined" sx={{ p: 1.75, borderRadius: "8px" }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" gap={1} alignItems="flex-start">
                  <Box>
                    <Stack direction="row" gap={0.75} alignItems="center" flexWrap="wrap">
                      <Typography variant="subtitle2" fontWeight={700}>{item.businessName}</Typography>
                      {item.pausedByPlan && <Chip size="small" label="Programa pausado" variant="outlined" />}
                    </Stack>
                    <Typography variant="caption" color="text.secondary">
                      {stamps} de {required} órdenes · recompensa {item.program?.rewardPercent}%
                    </Typography>
                  </Box>
                  {availableRewards > 0 && (
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {availableRewards} disponible{availableRewards === 1 ? "" : "s"}
                    </Typography>
                  )}
                </Stack>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: "8px" }} />
                <Typography variant="caption" color="text.secondary">
                  {item.pausedByPlan
                    ? "Tu progreso y tus recompensas se conservan. Este negocio pausó temporalmente la acumulación por su plan actual."
                    : availableRewards > 0
                      ? "Tu recompensa ya fue generada. El canje en checkout llegará en la siguiente etapa."
                      : `Te ${item.progress?.remaining === 1 ? "falta" : "faltan"} ${item.progress?.remaining || 0} orden${item.progress?.remaining === 1 ? "" : "es"} para la siguiente recompensa.`}
                </Typography>
              </Stack>
            </Paper>
          );
        })}
      </Box>
    </Box>
  );
}
