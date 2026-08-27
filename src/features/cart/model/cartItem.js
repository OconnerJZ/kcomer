export const normalizeCartItem = (item = {}) => ({
  id: item.id ?? null,
  name: item.name || item.itemName || item.item_name || "",
  description: item.description || "",
  price: Number(item.price) || 0,
  basePrice: Number(item.basePrice ?? item.price) || 0,
  quantity: Number(item.quantity) || 0,
  note: item.note || "",
  image: item.image || item.imageUrl || item.image_url || "",
  modifierGroups: Array.isArray(item.modifierGroups || item.optionGroups)
    ? (item.modifierGroups || item.optionGroups)
    : [],
  modifiers: Array.isArray(item.modifiers) ? item.modifiers : [],
  modifierSummary: Array.isArray(item.modifierSummary) ? item.modifierSummary : [],
});

export const normalizeCartItems = (items = []) => items.map(normalizeCartItem);
