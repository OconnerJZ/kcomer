import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  IconButton,
  Chip,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import StatusChip from "./StatusChip";
import ActionButton from "./ActionButton";
import PendingOrderActions from "./PendingOrderActions";
import { formatOrderDate, formatCurrency } from "@Features/orders/model/orderFormatters";
import { getOrderUrgency } from "@Features/orders/model/orderPriority";

const urgencyChip = {
  overdue: { color: "error", variant: "filled" },
  warning: { color: "warning", variant: "filled" },
  new: { color: "success", variant: "outlined" },
  normal: { color: "default", variant: "outlined" },
};

const columnWidths = { order: 82, customer: 160, items: 62, kitchen: 132, total: 102, status: 128, wait: 105, date: 128, actions: 145 };
const terminalStatuses = new Set(["completed", "cancelled"]);

const KitchenProgress = ({ order }) => {
  const ready = Number(order.kitchenProgress?.ready || 0);
  const total = Number(order.kitchenProgress?.total || 0);
  const active = ["accepted", "preparing", "ready"].includes(order.status);
  if (!active || total < 1) return <Typography variant="caption" color="text.disabled">—</Typography>;

  const complete = ready >= total;
  return (
    <Stack spacing={0.45} sx={{ width: 88 }}>
      <Typography variant="caption" fontWeight={600} color={complete ? "success.main" : "text.secondary"}>{ready} de {total}</Typography>
      <LinearProgress variant="determinate" value={(ready / total) * 100} color={complete ? "success" : "primary"} sx={{ height: 4, borderRadius: "6px", bgcolor: "rgba(0,0,0,.06)" }} />
      {!complete && <Typography variant="caption" color="warning.dark" fontWeight={600} sx={{ fontSize: ".62rem" }}>{order.status === "accepted" ? "Inicia productos" : "Avanza productos"}</Typography>}
    </Stack>
  );
};

const OrderTable = ({ orders, onViewOrder, onUpdateStatus, isSmall, highlightedOrderId, now = Date.now() }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid", borderColor: "divider", borderRadius: "8px", overflowX: "auto", bgcolor: "rgba(255,255,255,.88)" }}>
    <Table sx={{ minWidth: 1080, tableLayout: "fixed" }}>
      <TableHead>
        <TableRow sx={{ borderBottom: "1px solid", borderColor: "divider" }}>
          {[["Orden", columnWidths.order], ["Cliente", columnWidths.customer], ["Items", columnWidths.items], ["Preparados", columnWidths.kitchen], ["Total", columnWidths.total], ["Estado", columnWidths.status], ["Espera", columnWidths.wait], ["Fecha", columnWidths.date], ["Acciones", columnWidths.actions]].map(([header, width]) => (
            <TableCell key={header} align={header === "Acciones" ? "right" : "left"} sx={{ width, minWidth: width, maxWidth: width, fontWeight: 700, fontSize: "0.69rem", textTransform: "uppercase", letterSpacing: ".1em", color: "text.secondary", py: 1.6, bgcolor: "rgba(248,248,248,.72)" }}>{header}</TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => {
          const highlighted = String(order.id) === String(highlightedOrderId);
          const urgency = getOrderUrgency(order, now);
          const chip = urgencyChip[urgency.level] || urgencyChip.normal;
          const terminal = terminalStatuses.has(order.status);

          return (
            <TableRow key={order.id} sx={{ height: 66, bgcolor: highlighted ? "rgba(198,90,80,.055)" : "transparent", boxShadow: highlighted ? "inset 3px 0 0 rgba(198,90,80,.9)" : "none", "&:hover": { bgcolor: highlighted ? "rgba(198,90,80,.08)" : "rgba(0,0,0,.018)" }, transition: "background-color .18s ease, box-shadow .18s ease", "& td": { borderColor: "rgba(0,0,0,.055)", py: 1.2 } }}>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>#{order.id}</Typography></TableCell>
              <TableCell><Typography variant="body2" fontWeight={650} noWrap>{order.customerName || "Cliente"}</Typography></TableCell>
              <TableCell><Typography variant="body2" color="text.secondary">{order.items?.reduce((sum, item) => sum + Number(item.quantity || 0), 0) || 0}</Typography></TableCell>
              <TableCell><KitchenProgress order={order} /></TableCell>
              <TableCell><Typography variant="body2" fontWeight={600} noWrap>{formatCurrency(order.total)}</Typography></TableCell>
              <TableCell sx={{ overflow: "hidden" }}><StatusChip status={order.status} /></TableCell>
              <TableCell>{terminal ? <Typography variant="caption" color="text.disabled">—</Typography> : <Chip size="small" label={urgency.label} color={chip.color} variant={chip.variant} sx={{ maxWidth: 96 }} />}</TableCell>
              <TableCell><Typography variant="caption" color="text.secondary" noWrap>{formatOrderDate(order.createdAt)}</Typography></TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={0.55} justifyContent="flex-end" alignItems="center" sx={{ minHeight: 36 }}>
                  <Tooltip title="Ver detalle" arrow><IconButton size="small" onClick={() => onViewOrder(order)} sx={{ width: 34, height: 34 }}><Visibility sx={{ fontSize: 18 }} /></IconButton></Tooltip>
                  {order.status === "pending" ? <PendingOrderActions order={order} onUpdateStatus={onUpdateStatus} /> : <Box sx={{ width: 72, display: "flex", justifyContent: "flex-end" }}><ActionButton order={order} onClick={onUpdateStatus} isSmall={isSmall} /></Box>}
                </Stack>
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  </TableContainer>
);

export default OrderTable;
