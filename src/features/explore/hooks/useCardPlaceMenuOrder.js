import { useCallback, useEffect, useMemo, useState } from "react";
import useCart from "@Features/cart/context/useCart";
import {
  useAddSharedOrderItemMutation,
  useDeleteSharedOrderItemMutation,
  useGetActiveSharedOrderQuery,
  useUpdateSharedOrderItemMutation,
} from "@Features/shared-orders/api/sharedOrders.api";
import useOrderTarget from "@Features/shared-orders/hooks/useOrderTarget";
import {
  createSharedOrderItemOperation,
  findOwnSharedOrderItem,
  sharedOrderError,
} from "@Features/shared-orders/model/sharedOrder";

const INITIAL_FEEDBACK = { open: false, message: "", severity: "success" };

export const useCardPlaceMenuOrder = (businessId) => {
  const { addToCart } = useCart();
  const [orderTarget] = useOrderTarget();
  const { data: activeSharedOrder } = useGetActiveSharedOrderQuery();
  const [sessionSnapshot, setSessionSnapshot] = useState(null);
  const [busyMenuId, setBusyMenuId] = useState(null);
  const [feedback, setFeedback] = useState(INITIAL_FEEDBACK);
  const [addSharedItem] = useAddSharedOrderItemMutation();
  const [updateSharedItem] = useUpdateSharedOrderItemMutation();
  const [deleteSharedItem] = useDeleteSharedOrderItemMutation();

  useEffect(() => {
    setSessionSnapshot(activeSharedOrder || null);
  }, [activeSharedOrder]);

  const session = sessionSnapshot || activeSharedOrder || null;
  const sharedTarget = orderTarget === "shared" && activeSharedOrder?.status === "open";
  const sharedTargetName = session?.self?.name || "tu pedido del grupo";

  const ownItems = useMemo(() => {
    if (!sharedTarget) return new Map();
    return new Map((session?.items || [])
      .filter((entry) => entry.mine && Number(entry.businessId) === Number(businessId))
      .map((entry) => [Number(entry.menuId), entry]));
  }, [businessId, session, sharedTarget]);

  const getOwnSharedItem = useCallback((menuId) => (
    ownItems.get(Number(menuId))
    || findOwnSharedOrderItem(session, businessId, menuId)
  ), [businessId, ownItems, session]);

  const handleProductChange = useCallback(async (payload) => {
    if (!sharedTarget) return addToCart(payload);
    if (!session?.id) {
      const unavailableError = new Error("La orden compartida ya no está disponible");
      setFeedback({
        open: true,
        message: unavailableError.message,
        severity: "error",
      });
      throw unavailableError;
    }

    const operation = createSharedOrderItemOperation({ session, businessId, payload });
    setBusyMenuId(operation.menuId);
    try {
      let updated;
      if (operation.type === "delete") {
        updated = await deleteSharedItem(operation.args).unwrap();
      } else if (operation.type === "update") {
        updated = await updateSharedItem(operation.args).unwrap();
      } else {
        updated = await addSharedItem(operation.args).unwrap();
      }

      setSessionSnapshot(updated);
      setFeedback({
        open: true,
        message: operation.quantity > 0
          ? `Actualizamos el pedido de ${updated?.self?.name || sharedTargetName}.`
          : "Producto retirado de tu pedido compartido.",
        severity: "success",
      });
      return updated;
    } catch (requestError) {
      setFeedback({
        open: true,
        message: sharedOrderError(requestError, "No se pudo actualizar tu selección"),
        severity: "error",
      });
      throw requestError;
    } finally {
      setBusyMenuId(null);
    }
  }, [
    addSharedItem,
    addToCart,
    businessId,
    deleteSharedItem,
    session,
    sharedTarget,
    sharedTargetName,
    updateSharedItem,
  ]);

  const closeFeedback = useCallback(() => {
    setFeedback((current) => ({ ...current, open: false }));
  }, []);

  return {
    sharedTarget,
    sharedTargetName,
    busyMenuId,
    feedback,
    getOwnSharedItem,
    handleProductChange,
    closeFeedback,
  };
};

export default useCardPlaceMenuOrder;
