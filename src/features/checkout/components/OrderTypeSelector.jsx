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
                bgcolor: selected ? "rgba(49,94,251,.07)" : "background.paper",
                transition: "all 0.2s",
                "&:hover": { borderColor: "primary.main", bgcolor: "rgba(49,94,251,.045)" },
              }}
            >
              <CardContent sx={{ textAlign: "center", p: { xs: 1.25, sm: 2 }, "&:last-child": { pb: { xs: 1.25, sm: 2 } } }}>
                <Box sx={{ fontSize: { xs: 26, sm: 32 }, mb: 0.5 }}>{option.icon}</Box>
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
