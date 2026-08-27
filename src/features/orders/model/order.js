const normalizeModifier = (modifier = {}) => ({
  choiceId: modifier.choiceId ?? modifier.choice_id ?? null,
  group: modifier.group ?? modifier.groupTitle ?? modifier.group_title ?? "",
  name: modifier.name ?? modifier.choiceName ?? modifier.choice_name ?? "",
  priceExtra: Number(modifier.priceExtra ?? modifier.price_extra ?? 0),
  state: modifier.state ?? modifier.selectionState ?? modifier.selection_state ?? "selected",
});

const normalizeOrderItem = (item = {}) => ({
  ...item,
  detailId: item.detailId ?? item.orderDetailId ?? item.order_detail_id ?? null,
  id: item.id ?? item.itemId ?? item.item_id ?? null,
  menuItemId: item.menuItemId ?? item.menu_item_id ?? item.item_id ?? item.id ?? null,
  name: item.name ?? item.itemName ?? item.item_name ?? "",
  quantity: Number(item.quantity ?? 0),
  price: Number(item.price ?? item.unitPrice ?? item.unit_price ?? 0),
  subtotal: Number(item.subtotal ?? 0),
  note: item.note ?? item.notes ?? "",
  image: item.image ?? item.image_url ?? "",
  kitchenStatus: item.kitchenStatus ?? item.kitchen_status ?? "pending",
  modifiers: Array.isArray(item.modifiers) ? item.modifiers.map(normalizeModifier) : [],
});

export const normalizeOrder = (order = {}) => {
  const items = Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [];
  const derivedKitchenProgress = {
    ready: items.reduce((sum, item) => sum + (item.kitchenStatus === "ready" ? Number(item.quantity || 0) : 0), 0),
    total: items.reduce((sum, item) => sum + Number(item.quantity || 0), 0),
  };

  return {
    ...order,
    id: order.id ?? null,
    version: Number(order.version ?? 1),
    businessId: order.businessId ?? order.business_id ?? null,
    userId: order.userId ?? order.user_id ?? null,
    businessName: order.businessName ?? order.business_name ?? "",
    customerName: order.customerName ?? order.customer_name ?? order.user_name ?? "",
    customerPhone: order.customerPhone ?? order.customer_phone ?? order.phone ?? "",
    status: order.status ?? "pending",
    orderType: order.orderType ?? order.order_type ?? order.type ?? "pickup",
    address: order.address ?? order.deliveryAddress ?? order.delivery_address ?? null,
    deliveryAddress: order.deliveryAddress ?? order.delivery_address ?? order.address ?? null,
    notes: order.notes ?? order.note ?? "",
    subtotal: Number(order.subtotal ?? 0),
    deliveryFee: Number(order.deliveryFee ?? order.delivery_fee ?? 0),
    total: Number(order.total ?? order.totalAmount ?? order.total_amount ?? 0),
    createdAt: order.createdAt ?? order.created_at ?? null,
    updatedAt: order.updatedAt ?? order.updated_at ?? null,
    items,
    kitchenProgress: {
      ready: Number(order.kitchenProgress?.ready ?? order.kitchen_progress?.ready ?? derivedKitchenProgress.ready),
      total: Number(order.kitchenProgress?.total ?? order.kitchen_progress?.total ?? derivedKitchenProgress.total),
    },
    statusHistory: Array.isArray(order.statusHistory)
      ? order.statusHistory
      : Array.isArray(order.status_history)
        ? order.status_history
        : [],
  };
};

export const normalizeOrders = (orders = []) => Array.isArray(orders) ? orders.map(normalizeOrder) : [];

export const toOrderPayload = (order = {}) => ({
  business_id: order.businessId,
  user_id: order.userId,
  customer_name: order.customerName,
  customer_phone: order.customerPhone,
  order_type: order.orderType,
  delivery_address: order.address,
  notes: order.notes || undefined,
  items: (order.items || []).map((item) => ({
    item_id: item.menuItemId ?? item.id,
    item_name: item.name,
    quantity: Number(item.quantity),
    price: Number(item.price),
    note: item.note || undefined,
    modifiers: item.modifiers,
  })),
  subtotal: Number(order.subtotal ?? 0),
  delivery_fee: Number(order.deliveryFee ?? 0),
  total_amount: Number(order.total ?? 0),
});
