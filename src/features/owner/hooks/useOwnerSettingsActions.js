import { useCallback, useState } from "react";
import useImagePreview from "@Shared/hooks/useImagePreview";
import { validateImageFile } from "@Shared/media/images";
import {
  toggleFoodTypeSelection,
  togglePaymentMethod,
  updatePaymentMethodConfig,
} from "../model/ownerSettings";

export const useOwnerSettingsActions = ({ settings, onRefresh }) => {
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const {
    file: logoFile,
    preview: logoPreview,
    selectImage,
    resetImage,
  } = useImagePreview();
  const {
    basicInfo,
    setPaymentMethods,
    setSelectedFoodTypes,
    updateBasicInfo,
    updateSocial,
    updateLocation,
    updateSchedules,
    updateDelivery,
    updatePayments,
    updateFoodTypes,
    updateCoverImage,
    uploadPhoto,
    deletePhoto,
  } = settings;

  const notify = useCallback((message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  }, []);

  const closeSnackbar = useCallback(() => {
    setSnackbar((current) => ({ ...current, open: false }));
  }, []);

  const handleResult = useCallback((result, successMessage, options = {}) => {
    if (!result?.success) {
      notify(result?.error || "Ocurrió un error", "error");
      return false;
    }
    notify(successMessage);
    options.afterSuccess?.();
    if (options.refresh !== false) onRefresh?.();
    return true;
  }, [notify, onRefresh]);

  const changeLogo = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await selectImage(file);
    } catch (error) {
      notify(error.message, "error");
    }
  }, [notify, selectImage]);

  const saveBasicInfo = useCallback(async () => {
    const result = await updateBasicInfo(logoFile);
    return handleResult(result, "Información actualizada", {
      afterSuccess: () => resetImage(basicInfo.logo || ""),
    });
  }, [basicInfo.logo, handleResult, logoFile, resetImage, updateBasicInfo]);

  const saveLocation = useCallback(async () =>
    handleResult(await updateLocation(), "Ubicación actualizada"),
  [handleResult, updateLocation]);

  const saveSchedules = useCallback(async () =>
    handleResult(await updateSchedules(), "Horarios actualizados"),
  [handleResult, updateSchedules]);

  const saveDelivery = useCallback(async () =>
    handleResult(await updateDelivery(), "Configuración de delivery actualizada"),
  [handleResult, updateDelivery]);

  const savePayments = useCallback(async () =>
    handleResult(await updatePayments(), "Métodos de pago actualizados"),
  [handleResult, updatePayments]);

  const saveFoodTypes = useCallback(async () =>
    handleResult(await updateFoodTypes(), "Categorías actualizadas"),
  [handleResult, updateFoodTypes]);

  const saveSocial = useCallback(async () =>
    handleResult(await updateSocial(), "Redes sociales actualizadas"),
  [handleResult, updateSocial]);

  const uploadGalleryPhoto = useCallback(async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      validateImageFile(file);
      handleResult(await uploadPhoto(file), "Foto agregada", { refresh: false });
    } catch (error) {
      notify(error.message, "error");
    }
  }, [handleResult, notify, uploadPhoto]);

  const removeGalleryPhoto = useCallback(async (photoId) =>
    handleResult(await deletePhoto(photoId), "Foto eliminada", { refresh: false }),
  [deletePhoto, handleResult]);

  const setCoverPhoto = useCallback(async (photoUrl) =>
    handleResult(await updateCoverImage(photoUrl), "Portada actualizada", { refresh: false }),
  [handleResult, updateCoverImage]);

  const togglePayment = useCallback((method) => {
    setPaymentMethods((current) => togglePaymentMethod(current, method));
  }, [setPaymentMethods]);

  const updatePaymentConfig = useCallback((method, field, value) => {
    setPaymentMethods((current) => updatePaymentMethodConfig(current, method, field, value));
  }, [setPaymentMethods]);

  const toggleFoodType = useCallback((typeId) => {
    setSelectedFoodTypes((current) => toggleFoodTypeSelection(current, typeId));
  }, [setSelectedFoodTypes]);

  return {
    snackbar,
    closeSnackbar,
    logoFile,
    logoPreview,
    changeLogo,
    saveBasicInfo,
    saveLocation,
    saveSchedules,
    saveDelivery,
    savePayments,
    saveFoodTypes,
    saveSocial,
    uploadGalleryPhoto,
    removeGalleryPhoto,
    setCoverPhoto,
    togglePayment,
    updatePaymentConfig,
    toggleFoodType,
  };
};

export default useOwnerSettingsActions;
