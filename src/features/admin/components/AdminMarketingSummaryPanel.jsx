import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { useGetAdminMarketingSummaryQuery } from "../api/adminMarketing.api";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible cargar el resumen";

function Metric({ label, value }) {
  return (
    <Box>
      <Typography variant="h5" fontWeight={700}>{Number(value || 0).toLocaleString("es-MX")}</Typography>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
    </Box>
  );
}

Metric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
};

export default function AdminMarketingSummaryPanel() {
  const query = useGetAdminMarketingSummaryQuery();
  const data = dataOf(query.data);

  if (query.isLoading) {
    return <Paper variant="outlined" sx={{ p: 4, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Paper>;
  }
  if (query.error) {
    return <Alert severity="error" action={<Button color="inherit" onClick={query.refetch}>Reintentar</Button>}>{errorMessage(query.error)}</Alert>;
  }

  return (
    <Paper variant="outlined" sx={{ p: 2.5 }}>
      <Stack spacing={2.25}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Estado operativo</Typography>
          <Typography variant="body2" color="text.secondary">
            Visibilidad global de campañas y cola publicitaria. Los datos son operativos; no representan facturación.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 3 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">MARKETING CENTER</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 2, mt: 1 }}>
              <Metric label="Campañas" value={data?.marketing?.total} />
              <Metric label="Activas" value={data?.marketing?.active} />
              <Metric label="Pausadas" value={data?.marketing?.paused} />
            </Box>
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">QSCOME ADS</Typography>
            <Box sx={{ display: "grid", gridTemplateColumns: "repeat(3,minmax(0,1fr))", gap: 2, mt: 1 }}>
              <Metric label="Pendientes" value={data?.ads?.pendingModeration} />
              <Metric label="Aprobadas" value={data?.ads?.approved} />
              <Metric label="Rechazadas" value={data?.ads?.rejected} />
            </Box>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}
