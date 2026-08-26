import { Button, Card, CardContent, Chip, Collapse, Divider, Stack, Typography } from "@mui/material";
import { ExpandLess, ExpandMore } from "@mui/icons-material";
import CircularProgressTracker from "@Components/CicularProgressTracker";
import { ORDER_STATUS, STATUS_LABELS } from "../../context/OrderContext";
import { getStatusColor, getStatusIcon } from "../../model/orderPresentation";
import OrderItemsList from "./OrderItemsList";
import OrderHistory from "./OrderHistory";
import { isMobile } from "@Utils/commons";

export default function CustomerOrderCard({ order, expanded, historyExpanded, onToggle, onToggleHistory, onCancel }) {
  return (
    <Card sx={{ backgroundColor: "rgba(255,255,255,0.5)", height: "100%", display: "flex", flexDirection: "column" }} elevation={0}>
      <CardContent sx={{ paddingBottom: "0px !important", flex: 1 }}>
        <Stack spacing={2} height="100%">
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={onToggle} sx={{ cursor: "pointer" }}>
            <Stack spacing={1} flex={1}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 600, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.businessName}</Typography>
                {expanded ? <ExpandLess /> : <ExpandMore />}
              </Stack>
              {!isMobile() && (
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Chip icon={getStatusIcon(order.status)} label={STATUS_LABELS[order.status]} color={getStatusColor(order.status)} size="small" />
                  <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString("es-MX")}</Typography>
                </Stack>
              )}
            </Stack>
            <Typography variant="subtitle2" color="success" sx={{ fontWeight: 700, ml: 1 }}>${order.total.toFixed(2)}</Typography>
          </Stack>

          {order.status !== ORDER_STATUS.CANCELLED && <CircularProgressTracker status={order.status} />}

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
