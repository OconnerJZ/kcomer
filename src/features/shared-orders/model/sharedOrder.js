export const flattenCartForSharedOrder = (cart = {}) =>
  Object.entries(cart).flatMap(([businessId, business]) =>
    Object.values(business?.items || {}).map((item) => ({
      businessId: Number(businessId),
      menuId: Number(item.id),
      quantity: Number(item.quantity),
      note: item.note || "",
      modifiers: (item.modifiers || []).map(({ choiceId, state }) => ({ choiceId: Number(choiceId), ...(state ? { state } : {}) })),
    })),
  );

export const createCheckoutDraft = (businesses = [], user = {}) =>
  Object.fromEntries(businesses.map((business) => {
    const activeMethods = (business.paymentMethods || []).filter((entry) => entry.active).map((entry) => entry.method);
    return [business.id, { businessId: business.id, orderType: "pickup", paymentMethod: activeMethods[0] || "cash", customerName: user.name || "", customerPhone: user.phone || "", deliveryAddress: "Recoger en tienda" }];
  }));

export const sharedOrderError = (error, fallback = "No se pudo actualizar la orden compartida") => {
  const message = error?.data?.message || error?.data?.error || error?.data?.errors?.[0]?.msg;
  return typeof message === "string" && message.trim() ? message : fallback;
};

export const findOwnSharedOrderItem = (session, businessId, menuId) => (
  (session?.items || []).find((entry) => (
    entry.mine
    && Number(entry.menuId) === Number(menuId)
    && Number(entry.businessId) === Number(businessId)
  )) || null
);

export const createSharedOrderItemOperation = ({ session, businessId, payload }) => {
  const menuId = Number(payload.itemId);
  const quantity = Number(payload.item.quantity || 0);
  const currentItem = findOwnSharedOrderItem(session, businessId, menuId);
  const common = {
    id: session.id,
    expectedVersion: session.version,
  };

  if (currentItem && quantity <= 0) {
    return {
      type: "delete",
      menuId,
      quantity,
      args: { ...common, itemId: currentItem.id },
    };
  }

  const itemData = {
    quantity,
    note: payload.item.note || "",
    modifiers: payload.item.modifiers || [],
  };
  if (currentItem) {
    return {
      type: "update",
      menuId,
      quantity,
      args: { ...common, itemId: currentItem.id, ...itemData },
    };
  }

  return {
    type: "add",
    menuId,
    quantity,
    args: {
      ...common,
      businessId: Number(businessId),
      menuId,
      ...itemData,
    },
  };
};

export const toSharedOrderItemConfiguration = (sharedItem, menuItem) => sharedItem ? ({
  modifiers: sharedItem.modifiers,
  note: sharedItem.note,
  price: sharedItem.unitPrice,
  basePrice: menuItem.price,
  version: sharedItem.version,
}) : null;
