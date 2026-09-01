import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Typography,
} from "@mui/material";
import PropTypes from "prop-types";

const DeleteMenuDialog = ({ open, loading, onClose, onConfirm }) => (
  <Dialog open={open} onClose={onClose}>
    <DialogTitle>¿Eliminar platillo?</DialogTitle>
    <DialogContent>
      <Typography>
        Esta acción no se puede deshacer. El platillo será eliminado permanentemente.
      </Typography>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose}>Cancelar</Button>
      <Button onClick={onConfirm} color="error" variant="contained" disabled={loading}>
        Eliminar
      </Button>
    </DialogActions>
  </Dialog>
);

DeleteMenuDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onConfirm: PropTypes.func.isRequired,
};

export default DeleteMenuDialog;
