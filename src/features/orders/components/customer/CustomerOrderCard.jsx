import { Button, Card, CardContent, Collapse, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import { ORDER_STATUS } from "@Features/orders/context/OrderContext";
import StatusChip from "@Features/orders/components/StatusChip";
import OrderProgressTracker from "./OrderProgressTracker";
import OrderItemsList from "./OrderItemsList";
import OrderHistory from "./OrderHistory";

export default function CustomerOrderCard({ order, expanded, historyExpanded, onToggle, onToggleHistory, onCancel }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card
      elevation={0}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        bgcolor: "rgba(255,255,255,.68)",
        backdropFilter: "blur(10px)",
        overflow: "hidden",
      }}
    >
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: { xs: 2, sm: 2.5 } }, flex: 1 }}>
        <Stack spacing={2.25} height="100%">
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={onToggle} sx={{ cursor: "pointer" }}>
            <Stack spacing={.8} flex={1} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.businessName}</Typography>
                {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </Stack>
              <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                <StatusChip status={order.status} />
                {!isMobile && <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString("es-MX")}</Typography>}
              </Stack>
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, ml: 1 }}>${Number(order.total || 0).toFixed(2)}</Typography>
          </Stack>

          {order.status !== ORDER_STATUS.CANCELLED && (
            <OrderProgressTracker status={order.status} orderType={order.orderType} compact={isMobile && !expanded} />
          )}

          <Collapse in={expanded}>
            <Divider sx={{ mb: 2 }} />
            <OrderItemsList order={order} />
            <Divider sx={{ my: 1 }} />
            <OrderHistory order={order} expanded={historyExpanded} onToggle={onToggleHistory} />
            {order.status === ORDER_STATUS.PENDING && (
              <>
                <Divider sx={{ my: 2 }} />
                <Button variant="outlined" color="error" fullWidth onClick={onCancel} sx={{ borderRadius: 2, py: 1, textTransform: "none", fontWeight: 700 }}>Cancelar Orden</Button>
              </>
            )}
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
