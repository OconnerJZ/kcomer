import { useCallback, useEffect, useMemo, useState } from "react";
import {
  useAddBusinessPhotoMutation,
  useDeleteBusinessPhotoMutation,
  useUpdateBusinessDeliverySettingsMutation,
  useUpdateBusinessFoodTypesMutation,
  useUpdateBusinessLocationMutation,
  useUpdateBusinessMutation,
  useUpdateBusinessPaymentMethodsMutation,
  useUpdateBusinessSchedulesMutation,
} from "@Features/business/api/business.api";
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

const getMutationError = (err, fallback) =>
  err?.data?.message || err?.message || fallback;

const getPhotoUrl = (photo) =>
  typeof photo === "string"
    ? photo
    : photo?.url || photo?.photoUrl || photo?.photo_url || photo?.image || photo?.imageUrl || "";

export const useBusinessSettings = (businessData) => {
  const [error, setError] = useState(null);
  const [updateBusiness, updateBusinessState] = useUpdateBusinessMutation();
  const [updateBusinessLocation, locationState] = useUpdateBusinessLocationMutation();
  const [updateBusinessSchedules, schedulesState] = useUpdateBusinessSchedulesMutation();
  const [updateBusinessDeliverySettings, deliveryState] = useUpdateBusinessDeliverySettingsMutation();
  const [updateBusinessPaymentMethods, paymentState] = useUpdateBusinessPaymentMethodsMutation();
  const [updateBusinessFoodTypes, foodTypesState] = useUpdateBusinessFoodTypesMutation();
  const [addBusinessPhoto, addPhotoState] = useAddBusinessPhotoMutation();
  const [deleteBusinessPhoto, deletePhotoState] = useDeleteBusinessPhotoMutation();
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
  const [locationInfo, setLocationInfo] = useState({ address: "", city: "", postalCode: "", latitude: "", longitude: "" });
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
  const [coverImage, setCoverImage] = useState("");

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
    setCoverImage(business.bannerUrl || "");
  }, [businessData]);

  const availableFoodTypes = useMemo(() => foodTypesResponse?.data || foodTypesResponse || [], [foodTypesResponse]);
  const availableCategories = useMemo(() => categoriesResponse?.data || categoriesResponse || [], [categoriesResponse]);
  const availablePaymentMethods = useMemo(() => paymentMethodsResponse?.data || paymentMethodsResponse || [], [paymentMethodsResponse]);
  const businessId = businessData?.id;

  const runMutation = useCallback(async (mutation, args, fallback) => {
    if (!businessId) return { success: false, error: "Negocio no disponible" };
    setError(null);
    try {
      const data = await mutation(args).unwrap();
      return { success: true, data };
    } catch (err) {
      const message = getMutationError(err, fallback);
      setError(message);
      return { success: false, error: message };
    }
  }, [businessId]);

  const updateBasicInfo = useCallback(async (logoFile = null) => {
    let logo = basicInfo.logo;
    if (logoFile) {
      const uploadResult = await uploadHelpers.uploadImage(logoFile, uploadImage);
      const uploaded = uploadResult?.data?.data || uploadResult?.data;
      logo = uploaded?.url || uploaded?.filename || logo;
    }
    return runMutation(updateBusiness, { id: businessId, body: toBasicInfoPayload({ ...basicInfo, logo }) }, "Error al actualizar información general");
  }, [basicInfo, businessId, runMutation, updateBusiness, uploadImage]);

  const updateLocation = useCallback(() => runMutation(updateBusinessLocation, { id: businessId, body: toLocationPayload(locationInfo) }, "Error al actualizar ubicación"), [businessId, locationInfo, runMutation, updateBusinessLocation]);
  const updateSchedules = useCallback(() => runMutation(updateBusinessSchedules, { id: businessId, body: { schedules } }, "Error al actualizar horarios"), [businessId, runMutation, schedules, updateBusinessSchedules]);
  const updateDelivery = useCallback(() => runMutation(updateBusinessDeliverySettings, { id: businessId, body: toDeliveryPayload(deliverySettings) }, "Error al actualizar delivery"), [businessId, deliverySettings, runMutation, updateBusinessDeliverySettings]);
  const updatePayments = useCallback(() => runMutation(updateBusinessPaymentMethods, { id: businessId, body: { payment_methods: toPaymentMethodsPayload(paymentMethods) } }, "Error al actualizar métodos de pago"), [businessId, paymentMethods, runMutation, updateBusinessPaymentMethods]);
  const updateFoodTypes = useCallback(() => runMutation(updateBusinessFoodTypes, { id: businessId, body: { food_type_ids: selectedFoodTypes } }, "Error al actualizar categorías"), [businessId, runMutation, selectedFoodTypes, updateBusinessFoodTypes]);

  const updateCoverImage = useCallback(async (photoUrl) => {
    const result = await runMutation(
      updateBusiness,
      { id: businessId, body: { banner_url: photoUrl || "" } },
      "Error al actualizar portada",
    );
    if (result.success) setCoverImage(photoUrl || "");
    return result;
  }, [businessId, runMutation, updateBusiness]);

  const uploadPhoto = useCallback(async (photoFile) => {
    setError(null);
    try {
      const uploadResult = await uploadHelpers.uploadImage(photoFile, uploadImage);
      const uploaded = uploadResult?.data?.data || uploadResult?.data;
      const photoUrl = uploaded?.url || uploaded?.filename;
      if (!photoUrl) throw new Error("Error al subir foto");

      const result = await runMutation(addBusinessPhoto, { id: businessId, body: { photo_url: photoUrl } }, "Error al guardar fotografía");
      if (result.success) {
        const saved = result.data?.data || result.data;
        setPhotos((prev) => [...prev, saved || { url: photoUrl }]);
      }
      return result;
    } catch (err) {
      const message = getMutationError(err, "Error al subir foto");
      setError(message);
      return { success: false, error: message };
    }
  }, [addBusinessPhoto, businessId, runMutation, uploadImage]);

  const deletePhoto = useCallback(async (photoId) => {
    const target = photos.find((photo) => String(photo?.id ?? photo?.photoId) === String(photoId));
    const targetUrl = getPhotoUrl(target);
    if (targetUrl && coverImage && String(targetUrl) === String(coverImage)) {
      const clearCover = await updateCoverImage("");
      if (!clearCover.success) return clearCover;
    }

    const result = await runMutation(deleteBusinessPhoto, { id: businessId, photoId }, "Error al eliminar fotografía");
    if (result.success) {
      setPhotos((prev) => prev.filter((photo) => String(photo?.id ?? photo?.photoId) !== String(photoId)));
    }
    return result;
  }, [businessId, coverImage, deleteBusinessPhoto, photos, runMutation, updateCoverImage]);

  const mutationLoading = [
    updateBusinessState,
    locationState,
    schedulesState,
    deliveryState,
    paymentState,
    foodTypesState,
    addPhotoState,
    deletePhotoState,
  ].some((state) => state.isLoading);

  return {
    basicInfo,
    locationInfo,
    schedules,
    deliverySettings,
    paymentMethods,
    selectedFoodTypes,
    photos,
    coverImage,
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
    updateCoverImage,
    uploadPhoto,
    deletePhoto,
    loading: mutationLoading || uploading,
    error,
    clearError: () => setError(null),
  };
};

export default useBusinessSettings;
