import { Box, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { LoyaltyRounded } from "@mui/icons-material";
import { useGetMyLoyaltyProgramsQuery } from "../api/loyalty.api";

export default function CustomerLoyaltySummary() {
  const { data: response, isLoading, error } = useGetMyLoyaltyProgramsQuery();
  if (isLoading || error) return null;
  const programs = (response?.data || response || []).filter((item) => item.active);
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
          return (
            <Paper key={item.businessId} variant="outlined" sx={{ p: 1.75, borderRadius: "8px" }}>
              <Stack spacing={1}>
                <Stack direction="row" justifyContent="space-between" gap={1}>
                  <Box>
                    <Typography variant="subtitle2" fontWeight={700}>{item.businessName}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {stamps} de {required} órdenes · recompensa {item.program?.rewardPercent}%
                    </Typography>
                  </Box>
                  {Number(item.progress?.availableRewards || 0) > 0 && (
                    <Typography variant="caption" fontWeight={700} color="primary.main">
                      {item.progress.availableRewards} disponible{item.progress.availableRewards === 1 ? "" : "s"}
                    </Typography>
                  )}
                </Stack>
                <LinearProgress variant="determinate" value={progress} sx={{ height: 6, borderRadius: "8px" }} />
                <Typography variant="caption" color="text.secondary">
                  {Number(item.progress?.availableRewards || 0) > 0
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
