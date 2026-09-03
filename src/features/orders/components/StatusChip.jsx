import { Box } from "@mui/material";
import { ORDER_STATUS, COLOR_MAP } from "@Features/orders/model/orderStatus";

const StatusChip = ({ status }) => {
  const statusConfig = ORDER_STATUS[status];
  const StatusIcon = statusConfig?.icon;
  const color = COLOR_MAP[statusConfig?.color] || COLOR_MAP.default;

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.25,
        border: `1px solid ${color}`,
        borderRadius: "8px",
        color,
        fontSize: "0.75rem",
        fontWeight: 500,
      }}
    >
      {StatusIcon && <StatusIcon sx={{ fontSize: 15 }} />}
      {statusConfig?.label || status}
    </Box>
  );
};

export default StatusChip;
