import {
  AccessTime,
  CheckCircle,
  DeliveryDining,
  HourglassEmpty,
  Restaurant,
} from "@mui/icons-material";
import { ORDER_STATUS } from "../context/OrderContext";

export const getStatusColor = (status) => ({
  [ORDER_STATUS.PENDING]: "warning",
  [ORDER_STATUS.ACCEPTED]: "info",
  [ORDER_STATUS.PREPARING]: "primary",
  [ORDER_STATUS.READY]: "success",
  [ORDER_STATUS.IN_DELIVERY]: "success",
  [ORDER_STATUS.COMPLETED]: "default",
  [ORDER_STATUS.CANCELLED]: "error",
}[status] || "default");

export const getStatusIcon = (status, small = false) => {
  const props = small ? { fontSize: "small" } : {};
  const icons = {
    [ORDER_STATUS.PENDING]: <HourglassEmpty {...props} />,
    [ORDER_STATUS.ACCEPTED]: <CheckCircle {...props} />,
    [ORDER_STATUS.PREPARING]: <Restaurant {...props} />,
    [ORDER_STATUS.READY]: <CheckCircle {...props} />,
    [ORDER_STATUS.IN_DELIVERY]: <DeliveryDining {...props} />,
    [ORDER_STATUS.COMPLETED]: <CheckCircle {...props} />,
    [ORDER_STATUS.CANCELLED]: <CheckCircle {...props} />,
  };
  return icons[status] || <AccessTime {...props} />;
};
