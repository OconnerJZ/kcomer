import { Box, Button, Collapse, Stack, Typography } from "@mui/material";
import { ExpandLess, ExpandMore, HistoryRounded } from "@mui/icons-material";
import { STATUS_LABELS } from "../../context/OrderContext";
import { getStatusColor, getStatusIcon } from "../../model/orderPresentation";

const formatMoment = (value) => {
  if (!value) return "";
  return new Date(value).toLocaleString("es-MX", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};

export default function OrderHistory({ order, expanded, onToggle }) {
  const history = order.statusHistory || [];

  return (
    <Box sx={{ pb: 1 }}>
      <Button
        onClick={onToggle}
        fullWidth
        variant="text"
        sx={{
          justifyContent: "space-between",
          textTransform: "none",
          py: 1.2,
          px: 0,
          borderRadius: 0,
          color: "text.primary",
          "&:hover": { bgcolor: "transparent", color: "primary.main" },
        }}
      >
        <Stack direction="row" alignItems="center" spacing={1.1}>
          <Box sx={{ width: 32, height: 32, borderRadius: 2, display: "grid", placeItems: "center", bgcolor: "rgba(255,75,69,.08)", color: "primary.main" }}>
            <HistoryRounded sx={{ fontSize: 18 }} />
          </Box>
          <Box sx={{ textAlign: "left" }}>
            <Typography variant="body2" fontWeight={850}>Historial del pedido</Typography>
            <Typography variant="caption" color="text.secondary">{history.length} {history.length === 1 ? "movimiento" : "movimientos"}</Typography>
          </Box>
        </Stack>
        {expanded ? <ExpandLess /> : <ExpandMore />}
      </Button>

      <Collapse in={expanded}>
        <Box sx={{ mt: 1.2, pl: .5 }}>
          {history.map((item, index) => {
            const latest = index === history.length - 1;
            const color = getStatusColor(item.status);
            return (
              <Box key={`${order.id}-history-${index}`} sx={{ display: "grid", gridTemplateColumns: "34px minmax(0,1fr)", gap: 1.25, position: "relative", pb: index === history.length - 1 ? .5 : 2.1 }}>
                <Box sx={{ position: "relative", display: "flex", justifyContent: "center" }}>
                  {index < history.length - 1 && <Box sx={{ position: "absolute", top: 28, bottom: -17, width: 1.5, bgcolor: "divider" }} />}
                  <Box sx={{ width: latest ? 30 : 26, height: latest ? 30 : 26, borderRadius: "50%", display: "grid", placeItems: "center", bgcolor: latest ? `${color}.main` : "background.paper", color: latest ? "common.white" : `${color}.main`, border: "1.5px solid", borderColor: `${color}.main`, boxShadow: latest ? "0 5px 16px rgba(0,0,0,.12)" : "none", zIndex: 1 }}>
                    {getStatusIcon(item.status, true)}
                  </Box>
                </Box>

                <Box sx={{ minWidth: 0, pt: .1 }}>
                  <Stack direction="row" justifyContent="space-between" alignItems="baseline" spacing={1}>
                    <Typography variant="body2" fontWeight={latest ? 850 : 700}>{STATUS_LABELS[item.status] || item.status}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ whiteSpace: "nowrap", fontSize: ".68rem" }}>{formatMoment(item.timestamp || item.createdAt)}</Typography>
                  </Stack>
                  {item.note && (
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: .45, lineHeight: 1.55 }}>
                      {item.note}
                    </Typography>
                  )}
                  {latest && (
                    <Typography variant="caption" sx={{ display: "inline-block", mt: .65, px: .8, py: .2, borderRadius: 999, bgcolor: `${color}.main`, color: "common.white", fontWeight: 750, fontSize: ".62rem" }}>
                      Estado actual
                    </Typography>
                  )}
                </Box>
              </Box>
            );
          })}
        </Box>
      </Collapse>
    </Box>
  );
}
