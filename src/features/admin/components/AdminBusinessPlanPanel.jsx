import PropTypes from "prop-types";
import {
  Box,
  Button,
  Chip,
  LinearProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowForwardRounded } from "@mui/icons-material";
import { adminBusinessPlanPropType } from "../model/adminBusinessPropTypes";

const LIMIT_LABELS = Object.freeze({
  teamMembers: "Equipo",
  menuItems: "Productos",
  businessPhotos: "Fotos",
  analyticsHistoryDays: "Historial analytics",
});

const limitProgress = (limit) => {
  if (!limit || limit.used == null || limit.limit == null || Number(limit.limit) <= 0) return null;
  return Math.min(100, Math.max(0, (Number(limit.used) / Number(limit.limit)) * 100));
};

export default function AdminBusinessPlanPanel({ plan, onManage }) {
  const limits = Object.entries(plan?.limits || {});

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2.25}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Plan y capacidad</Typography>
            <Typography variant="body2" color="text.secondary">
              Resumen de la suscripción efectiva. Los cambios se realizan en Planes & Trials.
            </Typography>
          </Box>
          <Button variant="outlined" endIcon={<ArrowForwardRounded />} onClick={onManage}>
            Administrar plan
          </Button>
        </Stack>

        <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
          <Chip label={`Efectivo: ${plan?.plan?.name || plan?.plan?.code || "Gratis"}`} color="primary" />
          <Chip label={`Base: ${plan?.basePlan?.name || plan?.basePlan?.code || "Gratis"}`} variant="outlined" />
          {plan?.trial?.active && <Chip label="Trial activo" color="warning" variant="outlined" />}
          <Chip label={`Estado: ${plan?.subscription?.status || "active"}`} variant="outlined" />
        </Stack>

        {limits.length > 0 && (
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "repeat(2, minmax(0,1fr))" },
              gap: 2,
            }}
          >
            {limits.map(([key, limit]) => {
              const progress = limitProgress(limit);
              const historyLimit = key === "analyticsHistoryDays";
              return (
                <Box key={key} sx={{ minWidth: 0 }}>
                  <Stack direction="row" justifyContent="space-between" gap={1}>
                    <Typography variant="body2" fontWeight={650}>{LIMIT_LABELS[key] || key}</Typography>
                    <Typography variant="caption" color="text.secondary">
                      {historyLimit
                        ? `${limit.limit ?? "∞"} días`
                        : limit.used == null
                          ? `Límite ${limit.limit ?? "∞"}`
                          : `${limit.used} / ${limit.limit ?? "∞"}`}
                    </Typography>
                  </Stack>
                  {progress != null && <LinearProgress variant="determinate" value={progress} sx={{ mt: 0.8, height: 6, borderRadius: 3 }} />}
                </Box>
              );
            })}
          </Box>
        )}
      </Stack>
    </Paper>
  );
}

AdminBusinessPlanPanel.propTypes = {
  plan: adminBusinessPlanPropType,
  onManage: PropTypes.func.isRequired,
};
