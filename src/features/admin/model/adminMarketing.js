export const MARKETING_STATUS_LABELS = Object.freeze({
  draft: "Borrador",
  scheduled: "Programada",
  active: "Activa",
  paused: "Pausada",
  ended: "Finalizada",
});

export const AD_STATUS_LABELS = Object.freeze({
  draft: "Borrador",
  pending_billing: "Pendiente de billing",
  ready: "Lista",
  active: "Activa",
  paused: "Pausada",
  ended: "Finalizada",
});

export const AD_MODERATION_LABELS = Object.freeze({
  not_submitted: "Sin enviar",
  pending: "Pendiente",
  approved: "Aprobada",
  rejected: "Rechazada",
});

export const MARKETING_AUDIENCE_LABELS = Object.freeze({
  all: "Todos",
  new: "Nuevos",
  returning: "Recurrentes",
  frequent: "Frecuentes",
  inactive_90: "Inactivos 90+ días",
});

export const statusColor = (status) => {
  if (status === "active" || status === "approved") return "success";
  if (status === "pending" || status === "pending_billing" || status === "scheduled") return "warning";
  if (status === "rejected" || status === "ended") return "default";
  return "default";
};

export const formatAdminCurrency = (value) => new Intl.NumberFormat("es-MX", {
  style: "currency",
  currency: "MXN",
  maximumFractionDigits: 2,
}).format(Number(value || 0));

export const formatAdminDateTime = (value) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return new Intl.DateTimeFormat("es-MX", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};
