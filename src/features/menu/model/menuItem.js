export const normalizeMenuItem = (item = {}) => ({
  ...item,
  id: item.id,
  businessId: item.businessId ?? item.business_id ?? null,
  name: item.name ?? item.item_name ?? "",
  description: item.description ?? "",
  price: Number(item.price) || 0,
  category: item.category ?? "",
  image: item.image ?? item.image_url ?? "",
  available: item.available ?? item.is_available ?? true,
});

export const normalizeMenuItems = (items = []) =>
  Array.isArray(items) ? items.map(normalizeMenuItem) : [];

export const toMenuPayload = (item = {}, businessId) => ({
  business_id: businessId ?? item.businessId ?? item.business_id,
  item_name: item.name ?? item.item_name ?? "",
  description: item.description ?? "",
  price: Number.parseFloat(item.price) || 0,
  category: item.category ?? "",
  image_url: item.image ?? item.image_url ?? "",
  is_available: item.available ?? item.is_available ?? true,
});
