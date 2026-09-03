import { Box, Typography } from "@mui/material";
import { Restaurant } from "@mui/icons-material";

const EmptyState = () => (
  <Box
    sx={{
      p: { xs: 3, sm: 5 },
      textAlign: "center",
      border: "1px dashed",
      borderColor: "divider",
      borderRadius: "10px",
    }}
  >
    <Restaurant sx={{ fontSize: 48, color: "secondary.main", opacity: .55, mb: 2 }} />
    <Typography color="text.secondary" sx={{ mb: 1 }}>
      No tienes ordenes en tu negocio
    </Typography>
    <Typography variant="caption" color="text.secondary">
      Comparte <strong>qscome.com.mx</strong> con tus clientes
    </Typography>
  </Box>
);

export default EmptyState;
