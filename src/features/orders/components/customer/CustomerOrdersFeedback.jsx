import PropTypes from "prop-types";
import { Alert, Snackbar } from "@mui/material";

const CustomerOrdersFeedback = ({ feedback, onClose }) => (
  <Snackbar
    open={feedback.open}
    autoHideDuration={4200}
    onClose={onClose}
    anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
  >
    <Alert
      severity={feedback.severity}
      variant="filled"
      onClose={onClose}
      sx={{ borderRadius: "8px", boxShadow: "0 8px 24px rgba(0,0,0,.14)" }}
    >
      {feedback.message}
    </Alert>
  </Snackbar>
);

CustomerOrdersFeedback.propTypes = {
  feedback: PropTypes.shape({
    open: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
    severity: PropTypes.string.isRequired,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default CustomerOrdersFeedback;
