import { Box, Button, Chip, Collapse, Paper, Stack, Typography } from "@mui/material";
import { AccessTime, ExpandLess, ExpandMore, History as HistoryIcon } from "@mui/icons-material";
import { STATUS_LABELS } from "../../context/OrderContext";
import { getStatusColor, getStatusIcon } from "../../model/orderPresentation";

export default function OrderHistory({ order, expanded, onToggle }) {
  return (
    <Box sx={{ pb: 2 }}>
      <Button onClick={onToggle} fullWidth variant="text" sx={{ justifyContent: "space-between", textTransform: "none", py: 1.5, px: 2, borderRadius: 2, bgcolor: "background.default", "&:hover": { bgcolor: "action.hover" } }}>
        <Stack direction="row" alignItems="center" gap={1}>
          <HistoryIcon sx={{ fontSize: 22, color: "info.main" }} />
          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Ver historial del pedido</Typography>
          <Chip label={order.statusHistory.length} size="small" color="info" sx={{ ml: 0.5 }} />
        </Stack>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Button>

      <Collapse in={expanded}>
        <Box sx={{ mt: 2, position: "relative", pl: 3 }}>
          <Box sx={{ position: "absolute", left: "20px", top: "20px", bottom: "20px", width: "2px", bgcolor: "divider" }} />
          <Stack spacing={2}>
            {order.statusHistory.map((history, idx) => {
              const isLast = idx === order.statusHistory.length - 1;
              return (
                <Box key={`${order.id}-history-${idx}`} sx={{ position: "relative", display: "flex", alignItems: "flex-start", gap: 2 }}>
                  <Box sx={{ position: "absolute", left: "-28px", top: "8px", width: isLast ? 40 : 36, height: isLast ? 40 : 36, borderRadius: "50%", bgcolor: `${getStatusColor(history.status)}.main`, display: "flex", alignItems: "center", justifyContent: "center", color: "white", boxShadow: isLast ? 3 : 1, transform: isLast ? "scale(1.05)" : "scale(1)", zIndex: 1, border: "3px solid white" }}>
                    {getStatusIcon(history.status, true)}
                  </Box>
                  <Paper elevation={0} sx={{ flex: 1, p: 1.5, bgcolor: isLast ? "action.selected" : "background.default", borderRadius: 2, border: "1px solid", borderColor: isLast ? "primary.main" : "divider", ml: 2 }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="flex-start" gap={1}>
                      <Typography variant="body2" sx={{ fontWeight: isLast ? 600 : 500, color: isLast ? "primary.main" : "text.primary" }}>{STATUS_LABELS[history.status]}</Typography>
                      <Stack direction="row" alignItems="center" gap={0.3}>
                        <AccessTime sx={{ fontSize: 12, color: "text.secondary" }} />
                        <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap" }}>
                          {new Date(history.timestamp).toLocaleString("es-MX", { day: "2-digit", month: "short", hour: "2-digit", minute: "2-digit" })}
                        </Typography>
                      </Stack>
                    </Stack>
                    {history.note && (
                      <Box sx={{ mt: 1, p: 0.8, bgcolor: "info.lighter", borderRadius: 1, borderLeft: "3px solid", borderColor: "info.main" }}>
                        <Typography variant="caption" sx={{ fontStyle: "italic", color: "info.dark" }}>💬 {history.note}</Typography>
                      </Box>
                    )}
                  </Paper>
                </Box>
              );
            })}
          </Stack>
        </Box>
      </Collapse>
    </Box>
  );
}
