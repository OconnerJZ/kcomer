import { normalizeCartItem } from "../../cart/model/cartItem.js";

const normalizeSavedModifiers = (modifiers = []) => modifiers.map((modifier) => ({
  choiceId: Number(modifier.choiceId),
  state: modifier.state || "selected",
}));

const toModifierSummary = (modifiers = []) => modifiers.map((modifier) => ({
  group: modifier.group,
  name: modifier.name,
  state: modifier.state || "selected",
  priceExtra: Number(modifier.priceExtra || 0),
}));

export const createPendingOrderDraft = (orderItems = []) => orderItems.map((item) => ({
  ...normalizeCartItem(item),
  id: Number(item.id),
  quantity: Number(item.quantity || 1),
  note: item.note || "",
  modifiers: normalizeSavedModifiers(item.modifiers),
  modifierSummary: item.modifierSummary || toModifierSummary(item.modifiers),
  price: Number(item.price || 0),
  basePrice: Number(item.basePrice ?? item.price ?? 0),
}));

export const enrichPendingOrderDraft = (draftItems, menuItems) => {
  const menuMap = new Map(menuItems.map((item) => [Number(item.id), item]));
  return draftItems.map((item) => {
    const menuItem = menuMap.get(Number(item.id));
    return {
      ...normalizeCartItem(menuItem || item),
      id: Number(item.id),
      quantity: Number(item.quantity || 1),
      note: item.note || "",
      modifiers: item.modifiers || [],
      modifierSummary: item.modifierSummary || [],
      price: Number(item.price || menuItem?.price || 0),
      basePrice: Number(menuItem?.price || item.basePrice || item.price || 0),
      modifierGroups: menuItem?.modifierGroups || menuItem?.optionGroups || item.modifierGroups || [],
    };
  });
};

export const changePendingOrderItemQuantity = (items, itemId, delta) => items
  .map((item) => Number(item.id) === Number(itemId)
    ? { ...item, quantity: Math.max(0, Number(item.quantity || 0) + delta) }
    : item)
  .filter((item) => item.quantity > 0);

export const addPendingOrderMenuItem = (items, menuItem) => {
  const existing = items.find((item) => Number(item.id) === Number(menuItem.id));
  if (existing) {
    return items.map((item) => Number(item.id) === Number(menuItem.id)
      ? { ...item, quantity: item.quantity + 1 }
      : item);
  }

  return [...items, {
    ...normalizeCartItem(menuItem),
    quantity: 1,
    modifiers: [],
    modifierSummary: [],
    note: "",
  }];
};

export const customizePendingOrderItem = (items, itemId, configuration) => items.map(
  (item) => Number(item.id) === Number(itemId) ? { ...item, ...configuration } : item,
);

export const removePendingOrderItem = (items, itemId) => items.filter(
  (item) => Number(item.id) !== Number(itemId),
);

export const calculatePendingOrderTotal = (items) => items.reduce(
  (sum, item) => sum + Number(item.price || 0) * Number(item.quantity || 0),
  0,
);

export const getAvailablePendingOrderMenu = (menuItems, draftItems) => menuItems.filter(
  (menuItem) => !draftItems.some((item) => Number(item.id) === Number(menuItem.id)),
);

export const toPendingOrderUpdatePayload = (items) => items.map((item) => ({
  id: Number(item.id),
  quantity: Number(item.quantity),
  note: item.note || "",
  modifiers: normalizeSavedModifiers(item.modifiers),
}));
