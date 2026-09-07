import PropTypes from "prop-types";
import { Alert, Box, Button, CircularProgress, Stack, Typography } from "@mui/material";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import useAuth from "@Features/auth/context/useAuth";

export default function AdminRoute({ children }) {
  const { user, loading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  if (loading) {
    return <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center" }}><CircularProgress /></Box>;
  }

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: `${location.pathname}${location.search}` }}
      />
    );
  }

  if (user?.role !== "admin") {
    return (
      <Box sx={{ minHeight: "100vh", display: "grid", placeItems: "center", p: 3, bgcolor: "background.default" }}>
        <Stack spacing={2} sx={{ width: "min(520px, 100%)" }}>
          <Typography variant="h4" fontWeight={700}>Acceso restringido</Typography>
          <Alert severity="warning">Esta sección requiere un rol global de plataforma <strong>admin</strong>.</Alert>
          <Button variant="contained" onClick={() => navigate("/explorar", { replace: true })}>Volver a qsCome</Button>
        </Stack>
      </Box>
    );
  }

  return children;
}

AdminRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
