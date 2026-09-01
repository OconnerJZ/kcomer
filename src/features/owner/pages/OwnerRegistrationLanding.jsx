import { Box, Typography, Button, Paper } from "@mui/material";
import HeaderImg from "@Assets/images/qscome-header-1.png";
import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "@Features/auth/context/AuthContext";
import { isOwner } from "@Features/auth/model/roles";
import RegisterBusiness from "./RegisterBusiness";

export default function OwnerRegistrationLanding() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isOwner(user)) return <Navigate to="/owner" replace />;
  if (isAuthenticated) return <RegisterBusiness />;

  return (
    <Box sx={{ minHeight: "calc(100svh - 64px)", display: "grid", placeItems: "center", px: { xs: 1.5, sm: 3 }, py: { xs: 4, sm: 7 }, backgroundImage: `linear-gradient(rgba(255,249,244,.78), rgba(255,249,244,.94)), url(${HeaderImg})`, backgroundSize: "cover", backgroundPosition: "center top" }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 620,
          textAlign: "center",
        }}
      >
        <Paper
          sx={{
            bgcolor: "rgba(255,255,255,.9)",
            p: { xs: 2.5, sm: 4 },
            borderRadius: 3,
            border: "1px solid",
            borderColor: "divider",
          }}
          elevation={0}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            ¡Haz que todos encuentren tu negocio!
          </Typography>
          <Typography variant="body1" gutterBottom>
            <strong>Regístrate</strong> y destaca en nuestra página
          </Typography>
          <Typography variant="body1" gutterBottom>
            ¡No dejes que te busquen y no te encuentren!
          </Typography>
          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 2, width: { xs: "100%", sm: "auto" } }}
            onClick={() => navigate("/login/registro")}
          >
            Registrar mi local
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
