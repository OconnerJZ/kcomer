import { Box, Card, CardContent, Typography } from "@mui/material";
import TransferPaymentInfo from "./TransferPaymentInfo";

const METHOD_META = {
  cash: { icon: "💵", label: "Efectivo", color: "#2EAD67", bg: "rgba(46,173,103,.08)" },
  transfer: { icon: "🏦", label: "Transferencia", color: "#FF9F1C", bg: "rgba(255,159,28,.08)" },
  card: { icon: "💳", label: "Tarjeta", color: "#FF4B45", bg: "rgba(255,75,69,.07)" },
  wallet: { icon: "📱", label: "Billetera digital", color: "#FF9F1C", bg: "rgba(255,159,28,.08)" },
};

export default function PaymentMethodSelector({ paymentMethod, methods = [], onChange }) {
  const activeMethods = methods.filter((method) => method.active !== false);
  const availableMethods = activeMethods.length > 0
    ? activeMethods
    : [{ method: "cash", label: "Efectivo", active: true }];

  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>Método de pago</Typography>
      </Box>

      <Box display="flex" gap={2} mb={2} flexWrap="wrap">
        {availableMethods.map((method) => {
          const value = method.method;
          const meta = METHOD_META[value] || {
            icon: "💰",
            label: method.label || value,
            color: "#FF4B45",
            bg: "rgba(255,75,69,.07)",
          };
          const selected = paymentMethod === value;

          return (
            <Card
              key={value}
              onClick={() => onChange(value)}
              sx={{
                flex: "1 1 180px",
                cursor: "pointer",
                border: "1px solid",
                borderColor: selected ? meta.color : "divider",
                bgcolor: selected ? meta.bg : "white",
                transition: "all 0.2s",
                "&:hover": { borderColor: meta.color },
              }}
            >
              <CardContent sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
                  <Box display="flex" alignItems="center" gap={1}>
                    <Box sx={{ fontSize: 24 }}>{meta.icon}</Box>
                    <Typography variant="body2" fontWeight={600}>{method.label || meta.label}</Typography>
                  </Box>
                  {selected && (
                    <Box sx={{ width: 20, height: 20, borderRadius: "50%", bgcolor: meta.color, color: "white", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: "bold" }}>✓</Box>
                  )}
                </Box>
              </CardContent>
            </Card>
          );
        })}
      </Box>

      {paymentMethod === "transfer" && <TransferPaymentInfo config={availableMethods.find((method) => method.method === "transfer")?.config} />}
    </Box>
  );
}
