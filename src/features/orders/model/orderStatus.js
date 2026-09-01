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

export const STATUS_COLORS = {
  pending: { bg: "#467A77", hover: "#dd6b20" },
  accepted: { bg: "#FF4B45", hover: "#C93430" },
  preparing: { bg: "#FF9F1C", hover: "#A95B00" },
  ready: { bg: "#2EAD67", hover: "#187A42" },
  in_delivery: { bg: "#A95B00", hover: "#7A4100" },
  completed: { bg: "#616161", hover: "#4a5568" },
};

export const COLOR_MAP = {
  pending: "#467A77",
  accepted: "#FF4B45",
  preparing: "#FF9F1C",
  ready: "#2EAD67",
  in_delivery: "#A95B00",
  completed: "#616161",
  error: "#e53e3e",
  default: "#e0e0e0",
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
