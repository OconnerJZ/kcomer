import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import LockRounded from "@mui/icons-material/LockRounded";
import {
  useGetAdminFeaturesQuery,
  useUpdateAdminGlobalFeatureMutation,
  useUpdateAdminPlanFeatureMutation,
} from "../api/admin.api";
import FeatureModeSelect, { FEATURE_MODE_LABELS } from "./FeatureModeSelect";

const dataOf = (response) => response?.data ?? response;
const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible aplicar el cambio";
const modeColor = (mode) => mode === "enabled" ? "success" : mode === "read_only" ? "warning" : "default";

export default function AdminFeatureCatalogPanel() {
  const query = useGetAdminFeaturesQuery();
  const [setGlobal, globalState] = useUpdateAdminGlobalFeatureMutation();
  const [setPlan, planState] = useUpdateAdminPlanFeatureMutation();
  const [pending, setPending] = useState(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);
  const data = dataOf(query.data);
  const features = data?.features || [];
  const busy = globalState.isLoading || planState.isLoading;

  const queueChange = (feature, scope, scopeValue, value) => {
    setPending({ feature, scope, scopeValue, mode: value === "inherit" ? null : value });
    setReason("");
    setFeedback(null);
  };

  const apply = async () => {
    if (!pending || reason.trim().length < 3) return;
    try {
      const payload = {
        featureKey: pending.feature.key,
        mode: pending.mode,
        reason: reason.trim(),
      };
      if (pending.scope === "global") {
        await setGlobal(payload).unwrap();
      } else {
        await setPlan({ ...payload, planCode: pending.scopeValue }).unwrap();
      }
      setFeedback({ severity: "success", message: "Política de feature actualizada." });
      setPending(null);
      setReason("");
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  if (query.isLoading) {
    return <Paper variant="outlined" sx={{ p: 5, display: "grid", placeItems: "center" }}><CircularProgress /></Paper>;
  }
  if (query.error) {
    return <Alert severity="error" action={<Button color="inherit" onClick={query.refetch}>Reintentar</Button>}>{errorMessage(query.error)}</Alert>;
  }

  return (
    <Stack spacing={2}>
      <Paper variant="outlined" sx={{ p: 2.5 }}>
        <Typography variant="h6" fontWeight={700}>Política global y por plan</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
          Global funciona como control de seguridad: Deshabilitado apaga la feature y Solo lectura limita escrituras. Después se resuelve negocio → plan → entitlement comercial.
        </Typography>
      </Paper>

      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      {pending && (
        <Paper variant="outlined" sx={{ p: 2.5 }}>
          <Stack spacing={1.5}>
            <Typography fontWeight={700}>Confirmar cambio · {pending.feature.label}</Typography>
            <Typography variant="body2" color="text.secondary">
              {pending.scope === "global" ? "Global" : `Plan ${pending.scopeValue}`} → {pending.mode ? FEATURE_MODE_LABELS[pending.mode] : "Heredar"}
            </Typography>
            <TextField
              size="small"
              label="Motivo administrativo"
              value={reason}
              onChange={(event) => setReason(event.target.value)}
              inputProps={{ maxLength: 500 }}
              helperText="Se guardará en auditoría."
            />
            <Stack direction="row" spacing={1}>
              <Button variant="contained" disabled={busy || reason.trim().length < 3} onClick={apply}>Aplicar</Button>
              <Button disabled={busy} onClick={() => { setPending(null); setReason(""); }}>Cancelar</Button>
            </Stack>
          </Stack>
        </Paper>
      )}

      <Paper variant="outlined" sx={{ overflowX: "auto" }}>
        <Box sx={{ minWidth: 980 }}>
          <Box sx={{ display: "grid", gridTemplateColumns: "minmax(250px,1.4fr) 155px repeat(4,155px)", gap: 1, px: 2, py: 1.5, borderBottom: "1px solid", borderColor: "divider", bgcolor: "action.hover" }}>
            <Typography variant="caption" fontWeight={700}>FEATURE</Typography>
            <Typography variant="caption" fontWeight={700}>GLOBAL</Typography>
            {['Gratis', 'Nivel 1', 'Nivel 2', 'Nivel 3'].map((label) => <Typography key={label} variant="caption" fontWeight={700}>{label}</Typography>)}
          </Box>

          {features.map((feature) => (
            <Box key={feature.key} sx={{ display: "grid", gridTemplateColumns: "minmax(250px,1.4fr) 155px repeat(4,155px)", gap: 1, px: 2, py: 1.5, alignItems: "center", borderBottom: "1px solid", borderColor: "divider" }}>
              <Box sx={{ minWidth: 0 }}>
                <Stack direction="row" spacing={0.75} alignItems="center" flexWrap="wrap" useFlexGap>
                  <Typography variant="body2" fontWeight={700}>{feature.label}</Typography>
                  {feature.immutable && <Chip icon={<LockRounded />} size="small" label="Protegida" variant="outlined" />}
                  {feature.status === "coming_soon" && <Chip size="small" label="Próximamente" variant="outlined" />}
                </Stack>
                <Typography variant="caption" color="text.secondary" sx={{ display: "block" }}>{feature.key}</Typography>
                {feature.immutableReason && <Typography variant="caption" color="text.secondary">{feature.immutableReason}</Typography>}
              </Box>

              <FeatureModeSelect
                value={feature.globalOverride?.mode || "inherit"}
                disabled={feature.immutable}
                ariaLabel={`Control global ${feature.label}`}
                onChange={(value) => queueChange(feature, "global", "*", value)}
              />

              {feature.plans.map((plan) => (
                <Stack key={plan.planCode} spacing={0.5}>
                  <FeatureModeSelect
                    value={plan.override?.mode || "inherit"}
                    disabled={feature.immutable}
                    ariaLabel={`${feature.label} ${plan.planName}`}
                    onChange={(value) => queueChange(feature, "plan", plan.planCode, value)}
                  />
                  <Chip size="small" label={`Efectivo: ${FEATURE_MODE_LABELS[plan.effectiveMode]}`} color={modeColor(plan.effectiveMode)} variant="outlined" />
                </Stack>
              ))}
            </Box>
          ))}
        </Box>
      </Paper>
    </Stack>
  );
}
