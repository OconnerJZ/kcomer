import { useCallback, useMemo, useState } from "react";
import {
  addPendingOrderMenuItem,
  calculatePendingOrderTotal,
  changePendingOrderItemQuantity,
  createPendingOrderDraft,
  customizePendingOrderItem,
  enrichPendingOrderDraft,
  getAvailablePendingOrderMenu,
  removePendingOrderItem,
  toPendingOrderUpdatePayload,
} from "../model/pendingOrderEditor";

export const usePendingOrderEditor = ({ order, menu, onSave }) => {
  const [draftItems, setDraftItems] = useState(() => createPendingOrderDraft(order.items));
  const [customizingId, setCustomizingId] = useState(null);
  const items = useMemo(
    () => enrichPendingOrderDraft(draftItems, menu),
    [draftItems, menu],
  );
  const availableMenu = useMemo(
    () => getAvailablePendingOrderMenu(menu, draftItems),
    [draftItems, menu],
  );
  const customizingItem = items.find(
    (item) => Number(item.id) === Number(customizingId),
  );

  const changeQuantity = useCallback((itemId, delta) => {
    setDraftItems((current) => changePendingOrderItemQuantity(current, itemId, delta));
  }, []);

  const addMenuItem = useCallback((menuItem) => {
    setDraftItems((current) => addPendingOrderMenuItem(current, menuItem));
    if ((menuItem.modifierGroups || []).length) setCustomizingId(menuItem.id);
  }, []);

  const removeItem = useCallback((itemId) => {
    setDraftItems((current) => removePendingOrderItem(current, itemId));
  }, []);

  const editItem = useCallback((itemId) => setCustomizingId(itemId), []);
  const closeCustomizer = useCallback(() => setCustomizingId(null), []);

  const confirmCustomization = useCallback((configuration) => {
    setDraftItems((current) => customizePendingOrderItem(
      current,
      customizingId,
      configuration,
    ));
    setCustomizingId(null);
  }, [customizingId]);

  const save = useCallback(() => {
    onSave(toPendingOrderUpdatePayload(draftItems));
  }, [draftItems, onSave]);

  return {
    items,
    availableMenu,
    customizingItem,
    total: calculatePendingOrderTotal(items),
    changeQuantity,
    addMenuItem,
    removeItem,
    editItem,
    closeCustomizer,
    confirmCustomization,
    save,
  };
};

export default usePendingOrderEditor;
