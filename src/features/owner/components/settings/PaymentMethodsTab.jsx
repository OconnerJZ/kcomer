import PropTypes from "prop-types";
import {
  Alert,
  Box,
  Button,
  Collapse,
  Grid,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  AccountBalance,
  CreditCard,
  LocalAtm,
  Payments,
  Smartphone,
} from "@mui/icons-material";
import SettingsSection from "./SettingsSection";

const paymentIcon = (method = "") => {
  const key = String(method).toLowerCase();
  if (key.includes("cash") || key.includes("efect")) return <LocalAtm fontSize="small" />;
  if (key.includes("card") || key.includes("tarjet")) return <CreditCard fontSize="small" />;
  if (key.includes("wallet") || key.includes("billetera")) return <Smartphone fontSize="small" />;
  if (key.includes("transfer")) return <AccountBalance fontSize="small" />;
  return <Payments fontSize="small" />;
};

const PaymentMethodsTab = ({ paymentMethods, onToggle, onConfigChange, onSave, loading }) => {
  const activeCount = paymentMethods.filter((method) => method.active).length;
  const transfer = paymentMethods.find((method) => method.method === "transfer");
  const config = transfer?.config || {};

  return (
    <SettingsSection
      eyebrow="PAGOS"
      title="Métodos aceptados"
      description="Activa únicamente las opciones que realmente puedes recibir. El cliente solo verá los métodos disponibles."
    >
      <Stack spacing={2.5}>
        <Box>
          <Typography variant="h5" fontWeight={800} component="span">{activeCount}</Typography>
          <Typography variant="body2" color="text.secondary" component="span" sx={{ ml: 0.75 }}>
            métodos activos
          </Typography>
        </Box>

        <Box sx={{ borderTop: "1px solid", borderBottom: "1px solid", borderColor: "divider" }}>
          {paymentMethods.map((method, index) => (
            <Box
              key={method.method}
              sx={{
                p: 1.5,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                borderBottom: index < paymentMethods.length - 1 ? "1px solid" : 0,
                borderColor: "divider",
              }}
            >
              <Stack direction="row" spacing={1.4} alignItems="center">
                <Box
                  sx={{
                    width: 36,
                    height: 36,
                    borderRadius: "10px",
                    display: "grid",
                    placeItems: "center",
                    bgcolor: method.active ? "rgba(255,159,28,.10)" : "grey.100",
                    color: method.active ? "secondary.dark" : "text.secondary",
                  }}
                >
                  {paymentIcon(method.method || method.label)}
                </Box>
                <Box>
                  <Typography variant="body2" fontWeight={800}>{method.label}</Typography>
                  <Typography variant="caption" color="text.secondary">
                    {method.active ? "Disponible al pagar" : "No se mostrará al cliente"}
                  </Typography>
                </Box>
              </Stack>
              <Switch checked={method.active} onChange={() => onToggle(method.method)} />
            </Box>
          ))}
        </Box>

        {transfer && (
          <Collapse in={Boolean(transfer.active)}>
            <Box sx={{ pt: 2.5, borderTop: "1px solid", borderColor: "divider" }}>
              <Typography variant="subtitle2" fontWeight={850}>Datos para transferencias</Typography>
              <Typography variant="caption" color="text.secondary">
                Se mostrarán al cliente únicamente cuando elija transferencia.
              </Typography>
              <Grid container spacing={2} sx={{ mt: 0.5 }}>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Titular de la cuenta"
                    value={config.accountHolder || ""}
                    onChange={(event) => onConfigChange(
                      "transfer",
                      "accountHolder",
                      event.target.value,
                    )}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Banco"
                    value={config.bankName || ""}
                    onChange={(event) => onConfigChange(
                      "transfer",
                      "bankName",
                      event.target.value,
                    )}
                    fullWidth
                    required
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="CLABE (18 dígitos)"
                    value={config.clabe || ""}
                    slotProps={{ htmlInput: { maxLength: 18, inputMode: "numeric" } }}
                    onChange={(event) => onConfigChange(
                      "transfer",
                      "clabe",
                      event.target.value.replace(/\D/g, ""),
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12} md={6}>
                  <TextField
                    label="Número de cuenta"
                    value={config.accountNumber || ""}
                    slotProps={{ htmlInput: { maxLength: 30, inputMode: "numeric" } }}
                    onChange={(event) => onConfigChange(
                      "transfer",
                      "accountNumber",
                      event.target.value.replace(/\D/g, ""),
                    )}
                    fullWidth
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    label="Indicaciones o referencia"
                    value={config.referenceInstructions || ""}
                    onChange={(event) => onConfigChange(
                      "transfer",
                      "referenceInstructions",
                      event.target.value,
                    )}
                    multiline
                    minRows={2}
                    fullWidth
                  />
                </Grid>
              </Grid>
            </Box>
          </Collapse>
        )}

        {activeCount === 0 && <Alert severity="warning">Activa al menos un método de pago.</Alert>}
        <Stack direction="row" justifyContent="flex-end">
          <Button
            variant="contained"
            onClick={onSave}
            disabled={loading || activeCount === 0}
            sx={{ width: { xs: "100%", sm: "auto" } }}
          >
            Guardar métodos
          </Button>
        </Stack>
      </Stack>
    </SettingsSection>
  );
};

PaymentMethodsTab.propTypes = {
  paymentMethods: PropTypes.arrayOf(PropTypes.shape({
    method: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
    active: PropTypes.bool.isRequired,
    config: PropTypes.object,
  })).isRequired,
  onToggle: PropTypes.func.isRequired,
  onConfigChange: PropTypes.func.isRequired,
  onSave: PropTypes.func.isRequired,
  loading: PropTypes.bool.isRequired,
};

export default PaymentMethodsTab;
