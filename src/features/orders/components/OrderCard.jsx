import {
  Card,
  CardContent,
  Stack,
  Typography,
  Divider,
  Box,
  Button,
} from "@mui/material";
import StatusChip from "./StatusChip";
import ActionButton from "./ActionButton";
import {
  formatOrderDate,
  formatCurrency,
} from "@Features/orders/model/orderFormatters";

const OrderCard = ({ order, onViewOrder, onUpdateStatus, isSmall, highlighted = false }) => {
  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: highlighted
          ? "rgba(255, 75, 69, 0.10)"
          : { xs: "rgba(255,255,255,0.4)", sm: "rgba(255,255,255,0.6)" },
        backdropFilter: "blur(1.6px)",
        border: highlighted
          ? "1px solid rgba(255, 75, 69, 0.65)"
          : { xs: "", sm: "1px solid #e0e0e0" },
        borderBottom: highlighted
          ? "1px solid rgba(255, 75, 69, 0.65)"
          : { xs: "1px solid #c0c0c0" },
        borderRadius: { xs: 0, sm: 1 },
        boxShadow: highlighted ? "inset 4px 0 0 rgba(255, 75, 69, 0.9)" : "none",
        transition: "border-color 0.2s, background-color 0.25s, box-shadow 0.25s",
        "&:hover": { borderColor: highlighted ? "rgba(255, 75, 69, 0.9)" : "#1a1a1a41" },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack direction="row" justifyContent="space-between" alignItems="start">
            <Stack spacing={0.5}>
              <Typography variant="body2" sx={{ fontFamily: "monospace", fontWeight: 600, fontSize: "0.875rem" }}>
                #{order.id}
              </Typography>
              <Typography variant="button" sx={{ fontWeight: 400, fontSize: "0.825rem" }}>
                {order.orderType}
              </Typography>
            </Stack>
            <StatusChip status={order.status} />
          </Stack>

          <Divider sx={{ borderColor: "#f0f0f0" }} />

          <Box>
            <Typography variant="body2" sx={{ fontWeight: 500, mb: 0.5 }}>
              {order.customerName}
            </Typography>
            <Typography variant="caption" sx={{ color: "#999", display: "block" }}>
              {order.items.length} producto{order.items.length !== 1 ? "s" : ""} • {formatOrderDate(order.createdAt)}
            </Typography>
            <Typography variant="body2" sx={{ mt: 0.5, fontWeight: 700 }}>
              {formatCurrency(order.total)}
            </Typography>
          </Box>

          <Stack direction="row" spacing={1}>
            <Button
              size="small"
              variant="outlined"
              onClick={() => onViewOrder(order)}
              sx={{
                borderColor: "#e0e0e0",
                color: "#1a1a1a",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 1,
                fontSize: "0.813rem",
                "&:hover": { borderColor: "#1a1a1a", bgcolor: "transparent" },
              }}
            >
              Ver detalles
            </Button>
            <ActionButton order={order} onClick={onUpdateStatus} isSmall={isSmall} />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
