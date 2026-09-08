import PropTypes from "prop-types";
import { useMemo, useState } from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreRounded from "@mui/icons-material/ExpandMoreRounded";
import RefreshRounded from "@mui/icons-material/RefreshRounded";
import {
  useGetAdminAuditEventsQuery,
  useGetAdminAuditSummaryQuery,
} from "../api/adminAudit.api";

const SOURCE_LABEL = {
  platform: "Plataforma",
  plans: "Planes",
};

const formatDate = (value) => value
  ? new Date(value).toLocaleString("es-MX")
  : "—";

const prettyJson = (value) => {
  if (value == null) return "Sin snapshot";
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
};

function Metric({ label, value }) {
  return (
    <Paper variant="outlined" sx={{ p: 2, minWidth: 0 }}>
      <Typography variant="caption" color="text.secondary">{label}</Typography>
      <Typography variant="h5" fontWeight={700} sx={{ mt: 0.5 }}>{value}</Typography>
    </Paper>
  );
}

Metric.propTypes = {
  label: PropTypes.string.isRequired,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default function AdminAuditPage() {
  const [q, setQ] = useState("");
  const [source, setSource] = useState("");
  const [action, setAction] = useState("");
  const filters = useMemo(() => ({
    ...(q.trim() ? { q: q.trim() } : {}),
    ...(source ? { source } : {}),
    ...(action.trim() ? { action: action.trim() } : {}),
    limit: 75,
  }), [q, source, action]);

  const summaryQuery = useGetAdminAuditSummaryQuery();
  const eventsQuery = useGetAdminAuditEventsQuery(filters);
  const summary = summaryQuery.data;
  const events = eventsQuery.data || [];
  const loading = summaryQuery.isLoading || eventsQuery.isLoading;
  const failed = summaryQuery.error || eventsQuery.error;

  const refresh = () => {
    summaryQuery.refetch();
    eventsQuery.refetch();
  };

  return (
    <Stack spacing={3}>
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={2}>
        <Box>
          <Typography variant="overline" color="text.secondary">SISTEMA</Typography>
          <Typography variant="h4" fontWeight={700}>Auditoría administrativa</Typography>
          <Typography color="text.secondary" sx={{ mt: 0.75, maxWidth: 900 }}>
            Ledger de solo lectura para acciones sensibles del Admin Control Center y cambios de planes.
          </Typography>
        </Box>
        <Button
          variant="outlined"
          startIcon={<RefreshRounded />}
          onClick={refresh}
          disabled={summaryQuery.isFetching || eventsQuery.isFetching}
        >
          Actualizar
        </Button>
      </Stack>

      <Alert severity="info">
        Los registros no se editan desde esta vista. Los cambios administrativos se auditan en la misma transacción que modifica el recurso cuando el dominio lo soporta.
      </Alert>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(3,minmax(0,1fr))" }, gap: 2 }}>
        <Metric label="Eventos registrados" value={summary?.total ?? "—"} />
        <Metric label="Plataforma" value={summary?.sources?.platform ?? "—"} />
        <Metric label="Planes" value={summary?.sources?.plans ?? "—"} />
      </Box>

      <Paper variant="outlined" sx={{ p: 2 }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={1.5}>
          <TextField
            label="Buscar"
            placeholder="Acción, recurso, admin o ID"
            value={q}
            onChange={(event) => setQ(event.target.value)}
            size="small"
            fullWidth
          />
          <TextField
            select
            label="Fuente"
            value={source}
            onChange={(event) => setSource(event.target.value)}
            size="small"
            sx={{ minWidth: { md: 180 } }}
          >
            <MenuItem value="">Todas</MenuItem>
            <MenuItem value="platform">Plataforma</MenuItem>
            <MenuItem value="plans">Planes</MenuItem>
          </TextField>
          <TextField
            label="Acción exacta"
            placeholder="USER_BLOCKED"
            value={action}
            onChange={(event) => setAction(event.target.value)}
            size="small"
            sx={{ minWidth: { md: 240 } }}
          />
        </Stack>
      </Paper>

      {failed && (
        <Alert severity="error" action={<Button onClick={refresh}>Reintentar</Button>}>
          No fue posible consultar la auditoría administrativa.
        </Alert>
      )}

      {loading && !events.length ? (
        <Box sx={{ py: 8, display: "grid", placeItems: "center" }}><CircularProgress /></Box>
      ) : (
        <Stack spacing={1.25}>
          {!failed && events.length === 0 && (
            <Alert severity="info">No hay eventos que coincidan con los filtros actuales.</Alert>
          )}

          {events.map((event) => (
            <Accordion key={event.key} disableGutters variant="outlined" sx={{ "&:before": { display: "none" } }}>
              <AccordionSummary expandIcon={<ExpandMoreRounded />}>
                <Stack
                  direction={{ xs: "column", md: "row" }}
                  alignItems={{ md: "center" }}
                  gap={{ xs: 0.75, md: 1.5 }}
                  sx={{ width: "100%", minWidth: 0, pr: 1 }}
                >
                  <Chip
                    size="small"
                    variant="outlined"
                    label={SOURCE_LABEL[event.source] || event.source}
                    sx={{ alignSelf: { xs: "flex-start", md: "center" } }}
                  />
                  <Box sx={{ flex: 1, minWidth: 0 }}>
                    <Typography fontWeight={700} sx={{ overflowWrap: "anywhere" }}>{event.action}</Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.target?.type || "recurso"}{event.target?.id ? ` #${event.target.id}` : ""}
                    </Typography>
                  </Box>
                  <Box sx={{ minWidth: { md: 220 }, textAlign: { md: "right" } }}>
                    <Typography variant="body2" fontWeight={600}>
                      {event.actor?.name || event.actor?.email || (event.actor?.id ? `Usuario #${event.actor.id}` : "Sistema")}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">{formatDate(event.createdAt)}</Typography>
                  </Box>
                </Stack>
              </AccordionSummary>
              <AccordionDetails>
                <Stack spacing={2}>
                  {event.actor && (
                    <Typography variant="body2" color="text.secondary">
                      Actor: #{event.actor.id}{event.actor.email ? ` · ${event.actor.email}` : ""}
                    </Typography>
                  )}
                  <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2,minmax(0,1fr))" }, gap: 2 }}>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>Antes</Typography>
                      <Box component="pre" sx={{ m: 0, p: 1.5, bgcolor: "action.hover", borderRadius: 1, overflow: "auto", fontSize: "0.75rem", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                        {prettyJson(event.before)}
                      </Box>
                    </Box>
                    <Box>
                      <Typography variant="subtitle2" sx={{ mb: 0.75 }}>Después</Typography>
                      <Box component="pre" sx={{ m: 0, p: 1.5, bgcolor: "action.hover", borderRadius: 1, overflow: "auto", fontSize: "0.75rem", whiteSpace: "pre-wrap", overflowWrap: "anywhere" }}>
                        {prettyJson(event.after)}
                      </Box>
                    </Box>
                  </Box>
                </Stack>
              </AccordionDetails>
            </Accordion>
          ))}
        </Stack>
      )}

      <Typography variant="caption" color="text.secondary">
        Último evento observado: {formatDate(summary?.latestAt)}. La vista muestra hasta 75 eventos por consulta.
      </Typography>
    </Stack>
  );
}
