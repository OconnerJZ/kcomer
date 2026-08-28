import { useState } from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Button,
} from "@mui/material";
import { CheckRounded, CloseRounded } from "@mui/icons-material";

export default function PendingOrderActions({ order, onUpdateStatus, fullWidth = false }) {
  const [rejectOpen, setRejectOpen] = useState(false);
  const [reason, setReason] = useState("");

  if (!onUpdateStatus || order?.status !== "pending") return null;

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
      <Stack direction="row" spacing={0.6} justifyContent={fullWidth ? "flex-end" : "center"}>
        <Tooltip title="Aceptar orden" arrow>
          <IconButton
            size="small"
            aria-label={`Aceptar orden ${order.id}`}
            onClick={() => onUpdateStatus(order.id, "accepted")}
            sx={{
              width: 34,
              height: 34,
              bgcolor: "rgba(46,125,50,.09)",
              color: "success.main",
              border: "1px solid rgba(46,125,50,.18)",
              "&:hover": { bgcolor: "rgba(46,125,50,.16)" },
            }}
          >
            <CheckRounded fontSize="small" />
          </IconButton>
        </Tooltip>

        <Tooltip title="Rechazar orden" arrow>
          <IconButton
            size="small"
            aria-label={`Rechazar orden ${order.id}`}
            onClick={() => setRejectOpen(true)}
            sx={{
              width: 34,
              height: 34,
              bgcolor: "rgba(211,47,47,.055)",
              color: "error.main",
              border: "1px solid rgba(211,47,47,.16)",
              "&:hover": { bgcolor: "rgba(211,47,47,.11)" },
            }}
          >
            <CloseRounded fontSize="small" />
          </IconButton>
        </Tooltip>
      </Stack>

      <Dialog open={rejectOpen} onClose={() => setRejectOpen(false)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3 } }}>
        <DialogTitle sx={{ fontWeight: 800 }}>Rechazar orden #{order.id}</DialogTitle>
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
        <DialogActions sx={{ px: 3, pb: 2.5 }}>
          <Button onClick={() => setRejectOpen(false)} sx={{ textTransform: "none" }}>Cancelar</Button>
          <Button color="error" variant="contained" disableElevation onClick={handleReject} sx={{ textTransform: "none", borderRadius: 2 }}>
            Confirmar rechazo
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
