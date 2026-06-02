// src/hooks/useBusinessOwner.jsx - OPTIMIZADO con getByOwner

import { useMemo, useCallback } from "react";
import { 
  useGetByOwnerQuery,  // ✅ Usar endpoint específico
  useGetMenuQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
} from "@Api/business.api";
import { useAuth } from "@Context/AuthContext";

/**
 * Hook para gestión de negocios del Owner
 * Proporciona acceso a los negocios del usuario y operaciones CRUD
 * 
 * @param {string} selectedBusinessId - ID del negocio seleccionado (opcional)
 * @returns {Object} - Estado y métodos para gestión de negocios
 */
export const useBusinessOwner = (selectedBusinessId = null) => {
  const { user } = useAuth();

  // ============================================================================
  // RTK QUERY - BUSINESSES BY OWNER
  // ============================================================================

  const { 
    data: businessesResponse, 
    isLoading: loadingBusinesses,
    error: businessesError,
    refetch: refetchBusinesses,
  } = useGetByOwnerQuery(
    { ownerId: user?.id },  // ✅ Filtrado en el backend
    { 
      skip: !user?.id,  // ✅ No ejecutar si no hay usuario
      pollingInterval: 60000,
      refetchOnFocus: true,
      refetchOnReconnect: true,
    }
  );

  // ============================================================================
  // RTK QUERY - MENU
  // ============================================================================

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
    }
  );

  // ============================================================================
  // MUTATIONS
  // ============================================================================

  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();
  const [deleteBusiness, { isLoading: deleting }] = useDeleteBusinessMutation();

  // ============================================================================
  // DATA PROCESSING
  // ============================================================================

  // Extraer businesses del response
  // Ya vienen filtrados por owner desde el backend
  const myBusinesses = useMemo(() => {
    if (Array.isArray(businessesResponse)) {
      return businessesResponse;
    }
    return businessesResponse?.data || businessesResponse || [];
  }, [businessesResponse]);

  // Extraer menu del response
  const menu = useMemo(() => {
    if (Array.isArray(menuResponse)) {
      return menuResponse;
    }
    return menuResponse?.data || menuResponse || [];
  }, [menuResponse]);

  // Negocio seleccionado con menú incluido
  const selectedBusiness = useMemo(() => {
    if (!selectedBusinessId) return null;
    
    const business = myBusinesses.find(b => b.id === selectedBusinessId);
    if (!business) return null;

    return {
      ...business,
      menu: menu.length > 0 ? menu : business.menu || [],
    };
  }, [myBusinesses, selectedBusinessId, menu]);

  // ============================================================================
  // BUSINESS OPERATIONS
  // ============================================================================

  const updateBusinessData = useCallback(async (businessId, data) => {
    try {
      const result = await updateBusiness({
        id: businessId,
        body: data,
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar negocio";
      return { success: false, error: errorMessage };
    }
  }, [updateBusiness]);

  const removeBusiness = useCallback(async (businessId) => {
    try {
      await deleteBusiness(businessId).unwrap();
      return { success: true };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al eliminar negocio";
      return { success: false, error: errorMessage };
    }
  }, [deleteBusiness]);

  // ============================================================================
  // SELECTORS
  // ============================================================================

  const selectors = useMemo(() => ({
    getBusinessById: (businessId) => {
      return myBusinesses.find(b => b.id === businessId) || null;
    },

    getBusinessesByStatus: (isActive) => {
      return myBusinesses.filter(b => b.isActive === isActive);
    },

    getActiveBusinesses: () => {
      return myBusinesses.filter(b => b.isActive !== false);
    },

    hasBusinesses: () => myBusinesses.length > 0,

    getTotalBusinesses: () => myBusinesses.length,
  }), [myBusinesses]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    businesses: myBusinesses,
    selectedBusiness,
    menu,
    loading: loadingBusinesses || loadingMenu || updating || deleting,
    loadingBusinesses,
    loadingMenu,
    error: businessesError?.data?.message || businessesError?.message || menuError?.data?.message || menuError?.message,

    // Actions
    refetchBusinesses,
    refetchMenu,
    updateBusinessData,
    removeBusiness,

    // Selectors
    ...selectors,
  };
};

export default useBusinessOwner;