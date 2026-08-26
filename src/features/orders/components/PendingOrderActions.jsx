import { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
  TextField,
} from "@mui/material";
import { Check, Close } from "@mui/icons-material";

export default function PendingOrderActions({ order, onUpdateStatus, fullWidth = false }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (order?.status !== "pending") return null;

  const handleReject = async () => {
    const detail = reason.trim();
    const note = detail
      ? `Orden rechazada por el negocio: ${detail}`
      : "Orden rechazada por el negocio";
    await onUpdateStatus(order.id, "cancelled", note);
    setRejectOpen(false);
    setReason("");
  };

  return (
    <>
      <Stack direction={fullWidth ? "column" : "row"} spacing={1} sx={{ width: fullWidth ? "100%" : "auto" }}>
        <Button
          size="small"
          variant="contained"
          disableElevation
          fullWidth={fullWidth}
          startIcon={<Check />}
          onClick={() => onUpdateStatus(order.id, "accepted")}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Aceptar
        </Button>
        <Button
          size="small"
          variant="outlined"
          color="error"
          fullWidth={fullWidth}
          startIcon={<Close />}
          onClick={() => setRejectOpen(true)}
          sx={{ textTransform: "none", fontWeight: 600 }}
        >
          Rechazar
        </Button>
      </Stack>

      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rechazar orden #{order.id}</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            La orden se cerrará como cancelada y quedará registrado que fue rechazada por el negocio.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            multiline
            minRows={2}
            label="Motivo (opcional)"
            value={reason}
            onChange={(event) => setReason(event.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRejectOpen(false)}>Cancelar</Button>
          <Button color="error" variant="contained" onClick={handleReject}>
            Confirmar rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
