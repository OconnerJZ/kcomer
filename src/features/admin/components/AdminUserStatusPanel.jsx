import { useState } from "react";
import {
  Alert,
  Button,
  Chip,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { BlockRounded, CheckCircleRounded } from "@mui/icons-material";
import { useUpdateAdminUserStatusMutation } from "../api/admin.api";
import { adminUserPropType } from "../model/adminUserPropTypes";

const errorMessage = (error) => error?.data?.message || error?.message || "No fue posible actualizar el estado";
const dateLabel = (value) => value ? new Date(value).toLocaleString("es-MX") : "—";

export default function AdminUserStatusPanel({ user }) {
  const blocked = user.accountStatus === "blocked";
  const [reason, setReason] = useState(user.blockReason || "");
  const [feedback, setFeedback] = useState(null);
  const [updateStatus, updateState] = useUpdateAdminUserStatusMutation();

  const changeStatus = async () => {
    const nextStatus = blocked ? "active" : "blocked";
    const normalizedReason = reason.trim();
    if (nextStatus === "blocked" && !normalizedReason) {
      setFeedback({ severity: "warning", message: "Indica el motivo antes de bloquear la cuenta." });
      return;
    }

    try {
      setFeedback(null);
      await updateStatus({
        userId: user.id,
        status: nextStatus,
        reason: nextStatus === "blocked" ? normalizedReason : undefined,
      }).unwrap();
      if (nextStatus === "active") setReason("");
      setFeedback({
        severity: "success",
        message: nextStatus === "blocked" ? "Cuenta bloqueada." : "Cuenta reactivada.",
      });
    } catch (error) {
      setFeedback({ severity: "error", message: errorMessage(error) });
    }
  };

  return (
    <Paper variant="outlined" sx={{ p: { xs: 2, md: 2.5 } }}>
      <Stack spacing={2}>
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={1.5}>
          <Stack spacing={0.35}>
            <Typography variant="overline" color="text.secondary">ESTADO DE CUENTA</Typography>
            <Typography variant="h6" fontWeight={700}>Acceso a qsCome</Typography>
          </Stack>
          <Chip
            label={blocked ? "Bloqueada" : "Activa"}
            color={blocked ? "warning" : "success"}
            variant="outlined"
            sx={{ alignSelf: { xs: "flex-start", sm: "center" } }}
          />
        </Stack>

        <Typography variant="body2" color="text.secondary">
          Un bloqueo impide iniciar sesión y corta el acceso de tokens ya emitidos en el siguiente request.
        </Typography>

        {blocked ? (
          <Stack spacing={0.5}>
            <Typography variant="body2"><strong>Motivo:</strong> {user.blockReason || "Sin motivo registrado"}</Typography>
            <Typography variant="caption" color="text.secondary">Bloqueada: {dateLabel(user.blockedAt)}</Typography>
          </Stack>
        ) : (
          <TextField
            label="Motivo del bloqueo"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
            multiline
            minRows={2}
            inputProps={{ maxLength: 500 }}
            helperText="Se conserva para auditoría administrativa."
          />
        )}

        {feedback && <Alert severity={feedback.severity}>{feedback.message}</Alert>}

        <Button
          variant={blocked ? "contained" : "outlined"}
          color={blocked ? "primary" : "warning"}
          startIcon={blocked ? <CheckCircleRounded /> : <BlockRounded />}
          onClick={changeStatus}
          disabled={updateState.isLoading}
          sx={{ alignSelf: { xs: "stretch", sm: "flex-start" } }}
        >
          {blocked ? "Reactivar cuenta" : "Bloquear cuenta"}
        </Button>
      </Stack>
    </Paper>
  );
}

AdminUserStatusPanel.propTypes = {
  user: adminUserPropType.isRequired,
};
