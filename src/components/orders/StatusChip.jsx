import { Box } from "@mui/material";
import { ORDER_STATUS } from "@Const/orderStatus"; 
import { getStatusColor } from "@Utils/formatters"; 

const StatusChip = ({ status }) => {
  const StatusIcon = ORDER_STATUS[status].icon;
  const color = getStatusColor(status);

  return (
    <Box
      sx={{
        display: "inline-flex",
        alignItems: "center",
        gap: 0.5,
        px: 1,
        py: 0.25,
        border: `1px solid ${color}`,
        borderRadius:3,
        color: color,
        fontSize: "0.75rem",
        fontWeight: 500,
      }}
    >
      <StatusIcon sx={{ fontSize: 15 }} />
      {ORDER_STATUS[status].label}
    </Box>
  );
};

export default StatusChip;