import { Button } from "@mui/material";
import { getNextStatus, getActionLabels, STATUS_COLORS } from "@Const/orderStatus";  

const ActionButton = ({ order, onClick, isSmall }) => {
  const nextStatus = getNextStatus(order.status);
  const actionLabel = getActionLabels(order.orderType);
  if (!nextStatus) return null;
  if (!actionLabel) return null;

  const colors = STATUS_COLORS[order.status] || { bg: "#1a1a1a", hover: "#2a2a2a" };

  return (
    <Button
      size="small"
      variant="contained"
      disableElevation
      fullWidth={isSmall}
      onClick={() => onClick(order.id, nextStatus)}
      sx={{
        bgcolor: colors.bg,
        color: "white",
        textTransform: "none",
        fontWeight: 500,
        px: 2.5,
        py: 0.75,
        fontSize: "0.813rem",
        letterSpacing: "0.01em",
        "&:hover": {
          bgcolor: colors.hover,
        },
      }}
    >
      {actionLabel[nextStatus]}
    </Button>
  );
};

export default ActionButton;