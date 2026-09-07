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
  Typography,
} from "@mui/material";
import { useAssignAdminBusinessPlanMutation } from "../api/admin.api";
import { adminPlanPropType } from "../model/adminPlanPropTypes";
import PlanImpactPreview from "./PlanImpactPreview";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible actualizar el plan";

export default function AdminPlanBasePanel({ businessId, plan, onFeedback }) {
  const [override, setOverride] = useState(null);
  const [assignPlan, assignState] = useAssignAdminBusinessPlanMutation();
  const catalog = plan.catalog || [];
  const currentBaseCode = plan.basePlan?.code || "free";
  const planCode = override ?? currentBaseCode;
  const selectedName = catalog.find((entry) => entry.code === planCode)?.name || planCode;
  const trialLifecycle = plan.trial?.lifecycle;
  const willCancelTrial = trialLifecycle === "active" || trialLifecycle === "scheduled";

  const assign = async () => {
    try {
      onFeedback(null);
      await assignPlan({
        businessId,
        planCode,
        expectedVersion: plan.subscription?.version || undefined,
      }).unwrap();
      setOverride(null);
      onFeedback({ severity: "success", message: `Plan base actualizado a ${selectedName}.` });
    } catch (error) {
      onFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <div>
          <Typography variant="h6" fontWeight={700}>Plan base</Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 0.4 }}>
            El plan base permanece después de que termine un trial. Los recursos existentes nunca se eliminan automáticamente al bajar de nivel.
          </Typography>
        </div>

        {willCancelTrial && (
          <Alert severity="warning">
            Guardar un nuevo plan base cancelará el trial {trialLifecycle === "scheduled" ? "programado" : "activo"} para evitar estados comerciales ambiguos.
          </Alert>
        )}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems={{ sm: "center" }}>
          <FormControl size="small" sx={{ minWidth: 220 }}>
            <InputLabel>Plan</InputLabel>
            <Select label="Plan" value={planCode} onChange={(event) => setOverride(event.target.value)}>
              {catalog.map((entry) => (
                <MenuItem key={entry.code} value={entry.code}>{entry.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <Button
            variant="contained"
            disabled={assignState.isLoading || !planCode || planCode === currentBaseCode}
            onClick={assign}
          >
            Guardar plan base
          </Button>
          <Typography variant="caption" color="text.secondary">
            Versión {plan.subscription?.version || "—"}
          </Typography>
        </Stack>

        <PlanImpactPreview
          businessId={businessId}
          planCode={planCode}
          currentBasePlanCode={currentBaseCode}
        />
      </Stack>
    </Paper>
  );
}

AdminPlanBasePanel.propTypes = {
  businessId: PropTypes.number.isRequired,
  plan: adminPlanPropType.isRequired,
  onFeedback: PropTypes.func.isRequired,
};
