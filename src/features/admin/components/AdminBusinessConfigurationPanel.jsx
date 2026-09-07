import {
  Box,
  Chip,
  Divider,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { adminBusinessConfigurationPropType } from "../model/adminBusinessPropTypes";

const PAYMENT_LABELS = Object.freeze({
  cash: "Efectivo",
  card: "Tarjeta",
  wallet: "Wallet",
  transfer: "Transferencia",
});

const DAY_LABELS = Object.freeze({
  monday: "Lun",
  tuesday: "Mar",
  wednesday: "Mié",
  thursday: "Jue",
  friday: "Vie",
  saturday: "Sáb",
  sunday: "Dom",
});

const money = (value) => new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
}).format(Number(value || 0));

export default function AdminBusinessConfigurationPanel({ configuration }) {
  const activePayments = (configuration?.paymentMethods || []).filter((method) => method.active);
  const schedules = configuration?.schedules || [];
  const delivery = configuration?.delivery;

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2.25}>
        <Box>
          <Typography variant="h6" fontWeight={700}>Configuración</Typography>
          <Typography variant="body2" color="text.secondary">
            Lectura operativa de la configuración actual del negocio.
          </Typography>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "repeat(2, minmax(0,1fr))" }, gap: 2.5 }}>
          <Box>
            <Typography variant="overline" color="text.secondary">Ubicación</Typography>
            <Typography variant="body2" fontWeight={650}>
              {configuration?.location?.address || "Sin dirección configurada"}
            </Typography>
            {configuration?.location && (
              <Typography variant="caption" color="text.secondary">
                {[configuration.location.city, configuration.location.postalCode].filter(Boolean).join(" · ") || "Sin ciudad/CP"}
              </Typography>
            )}
          </Box>

          <Box>
            <Typography variant="overline" color="text.secondary">Catálogo</Typography>
            <Typography variant="body2" fontWeight={650}>
              {configuration?.menuItems ?? 0} productos · {configuration?.photos ?? 0} fotos
            </Typography>
            <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.75 }}>
              {(configuration?.foodTypes || []).map((foodType) => (
                <Chip key={foodType.id} size="small" label={foodType.name || `Categoría #${foodType.id}`} variant="outlined" />
              ))}
              {!configuration?.foodTypes?.length && <Typography variant="caption" color="text.secondary">Sin categorías.</Typography>}
            </Stack>
          </Box>
        </Box>

        <Divider />

        <Box>
          <Typography variant="overline" color="text.secondary">Métodos de pago activos</Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
            {activePayments.map((method) => (
              <Chip key={method.method} size="small" label={PAYMENT_LABELS[method.method] || method.method} variant="outlined" />
            ))}
            {!activePayments.length && <Typography variant="body2" color="text.secondary">Sin métodos activos.</Typography>}
          </Stack>
        </Box>

        <Box>
          <Typography variant="overline" color="text.secondary">Delivery</Typography>
          {delivery?.enabled ? (
            <Typography variant="body2">
              Radio {delivery.radiusKm} km · Envío {money(delivery.fee)} · Mínimo {money(delivery.minOrderAmount)}
              {delivery.estimatedTimeMin ? ` · ${delivery.estimatedTimeMin} min estimados` : ""}
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">Delivery desactivado.</Typography>
          )}
        </Box>

        <Box>
          <Typography variant="overline" color="text.secondary">Horarios</Typography>
          <Stack direction="row" spacing={0.75} flexWrap="wrap" useFlexGap sx={{ mt: 0.5 }}>
            {schedules.map((schedule) => (
              <Chip
                key={schedule.id || schedule.day}
                size="small"
                label={`${DAY_LABELS[String(schedule.day || "").toLowerCase()] || schedule.day || "Día"}: ${schedule.isClosed ? "Cerrado" : `${schedule.opened || "—"}–${schedule.closed || "—"}`}`}
                variant="outlined"
              />
            ))}
            {!schedules.length && <Typography variant="body2" color="text.secondary">Sin horarios configurados.</Typography>}
          </Stack>
        </Box>
      </Stack>
    </Paper>
  );
}

AdminBusinessConfigurationPanel.propTypes = {
  configuration: adminBusinessConfigurationPropType,
};
