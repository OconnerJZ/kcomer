export const getOrderEditingConflict = (editingOrder, orders) => {
  if (!editingOrder) return null;
  const current = orders.find((order) => String(order.id) === String(editingOrder.id));
  if (!current) return null;

  if (current.status !== "pending") {
    return {
      key: `${current.id}-status-${current.status}`,
      message: "La orden cambió de estado y quedó bloqueada para edición.",
      severity: "warning",
    };
  }

  if (Number(current.version) !== Number(editingOrder.version)) {
    return {
      key: `${current.id}-version-${current.version}`,
      message: "La orden fue modificada en otra sesión. Se cargó la versión más reciente.",
      severity: "warning",
    };
  }

  return null;
};

export const createOrdersFeedback = (
  message = "",
  severity = "success",
  open = Boolean(message),
) => ({ open, message, severity });
