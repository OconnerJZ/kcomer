import {
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Restaurant,
  LocalShipping,
} from "@mui/icons-material";

export const ORDER_STATUS = {
  pending: { label: "Pendiente", color: "pending", icon: HourglassEmpty },
  accepted: { label: "Aceptada", color: "accepted", icon: CheckCircle },
  preparing: { label: "Preparando", color: "preparing", icon: Restaurant },
  ready: { label: "Lista", color: "ready", icon: CheckCircle },
  in_delivery: { label: "En camino", color: "in_delivery", icon: LocalShipping },
  completed: { label: "Completada", color: "completed", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "error", icon: Cancel },
};

export const ORDER_STATUS_VALUES = Object.freeze({
  PENDING: "pending",
  ACCEPTED: "accepted",
  PREPARING: "preparing",
  READY: "ready",
  IN_DELIVERY: "in_delivery",
  COMPLETED: "completed",
  CANCELLED: "cancelled",
});

export const STATUS_LABELS = Object.freeze(
  Object.fromEntries(
    Object.entries(ORDER_STATUS).map(([status, config]) => [status, config.label]),
  ),
);

export const STATUS_COLORS = {
  pending: { bg: "#66736A", hover: "#465048" },
  accepted: { bg: "#C65A50", hover: "#8F3E38" },
  preparing: { bg: "#A8753C", hover: "#704A24" },
  ready: { bg: "#5F7864", hover: "#405544" },
  in_delivery: { bg: "#626B73", hover: "#414950" },
  completed: { bg: "#6F6A63", hover: "#403C37" },
};

export const COLOR_MAP = {
  pending: "#66736A",
  accepted: "#C65A50",
  preparing: "#A8753C",
  ready: "#5F7864",
  in_delivery: "#626B73",
  completed: "#6F6A63",
  error: "#B7473F",
  default: "#D9D2C8",
};

export const getActionLabels = (orderType) => ({
  accepted: "Aceptar",
  preparing: "Iniciar preparación",
  ready: "Marcar como lista",
  in_delivery: "En camino",
  completed: orderType === "pickup" ? "Entregar pedido" : "Completar",
});

const DEFAULT_STATUS_FLOW = {
  pending: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "in_delivery",
  in_delivery: "completed",
};

export const getNextStatus = (currentStatus, orderType = "delivery") => {
  if (currentStatus === "ready" && orderType === "pickup") return "completed";
  return DEFAULT_STATUS_FLOW[currentStatus];
};

export const canTransition = (currentStatus, orderType) =>
  Boolean(getNextStatus(currentStatus, orderType));
