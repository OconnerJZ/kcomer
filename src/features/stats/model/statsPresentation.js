export const money = (value) => new Intl.NumberFormat("es-MX", { style: "currency", currency: "MXN", maximumFractionDigits: 2 }).format(Number(value || 0));
export const integer = (value) => new Intl.NumberFormat("es-MX", { maximumFractionDigits: 0 }).format(Number(value || 0));
export const minutes = (value) => Number(value || 0) > 0 ? `${Number(value).toFixed(1)} min` : "Sin datos";
export const deltaTone = (value, inverse = false) => {
  const numeric = Number(value || 0);
  if (numeric === 0) return "neutral";
  const positive = numeric > 0;
  return inverse ? (positive ? "negative" : "positive") : (positive ? "positive" : "negative");
};
export const paymentLabel = (method) => ({ cash: "Efectivo", card: "Tarjeta", wallet: "Wallet", transfer: "Transferencia" })[method] || method;
export const orderTypeLabel = (type) => ({ pickup: "Recoger", delivery: "Delivery" })[type] || type;
