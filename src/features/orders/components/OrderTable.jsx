import {
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
} from "@mui/material";
import { Visibility } from "@mui/icons-material";
import StatusChip from "./StatusChip";
import ActionButton from "./ActionButton";
import {
  formatOrderDate,
  formatCurrency,
} from "@Features/orders/model/orderFormatters";
import { getOrderUrgency } from "@Features/orders/model/orderPriority";

const urgencyChip = {
  overdue: { color: "error", variant: "filled" },
  warning: { color: "warning", variant: "filled" },
  new: { color: "success", variant: "outlined" },
  normal: { color: "default", variant: "outlined" },
};

const OrderTable = ({ orders, onViewOrder, onUpdateStatus, isSmall, highlightedOrderId, now = Date.now() }) => (
  <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #e0e0e0", borderRadius: 0 }}>
    <Table>
      <TableHead>
        <TableRow sx={{ borderBottom: "2px solid rgba(255, 75, 69, 0.8)" }}>
          {["Orden", "Cliente", "Items", "Total", "Estado", "Espera", "Fecha", "Acciones"].map((header) => (
            <TableCell
              key={header}
              align={header === "Acciones" ? "right" : "left"}
              sx={{ fontWeight: 600, fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "0.1em", color: "#666", py: 2 }}
            >
              {header}
            </TableCell>
          ))}
        </TableRow>
      </TableHead>
      <TableBody>
        {orders.map((order) => {
          const highlighted = String(order.id) === String(highlightedOrderId);
          const urgency = getOrderUrgency(order, now);
          const chip = urgencyChip[urgency.level] || urgencyChip.normal;

          return (
            <TableRow
              key={order.id}
              sx={{
                borderBottom: "1px solid #f0f0f0",
                bgcolor: highlighted ? "rgba(255, 75, 69, 0.08)" : "transparent",
                boxShadow: highlighted ? "inset 4px 0 0 rgba(255, 75, 69, 0.9)" : "none",
                "&:hover": { bgcolor: highlighted ? "rgba(255, 75, 69, 0.12)" : "#fafafa" },
                transition: "background-color 0.2s ease, box-shadow 0.2s ease",
              }}
            >
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontFamily: "monospace" }}>#{order.id}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 500, fontSize: "0.875rem" }}>{order.customerName}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ color: "#666", fontSize: "0.875rem" }}>{order.items.length}</Typography></TableCell>
              <TableCell><Typography variant="body2" sx={{ fontWeight: 600, fontSize: "0.875rem" }}>{formatCurrency(order.total)}</Typography></TableCell>
              <TableCell><StatusChip status={order.status} /></TableCell>
              <TableCell>
                <Chip size="small" label={urgency.label} color={chip.color} variant={chip.variant} />
              </TableCell>
              <TableCell><Typography variant="caption" sx={{ color: "#999", fontSize: "0.75rem" }}>{formatOrderDate(order.createdAt)}</Typography></TableCell>
              <TableCell align="right">
                <Stack direction="row" spacing={1} justifyContent="flex-end">
                  <IconButton size="small" onClick={() => onViewOrder(order)} sx={{ "&:hover": { bgcolor: "rgba(0,0,0,0.04)" } }}><Visibility sx={{ fontSize: 18 }} /></IconButton>
                  <ActionButton order={order} onClick={onUpdateStatus} isSmall={isSmall} />
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
