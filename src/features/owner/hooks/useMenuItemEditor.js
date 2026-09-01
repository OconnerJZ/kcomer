import { useCallback, useState } from "react";
import useImagePreview from "@Shared/hooks/useImagePreview";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";
import {
  canSaveMenuForm,
  createEmptyMenuForm,
  toMenuEditorForm,
} from "@Features/owner/model/ownerMenu";

export const useMenuItemEditor = ({ createItem, updateItem, onSaved }) => {
  const feedback = useFeedback();
  const image = useImagePreview();
  const [dialog, setDialog] = useState({ open: false, item: null });
  const [form, setForm] = useState(createEmptyMenuForm);

  const openEditor = useCallback((item = null) => {
    const nextForm = toMenuEditorForm(item);
    setForm(nextForm);
    image.resetImage(nextForm.image);
    setDialog({ open: true, item });
  }, [image]);

  const closeEditor = useCallback(() => {
    setDialog({ open: false, item: null });
    setForm(createEmptyMenuForm());
    image.resetImage();
  }, [image]);

  const changeField = useCallback((field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
  }, []);

  const selectImage = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await image.selectImage(file);
    } catch (error) {
      feedback.error(error?.message || "No se pudo cargar la imagen");
    }
  }, [feedback, image]);

  const saveItem = useCallback(async () => {
    if (!canSaveMenuForm(form)) {
      feedback.warning("Nombre y precio son requeridos");
      return { success: false, error: "Nombre y precio son requeridos" };
    }

    try {
      const result = dialog.item
        ? await updateItem(dialog.item.id, form, image.file)
        : await createItem(form, image.file);

      if (!result.success) {
        feedback.error(result.error);
        return result;
      }

      feedback.success(dialog.item ? "Platillo actualizado" : "Platillo agregado");
      closeEditor();
      onSaved?.();
      return result;
    } catch (error) {
      const message = error?.message || "Error al guardar";
      feedback.error(message);
      return { success: false, error: message };
    }
  }, [closeEditor, createItem, dialog.item, feedback, form, image.file, onSaved, updateItem]);

  return {
    dialog,
    form,
    imagePreview: image.preview,
    openEditor,
    closeEditor,
    changeField,
    selectImage,
    saveItem,
  };
};

export default useMenuItemEditor;
