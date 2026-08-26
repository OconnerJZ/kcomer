import { Box, Chip, Paper, Stack, Typography } from "@mui/material";
import { Receipt } from "@mui/icons-material";

export default function OrderItemsList({ order }) {
  return (
    <Box sx={{ mb: 0 }}>
      <Stack direction="row" alignItems="center" justifyContent="space-between" mb={2}>
        <Stack direction="row" alignItems="center" gap={1.5}>
          <Box sx={{ width: 30, height: 30, borderRadius: 2, bgcolor: "primary.main", display: "flex", alignItems: "center", justifyContent: "center", color: "white" }}>
            <Receipt sx={{ fontSize: 20 }} />
          </Box>
          <Typography variant="body2" sx={{ fontWeight: 700 }}>Artículos del pedido</Typography>
        </Stack>
      </Stack>

      <Paper elevation={0} sx={{ borderColor: "divider", overflow: "hidden" }}>
        {order.items.map((item, idx) => (
          <Box key={`${order.id}-${idx}`} sx={{ p: 1, borderBottom: idx < order.items.length - 1 ? "1px solid" : "none", borderColor: "divider", "&:hover": { bgcolor: "action.hover" } }}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={item.note ? 1 : 0}>
              <Stack direction="row" alignItems="center" gap={2} flex={1}>
                <Chip label={`${item.quantity}x`} size="small" sx={{ fontWeight: 700, minWidth: 40, bgcolor: "primary.lighter", color: "primary.main" }} />
                <Typography variant="caption" sx={{ fontWeight: 500, flex: 1 }}>{item.name}</Typography>
              </Stack>
              <Stack direction="row" alignItems="center" gap={2} sx={{ ml: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ display: { xs: "none", sm: "block" }, minWidth: 70, textAlign: "right" }}>${item.price.toFixed(2)}</Typography>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "success.main", minWidth: 80, textAlign: "right" }}>${(item.price * item.quantity).toFixed(2)}</Typography>
              </Stack>
            </Stack>
            {item.note && (
              <Box sx={{ ml: 7, mt: 0.5, p: 1, bgcolor: "warning.lighter", borderRadius: 1, borderLeft: "1px solid", borderColor: "warning.main" }}>
                <Typography variant="caption" sx={{ color: "warning.dark", fontWeight: 500 }}>📝 {item.note}</Typography>
              </Box>
            )}
          </Box>
        ))}
        <Box sx={{ p: 2, bgcolor: "grey.50", borderTop: "1px solid", borderColor: "divider" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body1" sx={{ fontWeight: 700 }}>Total del pedido</Typography>
            <Typography variant="h6" sx={{ fontWeight: 700, color: "success.main" }}>${order.total.toFixed(2)}</Typography>
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
