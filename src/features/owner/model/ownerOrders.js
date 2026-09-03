import { getOrderUrgency } from "../../orders/model/orderPriority.js";

export const PRODUCTION_STATUSES = Object.freeze(["accepted", "preparing", "ready"]);

export const matchesOperationalFilter = (order, filter, now = Date.now()) => {
  if (!filter) return true;
  if (filter === "new") {
    return order.status === "pending" && getOrderUrgency(order, now).level === "new";
  }
  if (filter === "preparing") return ["accepted", "preparing"].includes(order.status);
  if (filter === "ready") return order.status === "ready";
  if (filter === "overdue") return getOrderUrgency(order, now).level === "overdue";
  return true;
};

export const getOperationalCounts = (orders = [], now = Date.now()) => ({
  new: orders.filter((order) => matchesOperationalFilter(order, "new", now)).length,
  preparing: orders.filter((order) => matchesOperationalFilter(order, "preparing", now)).length,
  ready: orders.filter((order) => matchesOperationalFilter(order, "ready", now)).length,
  overdue: orders.filter((order) => matchesOperationalFilter(order, "overdue", now)).length,
});

export const filterOrdersByOperation = (orders = [], filter, now = Date.now()) =>
  orders.filter((order) => matchesOperationalFilter(order, filter, now));

export const getProductionOrders = (orders = []) =>
  orders.filter((order) => PRODUCTION_STATUSES.includes(order.status));
