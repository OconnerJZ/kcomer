import PropTypes from "prop-types";
import {
  Box,
  Button,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { adminPlanSummaryPropType } from "../model/adminPlanPropTypes";

const planLabel = (code = "free") => String(code).replace("level_", "Nivel ").replace("free", "Gratis");
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";

const Metric = ({ label, value }) => (
  <Box>
    <Typography variant="h5" fontWeight={750}>{value ?? 0}</Typography>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
);

Metric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.number,
};

export default function AdminPlanSummaryPanel({ summary, onSelectBusiness }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2.25}>
        <Box>
          <Typography variant="overline" color="text.secondary">PANORAMA COMERCIAL</Typography>
          <Typography variant="h6" fontWeight={700}>Planes y trials en plataforma</Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2, minmax(0,1fr))", md: "repeat(4, minmax(0,1fr))" }, gap: 2 }}>
          <Metric label="Negocios" value={summary.totalBusinesses} />
          <Metric label="Trials activos" value={summary.activeTrials} />
          <Metric label="Trials programados" value={summary.scheduledTrials} />
          <Metric label="Vencen en 7 días" value={summary.expiringTrials7d} />
        </Box>

        <Divider />
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 2.5 }}>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Plan base configurado</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              {(summary.basePlans || []).map((item) => (
                <Chip key={item.planCode} size="small" variant="outlined" label={`${planLabel(item.planCode)} · ${item.businesses}`} />
              ))}
            </Stack>
          </Box>
          <Box>
            <Typography variant="subtitle2" fontWeight={700}>Plan efectivo actual</Typography>
            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap sx={{ mt: 1 }}>
              {(summary.effectivePlans || []).map((item) => (
                <Chip key={item.planCode} size="small" variant="outlined" label={`${planLabel(item.planCode)} · ${item.businesses}`} />
              ))}
            </Stack>
          </Box>
        </Box>

        {(summary.expiringTrials || []).length > 0 && (
          <>
            <Divider />
            <Box>
              <Typography variant="subtitle2" fontWeight={700}>Trials próximos a vencer</Typography>
              <Stack spacing={0.75} sx={{ mt: 1 }}>
                {summary.expiringTrials.map((trial) => (
                  <Stack
                    key={`${trial.businessId}-${trial.endsAt}`}
                    direction={{ xs: "column", sm: "row" }}
                    justifyContent="space-between"
                    alignItems={{ sm: "center" }}
                    gap={1}
                    sx={{ py: 0.75 }}
                  >
                    <Box sx={{ minWidth: 0 }}>
                      <Typography variant="body2" fontWeight={650} noWrap>{trial.businessName}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        {planLabel(trial.planCode)} · vence {dateLabel(trial.endsAt)}
                      </Typography>
                    </Box>
                    <Button size="small" onClick={() => onSelectBusiness(trial.businessId)}>Abrir</Button>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </>
        )}
      </Stack>
    </Paper>
  );
}

AdminPlanSummaryPanel.propTypes = {
  summary: adminPlanSummaryPropType.isRequired,
  onSelectBusiness: PropTypes.func.isRequired,
};
