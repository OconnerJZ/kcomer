import PropTypes from "prop-types";
import { Alert, Box, Chip, CircularProgress, Stack, Typography } from "@mui/material";
import { useGetAdminBusinessPlanImpactQuery } from "../api/admin.api";

const dataOf = (response) => response?.data ?? response;
const LIMIT_LABELS = {
  teamMembers: "Miembros del equipo",
  menuItems: "Productos",
  businessPhotos: "Fotos del negocio",
  analyticsHistoryDays: "Historial de analítica",
};

const DIRECTION_LABELS = {
  upgrade: "Upgrade",
  downgrade: "Downgrade",
  same: "Sin cambio",
};

export default function PlanImpactPreview({ businessId, planCode, currentBasePlanCode }) {
  const shouldSkip = !businessId || !planCode || planCode === currentBasePlanCode;
  const query = useGetAdminBusinessPlanImpactQuery(
    { businessId, planCode },
    { skip: shouldSkip },
  );

  if (shouldSkip) return null;
  if (query.isLoading) {
    return <Box sx={{ mt: 2, display: "flex", alignItems: "center", gap: 1 }}><CircularProgress size={16} /><Typography variant="caption" color="text.secondary">Calculando impacto del cambio…</Typography></Box>;
  }
  if (query.error) {
    return <Alert severity="warning" sx={{ mt: 2 }}>No se pudo calcular el impacto del cambio. No se aplicará ninguna acción destructiva automáticamente.</Alert>;
  }

  const preview = dataOf(query.data);
  const overages = preview?.impact?.overages || [];
  const cancelsTrial = Boolean(preview?.impact?.cancelsActiveTrial);
  const direction = preview?.direction || "same";

  return (
    <Alert severity={overages.length ? "warning" : "info"} variant="outlined" sx={{ mt: 2 }}>
      <Stack spacing={0.75}>
        <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap" useFlexGap>
          <Typography variant="body2" fontWeight={700}>Impacto del cambio</Typography>
          <Chip size="small" label={DIRECTION_LABELS[direction] || direction} variant="outlined" />
        </Stack>
        {!overages.length && <Typography variant="body2">Con la configuración actual, ningún recurso existente queda por encima de un límite.</Typography>}
        {cancelsTrial && <Typography variant="body2">Cambiar el plan base cancelará el trial activo para evitar estados ambiguos.</Typography>}
        {overages.length > 0 && (
          <>
            <Typography variant="body2" fontWeight={700}>Uso que quedaría por encima del plan objetivo:</Typography>
            {overages.map((entry) => (
              <Typography key={entry.key} variant="caption">
                {LIMIT_LABELS[entry.key] || entry.key}: {entry.used} usados / {entry.max} permitidos (+{entry.overBy})
              </Typography>
            ))}
          </>
        )}
        {direction === "downgrade" && (
          <Typography variant="caption" color="text.secondary">
            Política B2: el downgrade nunca elimina productos, miembros ni fotos existentes. Cuando un límite esté aprobado y activamente aplicado, únicamente se bloquearán nuevas altas en el recurso excedido hasta volver a estar dentro del límite.
          </Typography>
        )}
      </Stack>
    </Alert>
  );
}

PlanImpactPreview.propTypes = {
  businessId: PropTypes.number,
  planCode: PropTypes.string,
  currentBasePlanCode: PropTypes.string,
};
