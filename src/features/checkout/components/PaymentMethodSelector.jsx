import { Box, Card, CardContent, Typography } from "@mui/material";
import TransferPaymentInfo from "./TransferPaymentInfo";

const METHOD_META = {
  cash: { icon: "💵", label: "Efectivo", color: "#5F7864", bg: "rgba(95,120,100,.08)" },
  transfer: { icon: "🏦", label: "Transferencia", color: "#A8753C", bg: "rgba(168,117,60,.08)" },
  card: { icon: "💳", label: "Tarjeta", color: "#C65A50", bg: "rgba(198,90,80,.07)" },
  wallet: { icon: "📱", label: "Billetera digital", color: "#A8753C", bg: "rgba(168,117,60,.08)" },
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
            color: "#C65A50",
            bg: "rgba(198,90,80,.07)",
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
                    <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: meta.color, color: "transparent", fontSize: 0, flexShrink: 0 }}>{meta.icon}</Box>
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
