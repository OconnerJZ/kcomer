import { Alert, Box, CircularProgress, LinearProgress, Paper, Stack, Typography } from "@mui/material";
import { GroupsRounded, PersonAddAltRounded, RepeatRounded, ShoppingCartCheckoutRounded } from "@mui/icons-material";
import { useGetCustomerIntelligenceQuery } from "../api/stats.api";
import { integer, money } from "../model/statsPresentation";

const Metric = ({ label, value, helper, icon }) => (
  <Paper variant="outlined" sx={{ p: 1.75, borderRadius: "8px", minWidth: 0 }}>
    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
      <Box minWidth={0}>
        <Typography variant="caption" color="text.secondary">{label}</Typography>
        <Typography variant="h5" fontWeight={650} sx={{ mt: .25 }}>{value}</Typography>
        {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
      </Box>
      <Box sx={{ color: "text.secondary", display: "grid", placeItems: "center" }}>{icon}</Box>
    </Stack>
  </Paper>
);

const DistributionRow = ({ label, value, total, helper }) => {
  const percent = total > 0 ? Math.min(100, Math.round((Number(value || 0) / total) * 100)) : 0;
  return (
    <Stack spacing={.6}>
      <Stack direction="row" justifyContent="space-between" gap={1}>
        <Typography variant="body2">{label}</Typography>
        <Typography variant="body2" fontWeight={650}>{integer(value)} · {percent}%</Typography>
      </Stack>
      <LinearProgress variant="determinate" value={percent} sx={{ height: 6, borderRadius: "8px" }} />
      {helper && <Typography variant="caption" color="text.secondary">{helper}</Typography>}
    </Stack>
  );
};

export default function CustomerIntelligence({ businessId, period, entitled }) {
  const { data: response, isLoading, isFetching, error } = useGetCustomerIntelligenceQuery(
    { businessId, period },
    { skip: !businessId || !entitled },
  );

  if (!entitled) {
    return (
      <Alert severity="info" variant="outlined" sx={{ borderRadius: "8px" }}>
        Customer Intelligence está disponible desde Nivel 2. Las métricas básicas de clientes continúan disponibles en Finanzas y clientes.
      </Alert>
    );
  }

  if (isLoading) return <Box sx={{ minHeight: 220, display: "grid", placeItems: "center" }}><CircularProgress size={28} /></Box>;
  if (error) return <Alert severity="error">{error?.data?.message || error?.message || "No fue posible cargar Customer Intelligence"}</Alert>;

  const data = response?.data || response;
  if (!data) return <Alert severity="info">Todavía no hay información de clientes suficiente para este periodo.</Alert>;

  const { summary = {}, cohorts = {}, lifecycle = {}, inactivity = {}, sharedOrders = {}, signals = [], sufficientData, privacyNote } = data;
  const newCohort = cohorts.new || {};
  const returning = cohorts.returning || {};

  return (
    <Stack spacing={2} sx={{ opacity: isFetching ? .78 : 1, transition: "opacity .2s" }}>
      <Box>
        <Typography variant="h6" fontWeight={650}>Customer Intelligence</Typography>
        <Typography variant="body2" color="text.secondary">
          Entiende adquisición, recurrencia, inactividad y el efecto de las órdenes compartidas sin exponer datos personales de clientes.
        </Typography>
      </Box>

      {!sufficientData && (
        <Alert severity="info" variant="outlined" sx={{ borderRadius: "8px" }}>
          Hay pocos datos en este periodo. Mostramos métricas descriptivas, pero omitimos señales accionables hasta contar con al menos 5 clientes y 5 órdenes.
        </Alert>
      )}

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", sm: "repeat(2,minmax(0,1fr))", lg: "repeat(4,minmax(0,1fr))" }, gap: 1.25 }}>
        <Metric label="Clientes nuevos" value={integer(summary.newCustomers)} helper={`${summary.newCustomerShare || 0}% del periodo`} icon={<PersonAddAltRounded fontSize="small" />} />
        <Metric label="Clientes recurrentes" value={integer(summary.returningCustomers)} helper={`${summary.returningCustomerShare || 0}% del periodo`} icon={<RepeatRounded fontSize="small" />} />
        <Metric label="Recompra observada" value={`${summary.observedRepeatRate || 0}%`} helper="Dentro del historial disponible" icon={<GroupsRounded fontSize="small" />} />
        <Metric label="Órdenes por cliente" value={Number(summary.ordersPerCustomer || 0).toFixed(2)} helper={`${integer(summary.orders)} órdenes completadas`} icon={<ShoppingCartCheckoutRounded fontSize="small" />} />
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "repeat(2,minmax(0,1fr))" }, gap: 1.5 }}>
        <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
          <Typography variant="subtitle1" fontWeight={650}>Nuevos vs recurrentes</Typography>
          <Typography variant="caption" color="text.secondary">Comparación de clientes que compraron durante el periodo seleccionado.</Typography>
          <Box sx={{ mt: 1.75, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 1.25 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Ticket nuevos</Typography>
              <Typography variant="h6">{money(newCohort.averageTicket)}</Typography>
              <Typography variant="caption" color="text.secondary">{integer(newCohort.orders)} órdenes · {money(newCohort.revenue)} ventas</Typography>
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary">Ticket recurrentes</Typography>
              <Typography variant="h6">{money(returning.averageTicket)}</Typography>
              <Typography variant="caption" color="text.secondary">{integer(returning.orders)} órdenes · {money(returning.revenue)} ventas</Typography>
            </Box>
          </Box>
          <Typography variant="body2" sx={{ mt: 1.5 }} color="text.secondary">
            Diferencia de ticket recurrente vs nuevo: <strong>{Number(cohorts.ticketDifferencePercent || 0).toFixed(1)}%</strong>
          </Typography>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
          <Typography variant="subtitle1" fontWeight={650}>Frecuencia observada</Typography>
          <Typography variant="caption" color="text.secondary">{lifecycle.note}</Typography>
          <Stack spacing={1.4} sx={{ mt: 1.6 }}>
            <DistributionRow label="1 orden" value={lifecycle.oneOrder} total={lifecycle.totalCustomers} />
            <DistributionRow label="2–3 órdenes" value={lifecycle.twoToThree} total={lifecycle.totalCustomers} />
            <DistributionRow label="4–7 órdenes" value={lifecycle.fourToSeven} total={lifecycle.totalCustomers} />
            <DistributionRow label="8+ órdenes" value={lifecycle.eightPlus} total={lifecycle.totalCustomers} />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
          <Typography variant="subtitle1" fontWeight={650}>Actividad de la base</Typography>
          <Typography variant="caption" color="text.secondary">Días desde la última orden completada dentro del historial observable.</Typography>
          <Stack spacing={1.4} sx={{ mt: 1.6 }}>
            <DistributionRow label="Activos · 0–30 días" value={inactivity.active30Days} total={inactivity.observedCustomers} />
            <DistributionRow label="En enfriamiento · 31–60" value={inactivity.cooling31To60Days} total={inactivity.observedCustomers} />
            <DistributionRow label="En riesgo · 61–90" value={inactivity.atRisk61To90Days} total={inactivity.observedCustomers} />
            <DistributionRow label="Inactivos · 90+" value={inactivity.inactive90PlusDays} total={inactivity.observedCustomers} helper={`${inactivity.inactiveShare || 0}% de la base observada`} />
          </Stack>
        </Paper>

        <Paper variant="outlined" sx={{ p: 2, borderRadius: "8px" }}>
          <Typography variant="subtitle1" fontWeight={650}>Órdenes compartidas</Typography>
          <Typography variant="caption" color="text.secondary">Shared Orders sigue siendo una función core; aquí solo analizamos su impacto agregado.</Typography>
          <Box sx={{ mt: 1.6, display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 1.3 }}>
            <Box><Typography variant="caption" color="text.secondary">Participación</Typography><Typography variant="h6">{sharedOrders.orderShare || 0}%</Typography><Typography variant="caption" color="text.secondary">{integer(sharedOrders.sharedOrders)} compartidas</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Grupo promedio</Typography><Typography variant="h6">{Number(sharedOrders.averageParticipants || 0).toFixed(1)}</Typography><Typography variant="caption" color="text.secondary">participantes</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Ticket compartida</Typography><Typography variant="h6">{money(sharedOrders.averageTicket)}</Typography></Box>
            <Box><Typography variant="caption" color="text.secondary">Ticket individual</Typography><Typography variant="h6">{money(sharedOrders.individualAverageTicket)}</Typography></Box>
          </Box>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1.5 }}>Lift de ticket compartida vs individual: <strong>{Number(sharedOrders.ticketLiftPercent || 0).toFixed(1)}%</strong></Typography>
        </Paper>
      </Box>

      {signals.length > 0 && (
        <Stack spacing={1}>
          <Typography variant="subtitle1" fontWeight={650}>Señales</Typography>
          {signals.map((signal) => (
            <Alert key={signal.key} severity={signal.type === "warning" ? "warning" : signal.type === "positive" ? "success" : "info"} variant="outlined" sx={{ borderRadius: "8px" }}>
              {signal.message}
            </Alert>
          ))}
        </Stack>
      )}

      <Typography variant="caption" color="text.secondary">{privacyNote}</Typography>
    </Stack>
  );
}
