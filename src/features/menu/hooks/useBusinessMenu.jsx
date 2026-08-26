import { useState, useCallback, useMemo } from "react";
import {
  useGetMenuByBusinessQuery,
  useCreateMenuMutation,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useToggleAvailabilityMutation,
} from "@Features/menu/api/menu.api";
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

  const menu = useMemo(() => menuResponse?.data || menuResponse || [], [menuResponse]);

  const createItem = useCallback(
    async (itemData, imageFile = null) => {
      setError(null);
      try {
        let imageUrl = itemData.image_url || "";
        if (imageFile) {
          const uploadResult = await uploadHelpers.uploadImage(imageFile, uploadImage);
          if (uploadResult.data?.success) imageUrl = uploadResult.data.data.url;
        }

        const payload = {
          business_id: businessId,
          item_name: itemData.item_name,
          description: itemData.description || "",
          price: Number.parseFloat(itemData.price),
          category: itemData.category || "",
          image_url: imageUrl,
          is_available: itemData.is_available ?? true,
        };

        const result = await createMenuItem(payload).unwrap();
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al crear item";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [businessId, createMenuItem, uploadImage],
  );

  const updateItem = useCallback(
    async (itemId, itemData, imageFile = null) => {
      setError(null);
      try {
        let imageUrl = itemData.image_url || "";
        if (imageFile) {
          const uploadResult = await uploadHelpers.uploadImage(imageFile, uploadImage);
          if (uploadResult.data?.success) imageUrl = uploadResult.data.data.url;
        }

        const payload = {
          business_id: businessId,
          item_name: itemData.item_name,
          description: itemData.description || "",
          price: Number.parseFloat(itemData.price),
          category: itemData.category || "",
          image_url: imageUrl,
          is_available: itemData.is_available ?? true,
        };

        const result = await updateMenuItem({ id: itemId, body: payload }).unwrap();
        return { success: true, data: result };
      } catch (err) {
        const errorMessage = err?.data?.message || err?.message || "Error al actualizar item";
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    [businessId, updateMenuItem, uploadImage],
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
    getAvailableItems: () => menu.filter((item) => item.is_available || item.available),
    getUnavailableItems: () => menu.filter((item) => !(item.is_available || item.available)),
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
