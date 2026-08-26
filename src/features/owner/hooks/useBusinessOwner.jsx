import { useMemo, useCallback } from "react";
import {
  useGetByOwnerQuery,
  useGetMenuQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} from "@Features/business/api/business.api";
import { useAuth } from "@Features/auth/context/AuthContext";

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

  const {
    data: menuResponse,
    isLoading: loadingMenu,
    error: menuError,
    refetch: refetchMenu,
  } = useGetMenuQuery(
    { businessId: selectedBusinessId },
    {
      skip: !selectedBusinessId,
      pollingInterval: 30000,
    },
  );

  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();
  const [deleteBusiness, { isLoading: deleting }] = useDeleteBusinessMutation();

  const myBusinesses = useMemo(() => {
    if (Array.isArray(businessesResponse)) return businessesResponse;
    return businessesResponse?.data || businessesResponse || [];
  }, [businessesResponse]);

  const menu = useMemo(() => {
    if (Array.isArray(menuResponse)) return menuResponse;
    return menuResponse?.data || menuResponse || [];
  }, [menuResponse]);

  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null;
    const business = myBusinesses.find((item) => item.id === selectedBusinessId);
    if (!business) return null;
    return {
      ...business,
      menu: menu.length > 0 ? menu : business.menu || [],
    };
  }, [myBusinesses, selectedBusinessId, menu]);

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
        myBusinesses.find((item) => item.id === businessId) || null,
      getBusinessesByStatus: (isActive) =>
        myBusinesses.filter((item) => item.isActive === isActive),
      getActiveBusinesses: () =>
        myBusinesses.filter((item) => item.isActive !== false),
      hasBusinesses: () => myBusinesses.length > 0,
      getTotalBusinesses: () => myBusinesses.length,
    }),
    [myBusinesses],
  );

  return {
    businesses: myBusinesses,
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
