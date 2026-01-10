import { Box, Stack, Typography } from "@mui/material";
import { LocationOn, StickyNote2, CreditCard } from "@mui/icons-material";

const DeliveryInfo = ({ order }) => {
  return (
    <Stack spacing={2} sx={{ height: "100%" }}>
      {/* Ubicación */}
      <Box sx={{ border: "1px solid #e0e0e0", p: 2.5 }}>
        <Typography
          variant="overline"
          sx={{
            color: "#666",
            letterSpacing: "0.15em",
            fontSize: "0.688rem",
            fontWeight: 600,
            display: "block",
            mb: 2,
          }}
        >
          Dirección de Entrega
        </Typography>
        <Stack direction="row" spacing={1} alignItems="start">
          <LocationOn sx={{ fontSize: 16, color: "#666" }} />
          <Typography variant="body1" sx={{ fontWeight: 500, lineHeight: 1.6 }}>
            {order.deliveryAddress}
          </Typography>
        </Stack>
      </Box>

      {/* Notas */}
      {order.notes && (
        <Box sx={{ border: "1px solid #e0e0e0", p: 2.5, bgcolor: "#fafafa" }}>
          <Typography
            variant="overline"
            sx={{
              color: "#666",
              letterSpacing: "0.15em",
              fontSize: "0.688rem",
              fontWeight: 600,
              display: "block",
              mb: 2,
            }}
          >
            Notas del Cliente
          </Typography>
          <Stack direction="row" spacing={1} alignItems="start">
            <StickyNote2 sx={{ fontSize: 16, color: "#666" }} />
            <Typography
              variant="body2"
              sx={{
                fontStyle: "italic",
                color: "#666",
                lineHeight: 1.6,
              }}
            >
              {order.notes}
            </Typography>
          </Stack>
        </Box>
      )}

      {/* Método de Pago */}
      <Box sx={{ border: "1px solid #e0e0e0", p: 2.5 }}>
        <Typography
          variant="overline"
          sx={{
            color: "#666",
            letterSpacing: "0.15em",
            fontSize: "0.688rem",
            fontWeight: 600,
            display: "block",
            mb: 2,
          }}
        >
          Método de Pago
        </Typography>
        <Stack direction="row" spacing={1} alignItems="center">
          <CreditCard sx={{ fontSize: 16, color: "#666" }} />
          <Typography variant="body1" sx={{ fontWeight: 500 }}>
            {order.paymentMethod || "Efectivo"}
          </Typography>
        </Stack>
      </Box>
    </Stack>
  );
};

export default DeliveryInfo;
