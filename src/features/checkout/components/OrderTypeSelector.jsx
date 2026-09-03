import { Box, Card, CardContent, Chip, Typography } from "@mui/material";

export default function OrderTypeSelector({ orderType, onChange }) {
  return (
    <Box>
      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
        <Typography variant="subtitle1" fontWeight={600}>
          Tipo de pedido
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: { xs: 1, sm: 2 } }}>
        {[{ value: "pickup", icon: "🏪", label: "Recoger en tienda", hint: "Gratis" }, { value: "delivery", icon: "🚚", label: "Entrega a domicilio", hint: "Según distancia" }].map((option) => {
          const selected = orderType === option.value;
          return (
            <Card
              key={option.value}
              onClick={() => onChange(option.value)}
              sx={{
                cursor: "pointer",
                border: "1px solid",
                borderColor: selected ? "primary.main" : "divider",
                bgcolor: selected ? "rgba(198,90,80,.07)" : "background.paper",
                transition: "all 0.2s",
                "&:hover": { borderColor: "primary.main", bgcolor: "rgba(198,90,80,.045)" },
              }}
            >
              <CardContent sx={{ textAlign: "left", p: { xs: 1.25, sm: 2 }, "&:last-child": { pb: { xs: 1.25, sm: 2 } } }}>
                <Box sx={{ width: 9, height: 9, borderRadius: "50%", bgcolor: selected ? "primary.main" : "secondary.main", color: "transparent", fontSize: 0, mb: 1 }}>{option.icon}</Box>
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
