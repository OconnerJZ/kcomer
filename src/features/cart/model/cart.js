import { normalizeCartItem } from "./cartItem.js";

export const calculateBusinessTotal = (items) => Object.values(items).reduce(
  (sum, item) => sum + item.price * item.quantity,
  0,
);

export const normalizeStoredCart = (storedCart = {}) => Object.fromEntries(
  Object.entries(storedCart).map(([businessId, business]) => {
    const items = Object.fromEntries(
      Object.entries(business?.items || {}).map(([itemId, item]) => [
        itemId,
        normalizeCartItem({ ...item, id: item.id ?? itemId }),
      ]),
    );

    return [
      businessId,
      {
        businessName: business?.businessName || business?.business_name || "",
        paymentMethods: Array.isArray(business?.paymentMethods)
          ? business.paymentMethods
          : [],
        items,
        total: calculateBusinessTotal(items),
      },
    ];
  }),
);

export const addCartItem = (
  cart,
  { itemId, businessId, businessName, paymentMethods = [], item },
) => {
  const completeItem = normalizeCartItem({ ...item, id: item.id ?? itemId });
  const currentBusiness = cart[businessId] || {
    businessName,
    paymentMethods,
    items: {},
    total: 0,
  };
  const items = {
    ...currentBusiness.items,
    [itemId]: completeItem,
  };

  return {
    ...cart,
    [businessId]: {
      ...currentBusiness,
      businessName: businessName || currentBusiness.businessName,
      paymentMethods: paymentMethods.length > 0
        ? paymentMethods
        : currentBusiness.paymentMethods || [],
      items,
      total: calculateBusinessTotal(items),
    },
  };
};

export const removeCartItem = (cart, businessId, itemId) => {
  const currentBusiness = cart[businessId];
  if (!currentBusiness) return cart;

  const items = Object.fromEntries(
    Object.entries(currentBusiness.items)
      .filter(([id]) => String(id) !== String(itemId)),
  );

  if (Object.keys(items).length === 0) {
    const { [businessId]: _removed, ...remainingCart } = cart;
    return remainingCart;
  }

  return {
    ...cart,
    [businessId]: {
      ...currentBusiness,
      items,
      total: calculateBusinessTotal(items),
    },
  };
};

export const clearCartBusiness = (cart, businessId) => {
  if (!cart[businessId]) return cart;
  const { [businessId]: _removed, ...remainingCart } = cart;
  return remainingCart;
};

export const calculateCartCount = (cart) => Object.values(cart).reduce(
  (total, business) => total + Object.values(business.items).reduce(
    (sum, item) => sum + item.quantity,
    0,
  ),
  0,
);

export const calculateCartGrandTotal = (cart) => Object.values(cart).reduce(
  (total, business) => total + business.total,
  0,
);
