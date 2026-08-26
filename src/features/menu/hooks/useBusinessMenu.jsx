import { useState, useCallback, useMemo } from "react";
import {
  useGetMenuByBusinessQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useToggleAvailabilityMutation,
} from "@Features/menu/api/menu.api";
import {
  normalizeMenuItem,
  normalizeMenuItems,
  toMenuPayload,
} from "@Features/menu/model/menuItem";
import {
  useUploadImageMutation,
  uploadHelpers,
} from "@Shared/api/uploads/upload.api";

export const useBusinessMenu = (businessId) => {
  const [error, setError] = useState(null);
  const {
    data: menuResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshMenu,
  } = useGetMenuByBusinessQuery(
    { businessId },
    {
      skip: !businessId,
    },
  );
  const [createMenuItem, { isLoading: creating }] = useCreateMenuMutation();
  const [updateMenuItem, { isLoading: updating }] = useUpdateMenuMutation();
  const [deleteMenuItem, { isLoading: deleting }] = useDeleteMenuMutation();
  const [toggleAvailability, { isLoading: toggling }] = useToggleAvailabilityMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const menu = useMemo(
    () => normalizeMenuItems(menuResponse?.data || menuResponse || []),
    [menuResponse],
  );

  const resolveImageUrl = useCallback(
    async (itemData, imageFile) => {
      if (!imageFile) return itemData.image || "";

      const uploadResult = await uploadHelpers.uploadImage(imageFile, uploadImage);
      if (uploadResult.data?.success) return uploadResult.data.data.url;
      return itemData.image || "";
    },
    [uploadImage],
  );

  const createItem = useCallback(
    async (itemData, imageFile = null) => {
      setError(null);
      try {
        const image = await resolveImageUrl(itemData, imageFile);
        const payload = toMenuPayload({ ...itemData, image }, businessId);
        const result = await createMenuItem(payload).unwrap();
        return { success: true, data: normalizeMenuItem(result) };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al crear item";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [businessId, createMenuItem, resolveImageUrl],
  );

  const updateItem = useCallback(
    async (itemId, itemData, imageFile = null) => {
      setError(null);
      try {
        const image = await resolveImageUrl(itemData, imageFile);
        const payload = toMenuPayload({ ...itemData, image }, businessId);
        const result = await updateMenuItem({ id: itemId, body: payload }).unwrap();
        return { success: true, data: normalizeMenuItem(result) };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al actualizar item";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [businessId, resolveImageUrl, updateMenuItem],
  );

  const deleteItem = useCallback(async (itemId) => {
    setError(null);
    try {
      await deleteMenuItem(itemId).unwrap();
      return { success: true };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al eliminar item";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [deleteMenuItem]);

  const toggleItemAvailability = useCallback(async (itemId) => {
    setError(null);
    try {
      await toggleAvailability({ id: itemId, businessId, body: {} }).unwrap();
      return { success: true };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al cambiar disponibilidad";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessId, toggleAvailability]);

  const selectors = useMemo(() => ({
    getItemById: (itemId) => menu.find((item) => item.id === itemId),
    getItemsByCategory: (category) => menu.filter((item) => item.category === category),
    getAvailableItems: () => menu.filter((item) => item.available),
    getUnavailableItems: () => menu.filter((item) => !item.available),
    getCategories: () => Array.from(new Set(menu.map((item) => item.category).filter(Boolean))),
    hasItems: () => menu.length > 0,
    getTotalItems: () => menu.length,
  }), [menu]);

  return {
    menu,
    loading: loading || creating || updating || deleting || toggling || uploading,
    error: error || queryError?.message,
    createItem,
    updateItem,
    deleteItem,
    toggleItemAvailability,
    refreshMenu,
    clearError: () => setError(null),
    ...selectors,
  };
};

export default useBusinessMenu;
