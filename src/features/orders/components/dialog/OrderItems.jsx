import { Box, Chip, Stack, Typography } from "@mui/material";
import { LocalDining, StickyNote2 } from "@mui/icons-material";
import { formatCurrency } from "@Features/orders/model/orderFormatters";

const OrderItems = ({ items = [] }) => (
  <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2, sm: 2.5 }, bgcolor: "rgba(255,255,255,.86)" }}>
    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
      <Box>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".12em", fontSize: ".64rem" }}>PEDIDO</Typography>
        <Typography variant="subtitle1" fontWeight={800}>Productos</Typography>
      </Box>
      <Chip size="small" label={`${items.length} ${items.length === 1 ? "producto" : "productos"}`} variant="outlined" sx={{ fontWeight: 700 }} />
    </Stack>

    <Stack spacing={0}>
      {items.map((item, index) => {
        const subtotal = Number(item.subtotal ?? (Number(item.price || 0) * Number(item.quantity || 0)));
        return (
          <Box
            key={item.id || `${item.name}-${index}`}
            sx={{
              display: "grid",
              gridTemplateColumns: "auto minmax(0,1fr) auto",
              gap: 1.5,
              alignItems: "start",
              py: 1.6,
              borderTop: index === 0 ? "none" : "1px solid",
              borderColor: "divider",
            }}
          >
            <Box sx={{ width: 38, height: 38, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: "rgba(255,75,69,.08)", color: "primary.main", fontWeight: 800 }}>
              {item.quantity}×
            </Box>

            <Box minWidth={0}>
              <Stack direction="row" spacing={0.75} alignItems="center">
                <LocalDining sx={{ fontSize: 16, color: "text.disabled" }} />
                <Typography variant="body2" fontWeight={800} noWrap>{item.name}</Typography>
              </Stack>
              {item.price != null && (
                <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.25 }}>
                  {formatCurrency(Number(item.price))} c/u
                </Typography>
              )}
              {item.note && (
                <Stack direction="row" spacing={0.6} alignItems="flex-start" sx={{ mt: 0.7 }}>
                  <StickyNote2 sx={{ fontSize: 14, color: "text.disabled", mt: "2px" }} />
                  <Typography variant="caption" color="text.secondary" sx={{ fontStyle: "italic", lineHeight: 1.45 }}>
                    {item.note}
                  </Typography>
                </Stack>
              )}
            </Box>

            <Typography variant="body2" fontWeight={850} sx={{ whiteSpace: "nowrap", pt: 0.2 }}>
              {formatCurrency(subtotal)}
            </Typography>
          </Box>
        );
      })}
    </Stack>
  </Box>
);

export default OrderItems;
