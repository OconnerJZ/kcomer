export const createMenuItemConfiguration = (menuItem, initialConfiguration = null) => ({
  modifiers: initialConfiguration?.modifiers || [],
  modifierSummary: initialConfiguration?.modifierSummary || [],
  note: initialConfiguration?.note || "",
  price: Number(initialConfiguration?.price ?? menuItem.price),
  basePrice: Number(initialConfiguration?.basePrice ?? menuItem.price),
});

export const createMenuItemCartPayload = ({
  menuItem,
  businessId,
  businessName,
  paymentMethods,
  quantity,
  configuration,
}) => ({
  itemId: menuItem.id,
  businessId,
  businessName,
  paymentMethods,
  item: {
    ...menuItem,
    quantity,
    note: configuration.note || "",
    modifiers: configuration.modifiers || [],
    modifierSummary: configuration.modifierSummary || [],
    price: Number(configuration.price ?? menuItem.price),
    basePrice: Number(configuration.basePrice ?? menuItem.price),
  },
});

export const getIncludedIngredients = (menuItem) => menuItem.modifierGroups
  .flatMap((group) => group.choices || [])
  .filter((choice) => choice.defaultSelected && Number(choice.priceExtra || 0) === 0);

export const getMenuItemModifierSummary = (configuration) => ({
  removed: configuration.modifierSummary.filter((modifier) => modifier.state === "removed"),
  selectedExtras: configuration.modifierSummary.filter(
    (modifier) => modifier.state === "selected" && Number(modifier.priceExtra || 0) > 0,
  ),
});

export const getMenuItemDisplayPrice = ({ menuItem, configuration, quantity }) => (
  Number(quantity > 0 ? configuration.price : menuItem.price)
);

export const createCustomizationItem = (menuItem, configuration) => ({
  ...menuItem,
  ...configuration,
  price: menuItem.basePrice || menuItem.price,
});
