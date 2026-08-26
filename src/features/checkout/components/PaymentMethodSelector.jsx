import { Box, Card, CardContent, Typography } from "@mui/material";
import TransferPaymentInfo from "./TransferPaymentInfo";

export default function PaymentMethodSelector({ paymentMethod, onChange }) {
  const methods = [
    { value: "cash", icon: "💵", label: "Efectivo", color: "#4caf50", bg: "#f1f8f4" },
    { value: "transfer", icon: "🏦", label: "Transferencia", color: "#2196f3", bg: "#e3f2fd" },
  ];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>Método de pago</Typography>
      </Box>

      <Box display="flex" gap={2} mb={2}>
        {methods.map((method) => {
          const selected = paymentMethod === method.value;
          return (
            <Card
              key={method.value}
              onClick={() => onChange(method.value)}
              sx={{
                flex: 1,
                cursor: "pointer",
                border: selected ? `1px solid ${method.color}` : "1px solid #e0e0e0",
                bgcolor: selected ? method.bg : "white",
                transition: "all 0.2s",
                "&:hover": { borderColor: method.color, transform: "translateY(-2px)", boxShadow: 2 },
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ fontSize: 24 }}>{method.icon}</Box>
                    <Typography variant="body2" fontWeight={600}>{method.label}</Typography>
                  </Box>
                  {selected && (
                    <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: method.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {paymentMethod === "transfer" && <TransferPaymentInfo />}
    </Box>
  );
}
