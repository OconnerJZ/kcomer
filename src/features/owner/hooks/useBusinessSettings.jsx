import { useCallback, useEffect, useMemo, useState } from "react";
import { useUpdateBusinessMutation } from "@Features/business/api/business.api";
import {
  normalizeBusiness,
  toBasicInfoPayload,
  toDeliveryPayload,
  toLocationPayload,
  toPaymentMethodsPayload,
} from "@Features/business/model/business";
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
    name: "",
    phone: "",
    email: "",
    description: "",
    open: true,
    prepTimeMin: 30,
    estimatedDeliveryMin: 45,
    logo: "",
  });
  const [locationInfo, setLocationInfo] = useState({
    address: "",
    city: "",
    postalCode: "",
    latitude: "",
    longitude: "",
  });
  const [schedules, setSchedules] = useState([]);
  const [deliverySettings, setDeliverySettings] = useState({
    deliveryRadiusKm: 5,
    deliveryFee: 0,
    minOrderAmount: 0,
    estimatedTimeMin: 30,
    useOwnDelivery: false,
  });
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [selectedFoodTypes, setSelectedFoodTypes] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    if (!businessData) return;
    const business = normalizeBusiness(businessData);

    setBasicInfo({
      name: business.name,
      phone: business.phone,
      email: business.email,
      description: business.description,
      open: business.open,
      prepTimeMin: business.prepTimeMin,
      estimatedDeliveryMin: business.estimatedDeliveryMin,
      logo: business.logo,
    });
    setLocationInfo(business.location);
    setSchedules(business.schedules);
    setDeliverySettings(business.deliverySettings);
    setPaymentMethods(business.paymentMethods);
    setSelectedFoodTypes(business.foodTypeIds);
    setPhotos(business.photos);
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
      let logo = basicInfo.logo;
      if (logoFile) {
        const uploadResult = await uploadHelpers.uploadImage(logoFile, uploadImage);
        const uploaded = uploadResult?.data?.data || uploadResult?.data;
        logo = uploaded?.url || uploaded?.filename || logo;
      }
      return saveBusinessSection(toBasicInfoPayload({ ...basicInfo, logo }));
    },
    [basicInfo, saveBusinessSection, uploadImage],
  );

  const updateLocation = useCallback(
    () => saveBusinessSection({ location: toLocationPayload(locationInfo) }),
    [locationInfo, saveBusinessSection],
  );
  const updateSchedules = useCallback(
    () => saveBusinessSection({ schedules }),
    [schedules, saveBusinessSection],
  );
  const updateDelivery = useCallback(
    () => saveBusinessSection({ delivery_settings: toDeliveryPayload(deliverySettings) }),
    [deliverySettings, saveBusinessSection],
  );
  const updatePayments = useCallback(
    () => saveBusinessSection({ payment_methods: toPaymentMethodsPayload(paymentMethods) }),
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
