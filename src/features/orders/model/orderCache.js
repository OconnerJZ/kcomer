export const getDraftOrders = (draft) => {
  if (Array.isArray(draft)) return draft;
  if (Array.isArray(draft?.data)) return draft.data;
  return null;
};

const findOrder = (draft, orderId) => {
  const orders = getDraftOrders(draft);
  return orders?.find((order) => String(order.id) === String(orderId));
};

export const upsertOrder = (draft, incomingOrder, { prepend = false } = {}) => {
  const orders = getDraftOrders(draft);
  if (!orders || !incomingOrder?.id) return false;

  const index = orders.findIndex((order) => String(order.id) === String(incomingOrder.id));
  if (index >= 0) {
    Object.assign(orders[index], incomingOrder);
    return true;
  }

  if (prepend) orders.unshift(incomingOrder);
  else orders.push(incomingOrder);
  return true;
};

export const patchOrderStatus = (draft, payload) => {
  const order = findOrder(draft, payload?.orderId ?? payload?.id);
  if (!order || !payload?.status) return false;

  order.status = payload.status;
  order.updatedAt = payload.timestamp || payload.updatedAt || new Date().toISOString();

  if (Array.isArray(order.statusHistory)) {
    const latest = order.statusHistory.at(-1);
    if (latest?.status !== payload.status) {
      order.statusHistory.push({
        status: payload.status,
        timestamp: order.updatedAt,
        note: payload.note || payload.statusLabel || `Estado cambiado a ${payload.status}`,
      });
    }
  }

  return true;
};

export const recalcKitchenProgress = (order) => {
  const items = order?.items || [];
  const total = items.reduce((sum, item) => sum + Number(item.quantity || 0), 0);
  const ready = items.reduce(
    (sum, item) => sum + (item.kitchenStatus === "ready" ? Number(item.quantity || 0) : 0),
    0,
  );
  order.kitchenProgress = { ready, total };
};

export const patchKitchenItem = (draft, payload) => {
  const order = findOrder(draft, payload?.orderId);
  if (!order || !payload?.detailId) return false;

  const target = order.items?.find(
    (item) => String(item.detailId) === String(payload.detailId),
  );
  if (!target) return false;

  if (payload.item) Object.assign(target, payload.item);
  if (payload.status) target.kitchenStatus = payload.status;
  if (payload.orderStatus) order.status = payload.orderStatus;
  else if (payload.promoteAcceptedToPreparing && payload.status === "preparing" && order.status === "accepted") {
    order.status = "preparing";
  }
  if (payload.kitchenProgress) order.kitchenProgress = payload.kitchenProgress;
  else recalcKitchenProgress(order);
  order.updatedAt = payload.timestamp || order.updatedAt;
  return true;
};

export const patchTransferPayment = (draft, payload) => {
  const order = findOrder(draft, payload?.orderId);
  if (!order || !payload?.transferPayment) return false;
  order.transferPayment = payload.transferPayment;
  return true;
};
