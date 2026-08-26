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
    <Card sx={{ backgroundColor: "rgba(255,255,255,0.5)", height: "100%", display: "flex", flexDirection: "column" }} elevation={0}>
      <CardContent sx={{ paddingBottom: "0px !important", flex: 1 }}>
        <Stack spacing={2} height="100%">
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={onToggle} sx={{ cursor: "pointer" }}>
            <Stack spacing={1} flex={1} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.businessName}</Typography>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </Stack>
              {!isMobile && (
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <StatusChip status={order.status} />
                  <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString("es-MX")}</Typography>
                </Stack>
              )}
            </Stack>
            <Typography variant="subtitle2" color="success.main" sx={{ fontWeight: 700, ml: 1 }}>${Number(order.total || 0).toFixed(2)}</Typography>
          </Stack>

          {!isMobile && ![ORDER_STATUS.CANCELLED, "rejected"].includes(order.status) && (
            <OrderProgressTracker status={order.status} />
          )}

          {isMobile && <StatusChip status={order.status} />}

          <Collapse in={expanded}>
            <Divider sx={{ mb: 2 }} />
            <OrderItemsList order={order} />
            <Divider sx={{ my: 1 }} />
            <OrderHistory order={order} expanded={historyExpanded} onToggle={onToggleHistory} />
            {order.status === ORDER_STATUS.PENDING && (
              <>
                <Divider sx={{ my: 2 }} />
                <Button variant="outlined" color="error" fullWidth onClick={onCancel} sx={{ borderRadius: 2, py: 1, textTransform: "none", fontWeight: 600 }}>Cancelar Orden</Button>
              </>
            )}
          </Collapse>
        </Stack>
      </CardContent>
    </Card>
  );
}
