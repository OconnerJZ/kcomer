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
