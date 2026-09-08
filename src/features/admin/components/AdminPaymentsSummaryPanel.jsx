import PropTypes from "prop-types";
import { Alert, Box, CircularProgress, Paper, Stack, Typography } from "@mui/material";
import { useGetAdminPaymentSummaryQuery } from "../api/adminPayments.api";

const errorMessage = (error) => error?.data?.message || error?.data || error?.message || "No fue posible cargar el resumen de pagos";

function Metric({ label, value, helper }) {
  return (
    <Box sx={{ minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary" fontWeight={700}>{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.25 }}>{value}</Typography>
      {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
    </Box>
  );
}

Metric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
  helper: PropTypes.string,
};

export default function AdminPaymentsSummaryPanel() {
  const query = useGetAdminPaymentSummaryQuery();
  const data = query.data;

  if (query.isLoading) {
    return <Paper variant="outlined" sx={{ p: 4, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Paper>;
  }
  if (query.error) {
    return <Alert severity="error">{errorMessage(query.error)}</Alert>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Estado de evidencias</Typography>
          <Typography variant="body2" color="text.secondary">
            Visibilidad global de transferencias reportadas y de las revisiones realizadas por cada negocio.
          </Typography>
        </Box>
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "repeat(2,minmax(0,1fr))", md: "repeat(5,minmax(0,1fr))" }, gap: 2 }}>
          <Metric label="REPORTADAS" value={data?.transfers?.reported ?? 0} helper="Pendientes de revisión" />
          <Metric label="ACLARACIÓN" value={data?.transfers?.requiresClarification ?? 0} helper="Esperan nueva evidencia" />
          <Metric label="REVISADAS" value={data?.transfers?.reviewed ?? 0} helper="Marcadas por el negocio" />
          <Metric label="COMPROBANTES" value={data?.evidences?.total ?? 0} helper="Histórico conservado" />
          <Metric label="ÚLTIMOS 7 DÍAS" value={data?.evidences?.addedLast7d ?? 0} helper="Evidencias nuevas" />
        </Box>
      </Stack>
    </Paper>
  );
}
