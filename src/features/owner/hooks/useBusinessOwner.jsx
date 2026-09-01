import { useMemo, useCallback } from "react";
import {
  useGetByOwnerQuery,
  useGetMenuQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} from "@Features/business/api/business.api";
import { useAuth } from "@Features/auth/context/AuthContext";
import { normalizeBusiness } from "@Features/business/model/business";
import { normalizeMenuItems } from "@Features/menu/model/menuItem";

export const useBusinessOwner = (selectedBusinessId = null) => {
  const { user } = useAuth();

  const {
    data: businessesResponse,
    isLoading: loadingBusinesses,
    error: businessesError,
    refetch: refetchBusinesses,
  } = useGetByOwnerQuery(
    { ownerId: user?.id },
    {
      skip: !user?.id,
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    },
  );

  const myBusinesses = useMemo(() => {
    const raw = Array.isArray(businessesResponse)
      ? businessesResponse
      : businessesResponse?.data || businessesResponse || [];
    return Array.isArray(raw) ? raw.map(normalizeBusiness) : [];
  }, [businessesResponse]);

  const resolvedBusinessId = useMemo(() => {
    const selectedExists = myBusinesses.some(
      (business) => String(business.id) === String(selectedBusinessId),
    );
    return selectedExists ? selectedBusinessId : myBusinesses[0]?.id ?? null;
  }, [myBusinesses, selectedBusinessId]);

  const {
    data: menuResponse,
    isLoading: loadingMenu,
    error: menuError,
    refetch: refetchMenu,
  } = useGetMenuQuery(
    { businessId: resolvedBusinessId },
    {
      skip: !resolvedBusinessId,
      pollingInterval: 30000,
    },
  );

  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();
  const [deleteBusiness, { isLoading: deleting }] = useDeleteBusinessMutation();

  const menu = useMemo(() => {
    const raw = Array.isArray(menuResponse)
      ? menuResponse
      : menuResponse?.data || menuResponse || [];
    return normalizeMenuItems(Array.isArray(raw) ? raw : []);
  }, [menuResponse]);

  const selectedBusiness = useMemo(() => {
    if (!resolvedBusinessId) return null;
    const business = myBusinesses.find(
      (item) => String(item.id) === String(resolvedBusinessId),
    );
    if (!business) return null;
    return {
      ...business,
      menu: menu.length > 0 ? menu : business.menu || [],
    };
  }, [myBusinesses, resolvedBusinessId, menu]);

  const updateBusinessData = useCallback(
    async (businessId, data) => {
      try {
        const result = await updateBusiness({ id: businessId, body: data }).unwrap();
        return { success: true, data: result };
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.message || "Error al actualizar negocio";
        return { success: false, error: errorMessage };
      }
    },
    [updateBusiness],
  );

  const removeBusiness = useCallback(
    async (businessId) => {
      try {
        await deleteBusiness(businessId).unwrap();
        return { success: true };
      } catch (err) {
        const errorMessage =
          err?.data?.message || err?.message || "Error al eliminar negocio";
        return { success: false, error: errorMessage };
      }
    },
    [deleteBusiness],
  );

  const selectors = useMemo(
    () => ({
      getBusinessById: (businessId) =>
        myBusinesses.find((item) => String(item.id) === String(businessId)) || null,
      getBusinessesByStatus: (isActive) =>
        myBusinesses.filter((item) => item.active === isActive),
      getActiveBusinesses: () =>
        myBusinesses.filter((item) => item.active !== false),
      hasBusinesses: () => myBusinesses.length > 0,
      getTotalBusinesses: () => myBusinesses.length,
    }),
    [myBusinesses],
  );

  return {
    businesses: myBusinesses,
    selectedBusinessId: resolvedBusinessId,
    selectedBusiness,
    menu,
    loading: loadingBusinesses || loadingMenu || updating || deleting,
    loadingBusinesses,
    loadingMenu,
    error:
      businessesError?.data?.message ||
      businessesError?.message ||
      menuError?.data?.message ||
      menuError?.message,
    refetchBusinesses,
    refetchMenu,
    updateBusinessData,
    removeBusiness,
    ...selectors,
  };
};

export default useBusinessOwner;
