import PropTypes from "prop-types";
import { Alert, Box, CircularProgress } from "@mui/material";
import RegisterBusiness from "../../pages/RegisterBusiness";
import { DASHBOARD_STATE } from "../../model/ownerDashboard";

const centeredStyles = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  minHeight: "100vh",
};

const OwnerDashboardState = ({ state, error, onBusinessCreated }) => {
  if (state === DASHBOARD_STATE.REGISTER_ACCESS) {
    return (
      <Box sx={{ ...centeredStyles, px: 2, mt: -6 }}>
        <RegisterBusiness />
      </Box>
    );
  }

  if (state === DASHBOARD_STATE.LOADING) {
    return (
      <Box sx={{ ...centeredStyles, backgroundColor: "background.default" }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (state === DASHBOARD_STATE.ERROR) {
    return (
      <Box sx={{ ...centeredStyles, px: 2 }}>
        <Alert severity="error" sx={{ maxWidth: 600 }}>{error}</Alert>
      </Box>
    );
  }

  if (state === DASHBOARD_STATE.REGISTER_EMPTY) {
    return (
      <Box sx={{ ...centeredStyles, px: 2 }}>
        <RegisterBusiness onSuccess={onBusinessCreated} />
      </Box>
    );
  }

  if (state === DASHBOARD_STATE.SELECTING) {
    return (
      <Box sx={centeredStyles}>
        <CircularProgress />
      </Box>
    );
  }

  return null;
};

OwnerDashboardState.propTypes = {
  state: PropTypes.oneOf(Object.values(DASHBOARD_STATE)).isRequired,
  error: PropTypes.string,
  onBusinessCreated: PropTypes.func.isRequired,
};

export default OwnerDashboardState;
