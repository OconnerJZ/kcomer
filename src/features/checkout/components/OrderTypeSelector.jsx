import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

export default function OrderTypeSelector({ orderType, onChange }) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          Tipo de pedido
        </Typography>
      </Box>

      <Box display="flex" gap={2}>
        {[{ value: "pickup", icon: "🏪", label: "Recoger en tienda", hint: "Gratis" }, { value: "delivery", icon: "🚚", label: "Entrega a domicilio", hint: "Según distancia" }].map((option) => {
          const selected = orderType === option.value;
          return (
            <Card
              key={option.value}
              onClick={() => onChange(option.value)}
              sx={{
                flex: 1,
                cursor: "pointer",
                border: selected ? "1.5px solid #1976d2" : "1px solid transparent",
                bgcolor: selected ? "#e3f2fd" : "white",
                transition: "all 0.2s",
                "&:hover": { borderColor: "#1976d2", transform: "translateY(-2px)", boxShadow: 2 },
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 2 }}>
                <Box sx={{ fontSize: 32, mb: 0.5 }}>{option.icon}</Box>
                <Typography variant="body2" fontWeight={600}>{option.label}</Typography>
                {selected ? (
                  <Chip label="Seleccionado" size="small" color="primary" sx={{ mt: 1 }} />
                ) : (
                  <Typography variant="caption" color="text.secondary">{option.hint}</Typography>
                )}
              </CardContent>
            </Card>
          );
        })}
      </Box>
    </Box>
  );
}
