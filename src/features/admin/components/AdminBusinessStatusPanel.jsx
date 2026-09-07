import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  BlockRounded,
  CheckCircleRounded,
  RestartAltRounded,
  VerifiedRounded,
} from "@mui/icons-material";
import {
  useUpdateAdminBusinessStatusMutation,
  useUpdateAdminBusinessVerificationMutation,
} from "../api/admin.api";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible completar la operación";

export default function AdminBusinessStatusPanel({ business }) {
  const [dialogMode, setDialogMode] = useState(null);
  const [reason, setReason] = useState("");
  const [feedback, setFeedback] = useState(null);
  const [updateStatus, statusState] = useUpdateAdminBusinessStatusMutation();
  const [updateVerification, verificationState] = useUpdateAdminBusinessVerificationMutation();
  const suspended = business.platformStatus === "suspended";
  const busy = statusState.isLoading || verificationState.isLoading;

  const closeDialog = () => {
    if (statusState.isLoading) return;
    setDialogMode(null);
    setReason("");
  };

  const confirmStatus = async () => {
    const targetStatus = dialogMode === "suspend" ? "suspended" : "active";
    if (targetStatus === "suspended" && !reason.trim()) {
      setFeedback({ severity: "warning", message: "Indica el motivo de la suspensión." });
      return;
    }

    try {
      setFeedback(null);
      await updateStatus({
        businessId: business.id,
        status: targetStatus,
        reason: targetStatus === "suspended" ? reason.trim() : undefined,
      }).unwrap();
      setFeedback({
        severity: "success",
        message: targetStatus === "suspended" ? "Negocio suspendido correctamente." : "Negocio reactivado correctamente.",
      });
      closeDialog();
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  const toggleVerification = async () => {
    try {
      setFeedback(null);
      await updateVerification({
        businessId: business.id,
        verified: !business.isVerified,
      }).unwrap();
      setFeedback({
        severity: "success",
        message: business.isVerified ? "Se retiró la verificación." : "Negocio verificado correctamente.",
      });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2.25}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
          <Box>
            <Typography variant="h6" fontWeight={700}>Estado de plataforma</Typography>
            <Typography variant="body2" color="text.secondary">
              Independiente de si el negocio está abierto o cerrado por operación.
            </Typography>
          </Box>
          <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
            <Chip
              icon={suspended ? <BlockRounded /> : <CheckCircleRounded />}
              label={suspended ? "Suspendido" : "Activo"}
              color={suspended ? "warning" : "success"}
              variant="outlined"
            />
            <Chip
              icon={<VerifiedRounded />}
              label={business.isVerified ? "Verificado" : "No verificado"}
              color={business.isVerified ? "info" : "default"}
              variant="outlined"
            />
            <Chip
              label={business.isOpen ? "Operación: abierto" : "Operación: cerrado"}
              variant="outlined"
            />
          </Stack>
        </Stack>

        {suspended && (
          <Alert severity="warning">
            {business.suspensionReason || "Negocio suspendido por administración."}
            {business.suspendedAt ? ` · Desde ${new Date(business.suspendedAt).toLocaleString("es-MX")}` : ""}
          </Alert>
        )}
        {feedback && <Alert severity={feedback.severity} onClose={() => setFeedback(null)}>{feedback.message}</Alert>}

        <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5}>
          <Button
            variant="outlined"
            color={business.isVerified ? "warning" : "primary"}
            startIcon={<VerifiedRounded />}
            disabled={busy}
            onClick={toggleVerification}
          >
            {business.isVerified ? "Retirar verificación" : "Verificar negocio"}
          </Button>
          {suspended ? (
            <Button
              variant="contained"
              startIcon={<RestartAltRounded />}
              disabled={busy}
              onClick={() => setDialogMode("reactivate")}
            >
              Reactivar negocio
            </Button>
          ) : (
            <Button
              variant="outlined"
              color="warning"
              startIcon={<BlockRounded />}
              disabled={busy}
              onClick={() => setDialogMode("suspend")}
            >
              Suspender negocio
            </Button>
          )}
        </Stack>
      </Stack>

      <Dialog open={Boolean(dialogMode)} onClose={closeDialog} fullWidth maxWidth="sm">
        <DialogTitle>{dialogMode === "suspend" ? "Suspender negocio" : "Reactivar negocio"}</DialogTitle>
        <DialogContent>
          {dialogMode === "suspend" ? (
            <Stack spacing={2} sx={{ pt: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                El negocio dejará de aparecer públicamente y no podrá recibir nuevas órdenes. El equipo tampoco podrá operar sus módulos hasta que sea reactivado.
              </Typography>
              <TextField
                autoFocus
                multiline
                minRows={3}
                label="Motivo de la suspensión"
                value={reason}
                onChange={(event) => setReason(event.target.value)}
                inputProps={{ maxLength: 500 }}
                helperText={`${reason.length}/500`}
                fullWidth
              />
            </Stack>
          ) : (
            <Typography variant="body2" color="text.secondary">
              El negocio recuperará el acceso de su equipo y volverá a estar disponible según su propia configuración operativa.
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDialog} disabled={statusState.isLoading}>Cancelar</Button>
          <Button
            variant="contained"
            color={dialogMode === "suspend" ? "warning" : "primary"}
            onClick={confirmStatus}
            disabled={statusState.isLoading || (dialogMode === "suspend" && !reason.trim())}
          >
            {dialogMode === "suspend" ? "Confirmar suspensión" : "Confirmar reactivación"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}
