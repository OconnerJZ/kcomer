import PropTypes from "prop-types";
import { Alert, Snackbar } from "@mui/material";

const OwnerSettingsFeedback = ({ error, snackbar, onClose }) => (
  <>
    {error && <Alert severity="error" sx={{ mb: 2, borderRadius: "10px" }}>{error}</Alert>}
    <Snackbar
      open={snackbar.open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
    >
      <Alert severity={snackbar.severity} onClose={onClose} sx={{ borderRadius: "10px" }}>
        {snackbar.message}
      </Alert>
    </Snackbar>
  </>
);

OwnerSettingsFeedback.propTypes = {
  error: PropTypes.string,
  snackbar: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default OwnerSettingsFeedback;
