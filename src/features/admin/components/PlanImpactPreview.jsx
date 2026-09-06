import PropTypes from "prop-types";
import { Alert, Box, CircularProgress, Stack, Typography } from "@mui/material";
import { useGetAdminBusinessPlanImpactQuery } from "../api/admin.api";

const dataOf = (response) => response?.data ?? response;
const LIMIT_LABELS = {
  teamMembers: "Miembros del equipo",
  menuItems: "Productos",
  businessPhotos: "Fotos del negocio",
  analyticsHistoryDays: "Historial de analítica",
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

  if (!overages.length && !cancelsTrial) {
    return <Alert severity="success" variant="outlined" sx={{ mt: 2 }}>Con la configuración comercial actual, este cambio no deja recursos existentes por encima de un límite.</Alert>;
  }

  return (
    <Alert severity={overages.length ? "warning" : "info"} variant="outlined" sx={{ mt: 2 }}>
      <Stack spacing={0.5}>
        {cancelsTrial && <Typography variant="body2">El cambio de plan base cancelará el trial activo.</Typography>}
        {overages.length > 0 && (
          <>
            <Typography variant="body2" fontWeight={700}>Uso que excedería el plan objetivo:</Typography>
            {overages.map((entry) => (
              <Typography key={entry.key} variant="caption">
                {LIMIT_LABELS[entry.key] || entry.key}: {entry.used} usados / {entry.max} permitidos (+{entry.overBy})
              </Typography>
            ))}
            <Typography variant="caption" color="text.secondary">Este preview no elimina productos, miembros ni fotos. La política de downgrade se definirá antes de activar límites comerciales.</Typography>
          </>
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
