import { Box, Divider, Paper, Stack, Typography } from "@mui/material";
import { adminUserActivityPropType } from "../model/adminUserPropTypes";

const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "Sin órdenes";

const Metric = ({ label, value }) => (
  <Box>
    <Typography variant="h5" fontWeight={750}>{value ?? 0}</Typography>
    <Typography variant="caption" color="text.secondary">{label}</Typography>
  </Box>
);

Metric.propTypes = {
  label: Typography.propTypes?.children || (() => null),
  value: Typography.propTypes?.children || (() => null),
};

export default function AdminUserActivityPanel({ activity }) {
  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">ACTIVIDAD</Typography>
          <Typography variant="h6" fontWeight={700}>Resumen disponible</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
            Métricas agregadas; no exponen datos de otros usuarios ni modifican historial.
          </Typography>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "repeat(2, minmax(0,1fr))", sm: "repeat(3, minmax(0,1fr))" },
            gap: 2,
          }}
        >
          <Metric label="Negocios" value={activity.businesses} />
          <Metric label="Órdenes totales" value={activity.totalOrders} />
          <Metric label="Órdenes 30 días" value={activity.ordersLast30Days} />
          <Metric label="Completadas" value={activity.completedOrders} />
          <Metric label="Reseñas" value={activity.totalReviews} />
          <Metric label="Direcciones" value={activity.totalAddresses} />
        </Box>

        <Divider />
        <Typography variant="body2" color="text.secondary">
          Última orden: <strong>{dateLabel(activity.lastOrderAt)}</strong>
        </Typography>
      </Stack>
    </Paper>
  );
}

AdminUserActivityPanel.propTypes = {
  activity: adminUserActivityPropType.isRequired,
};
