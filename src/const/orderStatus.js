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
  in_delivery: {
    label: "En camino",
    color: "in_delivery",
    icon: LocalShipping,
  },
  completed: { label: "Completada", color: "completed", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "error", icon: Cancel },
};

export const STATUS_COLORS = {
  pending: { bg: "#467A77", hover: "#dd6b20" },
  accepted: { bg: "#1976D2", hover: "#2c5282" },
  preparing: { bg: "#ED6C02", hover: "#6b46c1" },
  ready: { bg: "#2E7D32", hover: "#2f855a" },
  in_delivery: { bg: "#6A1B9A", hover: "#2f855a" },
  completed: { bg: "#616161", hover: "#4a5568" },
};

export const COLOR_MAP = {
  pending: "#467A77",
  accepted: "#1976D2",
  preparing: "#ED6C02",
  ready: "#2E7D32",
  in_delivery: "#6A1B9A",
  completed: "#616161",
  error: "#e53e3e",
  default: "#e0e0e0",
};


export const getActionLabels = (orderType) => {
  return {
    accepted: "Aceptar",
    preparing: "Iniciar preparación",
    ready: "Marcar como lista",
    in_delivery: orderType === "pickup" ? "Lista para recoger" : "En camino",
    completed: "Completar",
  };
};

export const STATUS_FLOW = {
  pending: "accepted",
  accepted: "preparing",
  preparing: "ready",
  ready: "in_delivery",
  in_delivery: "completed",
};

export const getNextStatus = (currentStatus) => {
  return STATUS_FLOW[currentStatus];
};

export const canTransition = (currentStatus) => {
  return Boolean(STATUS_FLOW[currentStatus]);
};
