import { useCallback, useState } from "react";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";

export const useMenuItemActions = ({ deleteItem, toggleItemAvailability, onDeleted }) => {
  const feedback = useFeedback();
  const [modifierDialog, setModifierDialog] = useState({ open: false, item: null });
  const [deleteDialog, setDeleteDialog] = useState({ open: false, itemId: null });

  const openModifierDialog = useCallback((item) => {
    if (item?.id) setModifierDialog({ open: true, item });
  }, []);

  const closeModifierDialog = useCallback(() => {
    setModifierDialog({ open: false, item: null });
  }, []);

  const requestDelete = useCallback((itemId) => {
    setDeleteDialog({ open: true, itemId });
  }, []);

  const closeDeleteDialog = useCallback(() => {
    setDeleteDialog({ open: false, itemId: null });
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteDialog.itemId) return;

    try {
      const result = await deleteItem(deleteDialog.itemId);
      if (result.success) {
        feedback.success("Platillo eliminado");
        onDeleted?.();
      } else {
        feedback.error(result.error);
      }
    } catch (error) {
      feedback.error(error?.message || "Error al eliminar");
    } finally {
      closeDeleteDialog();
    }
  }, [closeDeleteDialog, deleteDialog.itemId, deleteItem, feedback, onDeleted]);

  const toggleAvailability = useCallback(async (itemId) => {
    try {
      const result = await toggleItemAvailability(itemId);
      if (result.success) feedback.success("Disponibilidad actualizada");
      else feedback.error(result.error);
      return result;
    } catch (error) {
      const message = error?.message || "Error al actualizar";
      feedback.error(message);
      return { success: false, error: message };
    }
  }, [feedback, toggleItemAvailability]);

  return {
    modifierDialog,
    deleteDialog,
    openModifierDialog,
    closeModifierDialog,
    requestDelete,
    closeDeleteDialog,
    confirmDelete,
    toggleAvailability,
  };
};

export default useMenuItemActions;
