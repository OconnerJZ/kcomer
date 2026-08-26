import { useCallback, useEffect, useMemo, useState } from "react";
import { useUpdateBusinessMutation } from "@Features/business/api/business.api";
import {
  useGetCategoriesQuery,
  useGetFoodTypesQuery,
  useGetPaymentMethodsQuery,
} from "@Features/catalogs/api/catalogs.api";
import {
  uploadHelpers,
  useUploadImageMutation,
} from "@Shared/api/uploads/upload.api";

export const useBusinessSettings = (businessData) => {
  const [error, setError] = useState(null);
  const [updateBusiness, { isLoading: updating }] = useUpdateBusinessMutation();
  const [uploadImage, { isLoading: uploading }] = useUploadImageMutation();

  const { data: foodTypesResponse, isLoading: loadingFoodTypes } = useGetFoodTypesQuery();
  const { data: categoriesResponse, isLoading: loadingCategories } = useGetCategoriesQuery();
  const { data: paymentMethodsResponse, isLoading: loadingPaymentMethods } = useGetPaymentMethodsQuery();

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

  useEffect(() => {
    if (!businessData) return;

    setBasicInfo({
      business_name: businessData.title || businessData.businessName || "",
      phone: businessData.phone || "",
      email: businessData.email || "",
      description: businessData.description || "",
      is_open: businessData.isOpen ?? businessData.is_open ?? true,
      prep_time_min: businessData.prepTimeMin || businessData.prep_time_min || 30,
      estimated_delivery_min:
        businessData.estimatedDeliveryMin || businessData.estimated_delivery_min || 45,
      logo_url: businessData.logo || businessData.logoUrl || businessData.logo_url || "",
    });

    const loc = businessData.location || businessData.locations?.[0];
    if (loc) {
      setLocationInfo({
        address: loc.address || "",
        city: loc.city || "",
        postal_code: loc.postalCode || loc.postal_code || "",
        latitude: loc.latitude || "",
        longitude: loc.longitude || "",
      });
    }

    setSchedules(businessData.schedules || []);

    const delivery = businessData.deliverySettings || businessData.delivery_settings;
    if (delivery) {
      setDeliverySettings({
        delivery_radius_km: Number(delivery.deliveryRadiusKm || delivery.delivery_radius_km) || 5,
        delivery_fee: Number(delivery.deliveryFee || delivery.delivery_fee) || 0,
        min_order_amount: Number(delivery.minOrderAmount || delivery.min_order_amount) || 0,
        estimated_time_min: delivery.estimatedTimeMin || delivery.estimated_time_min || 30,
        use_own_delivery: delivery.useOwnDelivery || delivery.use_own_delivery || false,
      });
    }

    const methods = businessData.paymentMethods || businessData.payment_methods;
    if (methods) {
      setPaymentMethods((prev) =>
        prev.map((pm) => {
          const current = methods.find((m) => m.method === pm.method);
          return { ...pm, is_active: current?.isActive ?? current?.is_active ?? false };
        }),
      );
    }

    const foodTypes = businessData.foodTypes || businessData.food_types;
    if (foodTypes) setSelectedFoodTypes(foodTypes.map((item) => item.id));
    setPhotos(businessData.photos || []);
  }, [businessData]);

  const availableFoodTypes = useMemo(
    () => foodTypesResponse?.data || foodTypesResponse || [],
    [foodTypesResponse],
  );
  const availableCategories = useMemo(
    () => categoriesResponse?.data || categoriesResponse || [],
    [categoriesResponse],
  );
  const availablePaymentMethods = useMemo(
    () => paymentMethodsResponse?.data || paymentMethodsResponse || [],
    [paymentMethodsResponse],
  );

  const saveBusinessSection = useCallback(
    async (body) => {
      if (!businessData?.id) return { success: false, error: "Negocio no disponible" };
      setError(null);
      try {
        const data = await updateBusiness({ id: businessData.id, body }).unwrap();
        return { success: true, data };
      } catch (err) {
        const message = err?.data?.message || err?.message || "Error al actualizar negocio";
        setError(message);
        return { success: false, error: message };
      }
    },
    [businessData?.id, updateBusiness],
  );

  const updateBasicInfo = useCallback(
    async (logoFile = null) => {
      let logoUrl = basicInfo.logo_url;
      if (logoFile) {
        const uploadResult = await uploadHelpers.uploadImage(logoFile, uploadImage);
        const uploaded = uploadResult?.data?.data || uploadResult?.data;
        logoUrl = uploaded?.url || uploaded?.filename || logoUrl;
      }
      return saveBusinessSection({
        business_name: basicInfo.business_name,
        phone: basicInfo.phone,
        email: basicInfo.email,
        description: basicInfo.description,
        is_open: basicInfo.is_open,
        prep_time_min: Number(basicInfo.prep_time_min),
        estimated_delivery_min: Number(basicInfo.estimated_delivery_min),
        logo_url: logoUrl,
      });
    },
    [basicInfo, saveBusinessSection, uploadImage],
  );

  const updateLocation = useCallback(
    () => saveBusinessSection({ location: locationInfo }),
    [locationInfo, saveBusinessSection],
  );
  const updateSchedules = useCallback(
    () => saveBusinessSection({ schedules }),
    [schedules, saveBusinessSection],
  );
  const updateDelivery = useCallback(
    () => saveBusinessSection({ delivery_settings: deliverySettings }),
    [deliverySettings, saveBusinessSection],
  );
  const updatePayments = useCallback(
    () => saveBusinessSection({ payment_methods: paymentMethods }),
    [paymentMethods, saveBusinessSection],
  );
  const updateFoodTypes = useCallback(
    () => saveBusinessSection({ food_type_ids: selectedFoodTypes }),
    [selectedFoodTypes, saveBusinessSection],
  );

  const uploadPhoto = useCallback(
    async (photoFile) => {
      setError(null);
      try {
        const uploadResult = await uploadHelpers.uploadImage(photoFile, uploadImage);
        const uploaded = uploadResult?.data?.data || uploadResult?.data;
        const photoUrl = uploaded?.url || uploaded?.filename;
        if (!photoUrl) throw new Error("Error al subir foto");

        const result = await saveBusinessSection({ add_photo: photoUrl });
        if (result.success) {
          setPhotos((prev) => [...prev, { url: photoUrl, id: Date.now() }]);
        }
        return result.success ? { success: true, data: photoUrl } : result;
      } catch (err) {
        const message = err?.data?.message || err?.message || "Error al subir foto";
        setError(message);
        return { success: false, error: message };
      }
    },
    [saveBusinessSection, uploadImage],
  );

  const deletePhoto = useCallback(
    async (photoId) => {
      const result = await saveBusinessSection({ remove_photo: photoId });
      if (result.success) setPhotos((prev) => prev.filter((photo) => photo.id !== photoId));
      return result;
    },
    [saveBusinessSection],
  );

  return {
    basicInfo,
    locationInfo,
    schedules,
    deliverySettings,
    paymentMethods,
    selectedFoodTypes,
    photos,
    setBasicInfo,
    setLocationInfo,
    setSchedules,
    setDeliverySettings,
    setPaymentMethods,
    setSelectedFoodTypes,
    availableFoodTypes,
    availableCategories,
    availablePaymentMethods,
    loadingCatalogs: loadingFoodTypes || loadingCategories || loadingPaymentMethods,
    updateBasicInfo,
    updateLocation,
    updateSchedules,
    updateDelivery,
    updatePayments,
    updateFoodTypes,
    uploadPhoto,
    deletePhoto,
    loading: updating || uploading,
    error,
    clearError: () => setError(null),
  };
};

export default useBusinessSettings;
