import { Box, Stack, Typography } from "@mui/material";
import { formatCurrency } from "@Utils/formatters"; 

const OrderItems = ({ items }) => {
  return (
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
        Productos ({items.length})
      </Typography>
      <Stack spacing={1.5}>
        {items.map((item, idx) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "start",
              py: 1.5,
              borderBottom:
                idx !== items.length - 1 ? "1px solid #f0f0f0" : "none",
            }}
          >
            <Box sx={{ flex: 1 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <Typography
                  variant="body2"
                  sx={{
                    fontFamily: "monospace",
                    fontWeight: 600,
                    color: "#666",
                    minWidth: 20,
                  }}
                >
                  {item.quantity}×
                </Typography>
                <Box>
                  <Typography variant="body1" sx={{ fontWeight: 500 }}>
                    {item.name}
                  </Typography>
                  {item.note && (
                    <Typography
                      variant="caption"
                      sx={{
                        display: "block",
                        color: "#999",
                        fontStyle: "italic",
                        mt: 0.25,
                      }}
                    >
                      {item.note}
                    </Typography>
                  )}
                </Box>
              </Stack>
            </Box>
            <Typography
              variant="body1"
              sx={{ fontWeight: 600, fontFamily: "monospace" }}
            >
              {formatCurrency(item.price * item.quantity)}
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};

export default OrderItems;
