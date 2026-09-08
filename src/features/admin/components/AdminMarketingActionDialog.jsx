import PropTypes from "prop-types";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";

export default function AdminMarketingActionDialog({
  open,
  title,
  description,
  actionLabel,
  actionColor = "primary",
  reason,
  onReasonChange,
  onClose,
  onConfirm,
  loading = false,
}) {
  const canSubmit = reason.trim().length >= 3 && !loading;

  return (
    <Dialog open={open} onClose={loading ? undefined : onClose} fullWidth maxWidth="sm">
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ mb: 2 }}>{description}</DialogContentText>
        <TextField
          autoFocus
          fullWidth
          multiline
          minRows={3}
          label="Motivo administrativo"
          value={reason}
          onChange={(event) => onReasonChange(event.target.value)}
          inputProps={{ maxLength: 500 }}
          helperText="Mínimo 3 caracteres. Esta acción quedará registrada en auditoría."
        />
      </DialogContent>
      <DialogActions>
        <Button disabled={loading} onClick={onClose}>Cancelar</Button>
        <Button
          variant="contained"
          color={actionColor}
          disabled={!canSubmit}
          onClick={onConfirm}
        >
          {loading ? "Aplicando…" : actionLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

AdminMarketingActionDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired,
  actionLabel: PropTypes.string.isRequired,
  actionColor: PropTypes.oneOf(["primary", "warning", "error", "success", "info", "secondary"]),
  reason: PropTypes.string.isRequired,
  onReasonChange: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
  loading: PropTypes.bool,
};
