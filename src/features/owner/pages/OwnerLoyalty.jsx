import { useEffect, useMemo, useState } from "react";
import { Alert, Box, Button, CircularProgress, FormControlLabel, Paper, Slider, Stack, Switch, TextField, Typography } from "@mui/material";
import PropTypes from "prop-types";
import { useGetBusinessPlanQuery } from "@Features/business/api/business.api";
import { useGetLoyaltyProgramQuery, useSaveLoyaltyProgramMutation } from "@Features/loyalty/api/loyalty.api";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";

export default function OwnerLoyalty({ businessId }) {
  const programQuery = useGetLoyaltyProgramQuery({ businessId }, { skip: !businessId });
  const planQuery = useGetBusinessPlanQuery({ businessId }, { skip: !businessId });
  const [saveProgram, saveState] = useSaveLoyaltyProgramMutation();
  const [feedback, setFeedback] = useState(null);
  const [form, setForm] = useState({ isActive: false, ordersRequired: 5, rewardPercent: 10, minOrderAmount: 0 });

  const planData = planQuery.data?.data || planQuery.data || {};
  const entitlement = useMemo(
    () => (planData.plan?.features || planData.current?.features || []).find((feature) => feature.key === "loyalty.management"),
    [planData],
  );
  const canManage = Boolean(entitlement?.included && entitlement?.status === "available");

  useEffect(() => {
    const program = programQuery.data?.data || programQuery.data;
    if (!program) return;
    setForm({
      isActive: Boolean(program.active),
      ordersRequired: Number(program.ordersRequired || 5),
      rewardPercent: Number(program.rewardPercent || 10),
      minOrderAmount: Number(program.minOrderAmount || 0),
    });
  }, [programQuery.data]);

  if (programQuery.isLoading || planQuery.isLoading) {
    return <Box sx={{ minHeight: 320, display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }
  if (programQuery.error || planQuery.error) {
    return <Alert severity="error">{errorMessage(programQuery.error || planQuery.error)}</Alert>;
  }

  const submit = async () => {
    try {
      setFeedback(null);
      await saveProgram({ businessId, ...form }).unwrap();
      setFeedback({ severity: "success", message: "Programa de lealtad actualizado." });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Stack spacing={2.5}>
      <Box>
        <Typography variant="h4" fontWeight={700}>Lealtad</Typography>
        <Typography variant="body2" color="text.secondary">
          Premia la recurrencia sin convertir la experiencia del cliente en una suscripción.
        </Typography>
      </Box>

      {!canManage && (
        <Alert severity="info" variant="outlined">
          Los clientes pueden participar gratuitamente en programas de lealtad. La configuración del programa está disponible desde Nivel 1.
        </Alert>
      )}
      {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

      <Paper variant="outlined" sx={{ p: { xs: 2, sm: 2.5 }, borderRadius: "8px" }}>
        <Stack spacing={3}>
          <Box>
            <Typography variant="h6" fontWeight={600}>Programa por órdenes completadas</Typography>
            <Typography variant="body2" color="text.secondary">
              Cada orden completada que alcance el monto mínimo suma 1 avance. Al completar el ciclo se genera una recompensa de descuento.
            </Typography>
          </Box>

          <FormControlLabel
            control={<Switch checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} />}
            label={form.isActive ? "Programa activo" : "Programa pausado"}
            disabled={!canManage}
          />

          <Box>
            <Typography variant="body2" fontWeight={600}>Órdenes requeridas: {form.ordersRequired}</Typography>
            <Slider
              value={form.ordersRequired}
              min={2}
              max={20}
              step={1}
              marks={[{ value: 2, label: "2" }, { value: 5, label: "5" }, { value: 10, label: "10" }, { value: 20, label: "20" }]}
              onChange={(_event, value) => setForm((current) => ({ ...current, ordersRequired: Number(value) }))}
              disabled={!canManage}
            />
          </Box>

          <Box>
            <Typography variant="body2" fontWeight={600}>Descuento de recompensa: {form.rewardPercent}%</Typography>
            <Slider
              value={form.rewardPercent}
              min={5}
              max={30}
              step={1}
              marks={[{ value: 5, label: "5%" }, { value: 10, label: "10%" }, { value: 20, label: "20%" }, { value: 30, label: "30%" }]}
              onChange={(_event, value) => setForm((current) => ({ ...current, rewardPercent: Number(value) }))}
              disabled={!canManage}
            />
          </Box>

          <TextField
            label="Monto mínimo por orden"
            type="number"
            size="small"
            value={form.minOrderAmount}
            onChange={(event) => setForm((current) => ({ ...current, minOrderAmount: Math.max(0, Number(event.target.value || 0)) }))}
            inputProps={{ min: 0, step: 10 }}
            helperText="Una orden por debajo de este monto no suma avance. Usa 0 para no exigir mínimo."
            disabled={!canManage}
          />

          <Paper elevation={0} sx={{ p: 2, bgcolor: "grey.50", borderRadius: "8px" }}>
            <Typography variant="subtitle2" fontWeight={700}>Ejemplo</Typography>
            <Typography variant="body2" color="text.secondary">
              Después de {form.ordersRequired} órdenes completadas elegibles, el cliente obtiene una recompensa de {form.rewardPercent}% de descuento para un canje futuro.
            </Typography>
          </Paper>

          <Stack direction="row" justifyContent="flex-end">
            <Button variant="contained" disabled={!canManage || saveState.isLoading} onClick={submit}>
              {saveState.isLoading ? "Guardando…" : "Guardar programa"}
            </Button>
          </Stack>
        </Stack>
      </Paper>

      <Alert severity="warning" variant="outlined">
        B4.1 acumula progreso y genera recompensas. El consumo del descuento en checkout se conectará en B4.2 con validación y snapshot del lado servidor; todavía no se descuenta dinero de una orden.
      </Alert>
    </Stack>
  );
}

OwnerLoyalty.propTypes = {
  businessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
};
