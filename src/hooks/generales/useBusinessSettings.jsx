// src/hooks/useBusinessSettings.jsx
// Hook para gestión de configuraciones del negocio

import { useState, useCallback, useMemo, useEffect } from "react";
import { 
  useUpdateBusinessMutation,
} from "@Api/business.api";
import {
  useGetFoodTypesQuery,
  useGetCategoriesQuery,
  useGetPaymentMethodsQuery,
} from "@Api/catalogs.api";
import {
  useUploadImageMutation,
  uploadHelpers,
} from "@Api/upload.api";

/**
 * Hook para gestión completa de configuraciones del negocio
 * Maneja: Info básica, ubicación, horarios, delivery, pagos, tipos de comida, galería
 * 
 * @param {Object} businessData - Datos actuales del negocio
 * @returns {Object} - Estado y métodos para gestión de configuraciones
 */
export const useBusinessSettings = (businessData) => {
  const [error, setError] = useState(null);

  // ============================================================================
  // RTK QUERY - MUTATIONS
  // ============================================================================

  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  // ============================================================================
  // RTK QUERY - CATALOGS
  // ============================================================================

  const { 
    data: foodTypesResponse,
    isLoading: loadingFoodTypes,
  } = useGetFoodTypesQuery();

  const { 
    data: categoriesResponse,
    isLoading: loadingCategories,
  } = useGetCategoriesQuery();

  const { 
    data: paymentMethodsResponse,
    isLoading: loadingPaymentMethods,
  } = useGetPaymentMethodsQuery();

  // ============================================================================
  // LOCAL STATE
  // ============================================================================

  const [basicInfo, setBasicInfo] = useState({
    business_name: "",
    phone: "",
    email: "",
    description: "",
    is_open: true,
    prep_time_min: 30,
    estimated_delivery_min: 45,
    logo_url: "",
  });

  const [locationInfo, setLocationInfo] = useState({
    address: "",
    city: "",
    postal_code: "",
    latitude: "",
    longitude: "",
  });

  const [schedules, setSchedules] = useState([]);

  const [deliverySettings, setDeliverySettings] = useState({
    delivery_radius_km: 5,
    delivery_fee: 0,
    min_order_amount: 0,
    estimated_time_min: 30,
    use_own_delivery: false,
  });

  const [paymentMethods, setPaymentMethods] = useState([
    { method: "cash", is_active: true, label: "Efectivo" },
    { method: "card", is_active: false, label: "Tarjeta" },
    { method: "wallet", is_active: false, label: "Billetera Digital" },
    { method: "transfer", is_active: false, label: "Transferencia" },
  ]);

  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [photos, setPhotos] = useState([]);

  // ============================================================================
  // INITIALIZE FROM BUSINESS DATA
  // ============================================================================

  useEffect(() => {
    if (businessData) {
      // Basic Info
      setBasicInfo({
        business_name: businessData.title || businessData.businessName || "",
        phone: businessData.phone || "",
        email: businessData.email || "",
        description: businessData.description || "",
        is_open: businessData.isOpen ?? businessData.is_open ?? true,
        prep_time_min: businessData.prepTimeMin || businessData.prep_time_min || 30,
        estimated_delivery_min: businessData.estimatedDeliveryMin || businessData.estimated_delivery_min || 45,
        logo_url: businessData.logo || businessData.logoUrl || businessData.logo_url || "",
      });

      // Location
      if (businessData.location || businessData.locations?.[0]) {
        const loc = businessData.location || businessData.locations[0];
        setLocationInfo({
          address: loc.address || "",
          city: loc.city || "",
          postal_code: loc.postalCode || loc.postal_code || "",
          latitude: loc.latitude || "",
          longitude: loc.longitude || "",
        });
      }

      // Schedules
      if (businessData.schedules) {
        setSchedules(businessData.schedules);
      }

      // Delivery
      if (businessData.deliverySettings || businessData.delivery_settings) {
        const delivery = businessData.deliverySettings || businessData.delivery_settings;
        setDeliverySettings({
          delivery_radius_km: parseFloat(delivery.deliveryRadiusKm || delivery.delivery_radius_km) || 5,
          delivery_fee: parseFloat(delivery.deliveryFee || delivery.delivery_fee) || 0,
          min_order_amount: parseFloat(delivery.minOrderAmount || delivery.min_order_amount) || 0,
          estimated_time_min: delivery.estimatedTimeMin || delivery.estimated_time_min || 30,
          use_own_delivery: delivery.useOwnDelivery || delivery.use_own_delivery || false,
        });
      }

      // Payment Methods
      if (businessData.paymentMethods || businessData.payment_methods) {
        const methods = businessData.paymentMethods || businessData.payment_methods;
        setPaymentMethods(prev => 
          prev.map(pm => ({
            ...pm,
            is_active: methods.find(m => m.method === pm.method)?.isActive || 
                       methods.find(m => m.method === pm.method)?.is_active || 
                       false,
          }))
        );
      }

      // Food Types
      if (businessData.foodTypes || businessData.food_types) {
        const types = businessData.foodTypes || businessData.food_types;
        setSelectedFoodTypes(types.map(ft => ft.id));
      }

      // Photos
      if (businessData.photos) {
        setPhotos(businessData.photos);
      }
    }
  }, [businessData]);

  // ============================================================================
  // COMPUTED DATA
  // ============================================================================

  const availableFoodTypes = useMemo(() => {
    return foodTypesResponse?.data || foodTypesResponse || [];
  }, [foodTypesResponse]);

  const availableCategories = useMemo(() => {
    return categoriesResponse?.data || categoriesResponse || [];
  }, [categoriesResponse]);

  const availablePaymentMethods = useMemo(() => {
    return paymentMethodsResponse?.data || paymentMethodsResponse || [];
  }, [paymentMethodsResponse]);

  // ============================================================================
  // UPDATE OPERATIONS
  // ============================================================================

  const updateBasicInfo = useCallback(async (logoFile = null) => {
    setError(null);

    try {
      let logoUrl = basicInfo.logo_url;

      // Upload logo if provided
      if (logoFile) {
        const uploadResult = await uploadHelpers.uploadImage(logoFile, uploadImage);
        if (uploadResult.data?.success) {
          logoUrl = uploadResult.data.data.url;
        }
      }

      const payload = {
        business_name: basicInfo.business_name,
        phone: basicInfo.phone,
        email: basicInfo.email,
        description: basicInfo.description,
        is_open: basicInfo.is_open,
        prep_time_min: parseInt(basicInfo.prep_time_min),
        estimated_delivery_min: parseInt(basicInfo.estimated_delivery_min),
        logo_url: logoUrl,
      };

      const result = await updateBusiness({
        id: businessData.id,
        body: payload,
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar información básica";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, basicInfo, updateBusiness, uploadImage]);

  const updateLocation = useCallback(async () => {
    setError(null);

    try {
      const result = await updateBusiness({
        id: businessData.id,
        body: {
          location: locationInfo,
        },
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar ubicación";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, locationInfo, updateBusiness]);

  const updateSchedules = useCallback(async () => {
    setError(null);

    try {
      const result = await updateBusiness({
        id: businessData.id,
        body: {
          schedules,
        },
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar horarios";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, schedules, updateBusiness]);

  const updateDelivery = useCallback(async () => {
    setError(null);

    try {
      const result = await updateBusiness({
        id: businessData.id,
        body: {
          delivery_settings: deliverySettings,
        },
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar configuración de delivery";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, deliverySettings, updateBusiness]);

  const updatePayments = useCallback(async () => {
    setError(null);

    try {
      const result = await updateBusiness({
        id: businessData.id,
        body: {
          payment_methods: paymentMethods,
        },
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar métodos de pago";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, paymentMethods, updateBusiness]);

  const updateFoodTypes = useCallback(async () => {
    setError(null);

    try {
      const result = await updateBusiness({
        id: businessData.id,
        body: {
          food_type_ids: selectedFoodTypes,
        },
      }).unwrap();

      return { success: true, data: result };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al actualizar tipos de comida";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, selectedFoodTypes, updateBusiness]);

  const uploadPhoto = useCallback(async (photoFile) => {
    setError(null);

    try {
      const uploadResult = await uploadHelpers.uploadImage(photoFile, uploadImage);
      
      if (uploadResult.data?.success) {
        const photoUrl = uploadResult.data.data.url;

        // Add photo to business
        const result = await updateBusiness({
          id: businessData.id,
          body: {
            add_photo: photoUrl,
          },
        }).unwrap();

        // Update local state
        setPhotos(prev => [...prev, { url: photoUrl, id: Date.now() }]);

        return { success: true, data: photoUrl };
      }

      throw new Error("Error al subir foto");
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al subir foto";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, uploadImage, updateBusiness]);

  const deletePhoto = useCallback(async (photoId) => {
    setError(null);

    try {
      const result = await updateBusiness({
        id: businessData.id,
        body: {
          remove_photo: photoId,
        },
      }).unwrap();

      // Update local state
      setPhotos(prev => prev.filter(p => p.id !== photoId));

      return { success: true };
    } catch (err) {
      const errorMessage = err?.data?.message || err?.message || "Error al eliminar foto";
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, [businessData?.id, updateBusiness]);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    basicInfo,
    locationInfo,
    schedules,
    deliverySettings,
    paymentMethods,
    selectedFoodTypes,
    photos,
    
    // Setters
    setBasicInfo,
    setLocationInfo,
    setSchedules,
    setDeliverySettings,
    setPaymentMethods,
    setSelectedFoodTypes,

    // Catalogs
    availableFoodTypes,
    availableCategories,
    availablePaymentMethods,
    loadingCatalogs: loadingFoodTypes || loadingCategories || loadingPaymentMethods,

    // Actions
    updateBasicInfo,
    updateLocation,
    updateSchedules,
    updateDelivery,
    updatePayments,
    updateFoodTypes,
    uploadPhoto,
    deletePhoto,

    // Loading & Error
    loading: updating || uploading,
    error,
    clearError: () => setError(null),
  };
};

export default useBusinessSettings;