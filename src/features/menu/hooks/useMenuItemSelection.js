import { useCallback, useMemo, useState } from "react";
import { normalizeCartItem } from "@Features/cart/model/cartItem";
import {
  createCustomizationItem,
  createMenuItemCartPayload,
  createMenuItemConfiguration,
  getIncludedIngredients,
  getMenuItemDisplayPrice,
  getMenuItemModifierSummary,
} from "../model/menuItemSelection";

export const useMenuItemSelection = ({
  item,
  businessId,
  businessName,
  paymentMethods,
  onAddToCart,
  initialQuantity,
  initialConfiguration,
}) => {
  const menuItem = useMemo(() => normalizeCartItem(item), [item]);
  const [quantity, setQuantity] = useState(initialQuantity);
  const [customizerOpen, setCustomizerOpen] = useState(false);
  const [configuration, setConfiguration] = useState(() => (
    createMenuItemConfiguration(menuItem, initialConfiguration)
  ));

  const configurable = menuItem.modifierGroups.length > 0;
  const includedIngredients = useMemo(() => getIncludedIngredients(menuItem), [menuItem]);
  const modifierSummary = useMemo(
    () => getMenuItemModifierSummary(configuration),
    [configuration],
  );

  const updateCart = useCallback((nextQuantity, nextConfiguration) => onAddToCart(
    createMenuItemCartPayload({
      menuItem,
      businessId,
      businessName,
      paymentMethods,
      quantity: nextQuantity,
      configuration: nextConfiguration,
    }),
  ), [businessId, businessName, menuItem, onAddToCart, paymentMethods]);

  const commitQuantity = useCallback(async (nextQuantity, nextConfiguration = configuration) => {
    const previousQuantity = quantity;
    setQuantity(nextQuantity);
    try {
      await updateCart(nextQuantity, nextConfiguration);
      return true;
    } catch {
      setQuantity(previousQuantity);
      return false;
    }
  }, [configuration, quantity, updateCart]);

  const increment = useCallback(async () => {
    if (quantity === 0 && configurable) {
      setCustomizerOpen(true);
      return;
    }
    await commitQuantity(quantity + 1);
  }, [commitQuantity, configurable, quantity]);

  const decrement = useCallback(async () => {
    if (quantity <= 0) return;
    await commitQuantity(quantity - 1);
  }, [commitQuantity, quantity]);

  const confirmConfiguration = useCallback(async (nextConfiguration) => {
    setConfiguration(nextConfiguration);
    const nextQuantity = quantity > 0 ? quantity : 1;
    if (await commitQuantity(nextQuantity, nextConfiguration)) setCustomizerOpen(false);
  }, [commitQuantity, quantity]);

  const openCustomizer = useCallback(() => setCustomizerOpen(true), []);
  const closeCustomizer = useCallback(() => setCustomizerOpen(false), []);

  return {
    menuItem,
    quantity,
    configuration,
    configurable,
    includedIngredients,
    removed: modifierSummary.removed,
    selectedExtras: modifierSummary.selectedExtras,
    displayPrice: getMenuItemDisplayPrice({ menuItem, configuration, quantity }),
    customizationItem: createCustomizationItem(menuItem, configuration),
    customizerOpen,
    increment,
    decrement,
    confirmConfiguration,
    openCustomizer,
    closeCustomizer,
  };
};

export default useMenuItemSelection;
