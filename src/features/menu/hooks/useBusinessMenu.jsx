import { useState, useCallback, useMemo } from "react";
import {
  useGetManagedMenuByBusinessQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
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

const unwrapData = (response) => response?.data ?? response;

export const useBusinessMenu = (businessId) => {
  const [error, setError] = useState(null);
  const {
    data: menuResponse,
    isLoading: loading,
    error: queryError,
    refetch: refreshMenu,
  } = useGetManagedMenuByBusinessQuery(
    { businessId },
    { skip: !businessId },
  );

  const [createMenuItem, { isLoading: creating }] = useCreateMenuMutation();
  const [updateMenuItem, { isLoading: updating }] = useUpdateMenuMutation();
  const [deleteMenuItem, { isLoading: deleting }] = useDeleteMenuMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const menu = useMemo(
    () => normalizeMenuItems(menuResponse?.data || menuResponse || []),
    [menuResponse],
  );

  const resolveImageUrl = useCallback(
    async (itemData, imageFile) => {
      if (!imageFile) return itemData.image || "";

      const uploadResult = await uploadHelpers.uploadImage(imageFile, uploadImage);
      const uploaded = uploadResult?.data?.data || uploadResult?.data;
      return uploaded?.url || uploaded?.filename || itemData.image || "";
    },
    [uploadImage],
  );

  const createItem = useCallback(
    async (itemData, imageFile = null) => {
      setError(null);
      try {
        const image = await resolveImageUrl(itemData, imageFile);
        const payload = toMenuPayload({ ...itemData, image }, businessId);
        const response = await createMenuItem(payload).unwrap();
        return { success: true, data: normalizeMenuItem(unwrapData(response)) };
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
        const response = await updateMenuItem({ id: itemId, body: payload }).unwrap();
        return { success: true, data: normalizeMenuItem(unwrapData(response)) };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al actualizar item";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [businessId, resolveImageUrl, updateMenuItem],
  );

  const deleteItem = useCallback(
    async (itemId) => {
      setError(null);
      try {
        await deleteMenuItem(itemId).unwrap();
        return { success: true };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al eliminar item";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [deleteMenuItem],
  );

  const toggleItemAvailability = useCallback(
    async (itemId) => {
      setError(null);
      const item = menu.find((current) => String(current.id) === String(itemId));
      if (!item) return { success: false, error: "Platillo no encontrado" };

      try {
        await updateMenuItem({
          id: itemId,
          body: { is_available: !item.available },
        }).unwrap();
        return { success: true };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al cambiar disponibilidad";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [menu, updateMenuItem],
  );

  const selectors = useMemo(
    () => ({
      getItemById: (itemId) => menu.find((item) => String(item.id) === String(itemId)),
      getItemsByCategory: (category) => menu.filter((item) => item.category === category),
      getAvailableItems: () => menu.filter((item) => item.available),
      getUnavailableItems: () => menu.filter((item) => !item.available),
      getCategories: () => Array.from(new Set(menu.map((item) => item.category).filter(Boolean))),
      hasItems: () => menu.length > 0,
      getTotalItems: () => menu.length,
    }),
    [menu],
  );

  return {
    menu,
    loading: loading || creating || updating || deleting || uploading,
    error: error || queryError?.data?.message || queryError?.message,
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
