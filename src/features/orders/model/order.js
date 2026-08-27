const normalizeOrderItem = (item = {}) => ({
  id: item.id ?? item.itemId ?? item.item_id ?? null,
  menuItemId: item.menuItemId ?? item.menu_item_id ?? item.item_id ?? item.id ?? null,
  name: item.name ?? item.itemName ?? item.item_name ?? "",
  quantity: Number(item.quantity ?? 0),
  price: Number(item.price ?? item.unit_price ?? 0),
  note: item.note ?? "",
  image: item.image ?? item.image_url ?? "",
});

export const normalizeOrder = (order = {}) => ({
  ...order,
  id: order.id ?? null,
  businessId: order.businessId ?? order.business_id ?? null,
  userId: order.userId ?? order.user_id ?? null,
  customerName: order.customerName ?? order.customer_name ?? order.user_name ?? "",
  customerPhone: order.customerPhone ?? order.customer_phone ?? order.phone ?? "",
  status: order.status ?? "pending",
  orderType: order.orderType ?? order.order_type ?? order.type ?? "pickup",
  address: order.address ?? order.deliveryAddress ?? order.delivery_address ?? null,
  notes: order.notes ?? order.note ?? "",
  subtotal: Number(order.subtotal ?? 0),
  deliveryFee: Number(order.deliveryFee ?? order.delivery_fee ?? 0),
  total: Number(order.total ?? order.totalAmount ?? order.total_amount ?? 0),
  createdAt: order.createdAt ?? order.created_at ?? null,
  updatedAt: order.updatedAt ?? order.updated_at ?? null,
  items: Array.isArray(order.items) ? order.items.map(normalizeOrderItem) : [],
});

export const normalizeOrders = (orders = []) =>
  Array.isArray(orders) ? orders.map(normalizeOrder) : [];

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
  })),
  subtotal: Number(order.subtotal ?? 0),
  delivery_fee: Number(order.deliveryFee ?? 0),
  total_amount: Number(order.total ?? 0),
});
