import PropTypes from "prop-types";
import {
  Alert,
  Box,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useGetAdminBusinessPlanHistoryQuery } from "../api/admin.api";

const dataOf = (response) => response?.data ?? response;
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";
const planLabel = (code) => code ? String(code).replace("level_", "Nivel ").replace("free", "Gratis") : "—";
const actionLabel = {
  PLAN_ASSIGNED: "Plan base actualizado",
  TRIAL_STARTED: "Trial iniciado o programado",
  TRIAL_CANCELLED: "Trial cancelado",
};

export default function AdminPlanHistoryPanel({ businessId }) {
  const query = useGetAdminBusinessPlanHistoryQuery({ businessId });
  const history = dataOf(query.data) || [];

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Historial comercial</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            Cambios de plan y trial con actor administrativo para mantener trazabilidad.
          </Typography>
        </Box>

        {query.isLoading && <CircularProgress size={24} />}
        {query.error && <Alert severity="error">No fue posible cargar el historial comercial.</Alert>}
        {!query.isLoading && !query.error && !history.length && (
          <Typography variant="body2" color="text.secondary">Aún no hay eventos de plan registrados.</Typography>
        )}

        {!query.error && history.map((event) => {
          const actor = event.actor?.name || event.actor?.email || (event.actorUserId ? `Admin #${event.actorUserId}` : "Sistema");
          return (
            <Box
              key={event.auditId}
              sx={{
                display: "grid",
                gridTemplateColumns: { xs: "1fr", sm: "180px minmax(0,1fr)" },
                gap: 1,
                py: 1.15,
                borderBottom: "1px solid",
                borderColor: "divider",
              }}
            >
              <Typography variant="caption" color="text.secondary">{dateLabel(event.createdAt)}</Typography>
              <Box sx={{ minWidth: 0 }}>
                <Typography variant="body2" fontWeight={650}>{actionLabel[event.action] || event.action}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {planLabel(event.previousPlan)} → {planLabel(event.nextPlan)} · {actor}
                </Typography>
              </Box>
            </Box>
          );
        })}
      </Stack>
    </Paper>
  );
}

AdminPlanHistoryPanel.propTypes = {
  businessId: PropTypes.number.isRequired,
};
