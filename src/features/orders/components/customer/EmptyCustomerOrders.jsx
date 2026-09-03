import { Restaurant } from "@mui/icons-material";
import { Box, Typography } from "@mui/material";

const EmptyCustomerOrders = () => (
  <Box
    sx={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      minHeight: "60vh",
      textAlign: "center",
      px: 3,
    }}
  >
    <Restaurant sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
    <Typography variant="h5" gutterBottom>No tienes órdenes</Typography>
    <Typography color="text.secondary">Realiza tu primer pedido y aparecerá aquí</Typography>
  </Box>
);

export default EmptyCustomerOrders;
