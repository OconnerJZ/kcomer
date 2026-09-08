import { useState } from "react";
import PropTypes from "prop-types";
import {
  Alert,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  useCancelAdminBusinessPlanTrialMutation,
  useGrantAdminBusinessPlanTrialMutation,
} from "../api/admin.api";
import { adminPlanPropType } from "../model/adminPlanPropTypes";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible actualizar el trial";
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";

export default function AdminPlanTrialPanel({ businessId, plan, onFeedback }) {
  const [trialPlanOverride, setTrialPlanOverride] = useState(null);
  const [startsAt, setStartsAt] = useState("");
  const [endsAt, setEndsAt] = useState("");
  const [grantTrial, grantState] = useGrantAdminBusinessPlanTrialMutation();
  const [cancelTrial, cancelState] = useCancelAdminBusinessPlanTrialMutation();

  const catalog = plan.catalog || [];
  const baseRank = catalog.find((entry) => entry.code === plan.basePlan?.code)?.rank ?? 0;
  const availableTrialPlans = catalog.filter((entry) => (entry.rank ?? 0) > baseRank);
  const trialPlanCode = trialPlanOverride ?? availableTrialPlans[0]?.code ?? "";
  const lifecycle = plan.trial?.lifecycle || "none";
  const hasCurrentTrial = lifecycle === "active" || lifecycle === "scheduled";
  const busy = grantState.isLoading || cancelState.isLoading;

  const grant = async () => {
    try {
      onFeedback(null);
      const start = startsAt ? new Date(startsAt) : new Date();
      const end = new Date(endsAt);
      if (!trialPlanCode || Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end.getTime() <= start.getTime()) {
        onFeedback({ severity: "warning", message: "La fecha final del trial debe ser posterior a su inicio." });
        return;
      }

      const response = await grantTrial({
        businessId,
        planCode: trialPlanCode,
        startsAt: startsAt ? start.toISOString() : undefined,
        endsAt: end.toISOString(),
        expectedVersion: plan.subscription?.version || undefined,
      }).unwrap();
      setTrialPlanOverride(null);
      setStartsAt("");
      setEndsAt("");
      onFeedback({ severity: "success", message: response?.message || "Trial actualizado correctamente." });
    } catch (error) {
      onFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  const cancel = async () => {
    try {
      onFeedback(null);
      const response = await cancelTrial({
        businessId,
        expectedVersion: plan.subscription?.version || undefined,
      }).unwrap();
      onFeedback({ severity: "success", message: response?.message || "Trial cancelado; vuelve a aplicar el plan base." });
    } catch (error) {
      onFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <div>
          <Typography variant="h6" fontWeight={700}>Trial</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            Un trial siempre es un upgrade temporal sobre el plan base; no se usa para degradar ni reemplazar permanentemente la suscripción.
          </Typography>
        </div>

        {hasCurrentTrial ? (
          <Stack spacing={1.5}>
            <Alert severity={lifecycle === "scheduled" ? "info" : "success"}>
              <strong>{plan.trial?.name || plan.trial?.planCode}</strong>{" "}
              {lifecycle === "scheduled"
                ? `programado desde ${dateLabel(plan.trial?.startsAt)} hasta ${dateLabel(plan.trial?.endsAt)}.`
                : `activo hasta ${dateLabel(plan.trial?.endsAt)}.`}
              {" "}Después aplica nuevamente {plan.basePlan?.name || "el plan base"}.
            </Alert>
            <div>
              <Button variant="outlined" color="warning" disabled={busy} onClick={cancel}>
                Cancelar trial
              </Button>
            </div>
          </Stack>
        ) : (
          <Stack spacing={2}>
            {lifecycle === "expired" && (
              <Alert severity="info">
                El trial anterior ({plan.trial?.name || plan.trial?.planCode}) terminó el {dateLabel(plan.trial?.endsAt)}. Puedes iniciar uno nuevo.
              </Alert>
            )}

            {!availableTrialPlans.length ? (
              <Alert severity="info">El negocio ya está en el nivel más alto; no existe un plan superior para ofrecer como trial.</Alert>
            ) : (
              <Stack direction={{ xs: "column", xl: "row" }} spacing={2} alignItems={{ xl: "center" }}>
                <FormControl size="small" sx={{ minWidth: 220 }}>
                  <InputLabel>Plan del trial</InputLabel>
                  <Select label="Plan del trial" value={trialPlanCode} onChange={(event) => setTrialPlanOverride(event.target.value)}>
                    {availableTrialPlans.map((entry) => (
                      <MenuItem key={entry.code} value={entry.code}>{entry.name}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <TextField
                  size="small"
                  label="Inicia (opcional)"
                  type="datetime-local"
                  value={startsAt}
                  onChange={(event) => setStartsAt(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <TextField
                  size="small"
                  label="Finaliza"
                  type="datetime-local"
                  value={endsAt}
                  onChange={(event) => setEndsAt(event.target.value)}
                  InputLabelProps={{ shrink: true }}
                />
                <Button variant="outlined" disabled={busy || !trialPlanCode || !endsAt} onClick={grant}>
                  {startsAt ? "Programar trial" : "Activar trial"}
                </Button>
              </Stack>
            )}
          </Stack>
        )}
      </Stack>
    </Paper>
  );
}

AdminPlanTrialPanel.propTypes = {
  businessId: PropTypes.number.isRequired,
  plan: adminPlanPropType.isRequired,
  onFeedback: PropTypes.func.isRequired,
};
