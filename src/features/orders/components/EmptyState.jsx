import { Paper, Typography } from "@mui/material";
import { Restaurant } from "@mui/icons-material";

const EmptyState = () => (
  <Paper
    elevation={0}
    sx={{
      p: 5,
      textAlign: "center",
      border: "1px solid #e0e0e0",
      borderRadius: 0,
    }}
  >
    <Restaurant sx={{ fontSize: 48, color: "#e0e0e0", mb: 2 }} />
    <Typography sx={{ color: "#666", mb: 1 }}>
      No tienes ordenes en tu negocio
    </Typography>
    <Typography variant="caption" sx={{ color: "#999" }}>
      Comparte <strong>qscome.com.mx</strong> con tus clientes
    </Typography>
  </Paper>
);

export default EmptyState;
