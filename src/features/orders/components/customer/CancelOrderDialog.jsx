import PropTypes from "prop-types";
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, Typography } from "@mui/material";

const CancelOrderDialog = ({ open, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3.5 } }}>
    <DialogTitle sx={{ fontWeight: 900 }}>Cancelar orden</DialogTitle>
    <DialogContent>
      <Typography color="text.secondary">
        ¿Seguro que quieres cancelar esta orden? Esta acción solo está disponible mientras siga pendiente.
      </Typography>
    </DialogContent>
    <DialogActions sx={{ p: 2 }}>
      <Button onClick={onClose} sx={{ textTransform: "none" }}>Conservar orden</Button>
      <Button
        color="error"
        variant="contained"
        disableElevation
        onClick={onConfirm}
        sx={{ textTransform: "none", borderRadius: 999, px: 2.25 }}
      >
        Sí, cancelar
      </Button>
    </DialogActions>
  </Dialog>
);

CancelOrderDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default CancelOrderDialog;
