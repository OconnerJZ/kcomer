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
import { formatOrderDate, formatCurrency } from "@Utils/formatters";

const OrderCard = ({ order, onViewOrder, onUpdateStatus, isSmall }) => {
  return (
    <Card
      elevation={0}
      sx={{
        backgroundColor: {xs:"rgba(255,255,255,0.4)", sm: "rgba(255,255,255,0.6)"},
        backdropFilter: "blur(1.6px)",
        border: {xs:"", sm: "1px solid #e0e0e0"},
        borderBottom: {xs:"1px solid #c0c0c0"},
        borderRadius: {xs:0, sm:1},
        transition: "border-color 0.2s",
        "&:hover": {
          borderColor: "#1a1a1a41",
        },
      }}
    >
      <CardContent sx={{ p: 2.5 }}>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="start"
          >
            <Stack spacing={0.5}>
              <Typography
                variant="body2"
                sx={{
                  fontFamily: "monospace",
                  fontWeight: 600,
                  fontSize: "0.875rem",
                }}
              >
                #{order.id}
              </Typography>
              <Typography
              variant="button"
              sx={{ fontWeight: 400, fontSize: "0.825rem" }}
            >
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
            <Typography
              variant="caption"
              sx={{ color: "#999", display: "block" }}
            >
              {order.items.length} producto{order.items.length !== 1 ? "s" : ""}{" "}
              • {formatOrderDate(order.createdAt)}
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
                "&:hover": {
                  borderColor: "#1a1a1a",
                  bgcolor: "transparent",
                },
              }}
            >
              Ver detalles
            </Button>
            <ActionButton
              order={order}
              onClick={onUpdateStatus}
              isSmall={isSmall}
            />
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  );
};

export default OrderCard;
