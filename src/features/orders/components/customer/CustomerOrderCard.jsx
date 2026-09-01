import { Box, Button, Card, CardContent, Collapse, Divider, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import { EditRounded, ExpandLess, ExpandMore, GroupsRounded } from "@mui/icons-material";
import PropTypes from "prop-types";
import { ORDER_STATUS } from "@Features/orders/context/OrderContext";
import OrderProgressTracker from "./OrderProgressTracker";
import OrderItemsList from "./OrderItemsList";
import OrderHistory from "./OrderHistory";
import TransferPaymentPanel from "@Features/payments/components/TransferPaymentPanel";

export default function CustomerOrderCard({ order, expanded, historyExpanded, onToggle, onToggleHistory, onCancel, onEdit }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <Card elevation={0} sx={{ position: "relative", display: "flex", flexDirection: "column", borderColor: "divider", borderRadius: 3, bgcolor: "rgba(255,255,255,.78)", backdropFilter: "blur(10px)", overflow: "hidden" }}>
      <CardContent sx={{ p: { xs: 2, sm: 2.5 }, "&:last-child": { pb: order.sharedSessionId ? { xs: 5, sm: 5 } : { xs: 2, sm: 2.5 } }, flex: 1 }}>
        <Stack spacing={isMobile ? 1.75 : 2.25} height="100%">
          <Stack direction="row" justifyContent="space-between" alignItems="center" onClick={onToggle} sx={{ cursor: "pointer" }}>
            <Stack spacing={.65} flex={1} minWidth={0}>
              <Stack direction="row" spacing={1} alignItems="center">
                <Typography variant="subtitle1" sx={{ fontWeight: 800, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.businessName}</Typography>
                {expanded ? <ExpandLess fontSize="small" /> : <ExpandMore fontSize="small" />}
              </Stack>
              {!isMobile && (
                <Stack direction="row" spacing={1} alignItems="center" flexWrap="wrap">
                  <Typography variant="caption" color="text.secondary">{new Date(order.createdAt).toLocaleString("es-MX")}</Typography>
                </Stack>
              )}
            </Stack>
            <Typography variant="subtitle2" sx={{ fontWeight: 900, ml: 1 }}>${Number(order.total || 0).toFixed(2)}</Typography>
          </Stack>

          {order.status !== ORDER_STATUS.CANCELLED && <OrderProgressTracker status={order.status} orderType={order.orderType} compact={isMobile} />}

          <Collapse in={expanded}>
            <Divider sx={{ mb: 2 }} />
            <OrderItemsList order={order} />
            <Divider sx={{ my: 1.25 }} />
            <OrderHistory order={order} expanded={historyExpanded} onToggle={onToggleHistory} />
            {order.viewerCanManage !== false && <TransferPaymentPanel order={order} />}
            {order.status === ORDER_STATUS.PENDING && order.viewerCanManage !== false && (
              <>
                <Divider sx={{ my: 2 }} />
                <Stack spacing={1}>
                  <Button variant="contained" disableElevation fullWidth startIcon={<EditRounded />} onClick={onEdit} sx={{ borderRadius: 2, py: 1, textTransform: "none", fontWeight: 750 }}>
                    Modificar orden
                  </Button>
                  <Typography variant="caption" color="text.secondary" textAlign="center">Puedes cambiar productos y cantidades hasta que el negocio acepte la orden.</Typography>
                  <Button variant="outlined" color="error" fullWidth onClick={onCancel} sx={{ borderRadius: 2, py: 1, textTransform: "none", fontWeight: 700 }}>Cancelar Orden</Button>
                </Stack>
              </>
            )}
          </Collapse>
        </Stack>
      </CardContent>
      {order.sharedSessionId && <Box sx={{ position: "absolute", right: 0, bottom: 0, display: "flex", alignItems: "center", gap: 0.55, px: 1.35, py: 0.7, borderRadius: "14px 0 0 0", bgcolor: "rgba(255,75,69,.10)", color: "primary.dark", borderTop: "1px solid rgba(255,75,69,.16)", borderLeft: "1px solid rgba(255,75,69,.16)" }}><GroupsRounded sx={{ fontSize: 15 }} /><Typography variant="caption" fontWeight={850}>Compartida</Typography></Box>}
    </Card>
  );
}

CustomerOrderCard.propTypes = {
  order: PropTypes.object.isRequired,
  expanded: PropTypes.bool.isRequired,
  historyExpanded: PropTypes.bool.isRequired,
  onToggle: PropTypes.func.isRequired,
  onToggleHistory: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  onEdit: PropTypes.func.isRequired,
};
