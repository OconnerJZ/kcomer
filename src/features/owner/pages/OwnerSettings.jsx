import { useState } from "react";
import { Alert, Box, Button, Stack, Typography } from "@mui/material";
import {
  Business,
  Category,
  LocalShipping,
  LocationOn,
  Payment,
  PhotoLibrary,
  Public,
  Schedule,
} from "@mui/icons-material";
import useBusinessSettings from "@Features/owner/hooks/useBusinessSettings";
import {
  BasicInfoTab,
  DeliveryTab,
  PaymentMethodsTab,
  SchedulesTab,
} from "@Features/owner/components/settings/SettingsTabs";
import OwnerLocationTab from "@Features/owner/components/settings/OwnerLocationTab";
import OwnerFoodTypesTab from "@Features/owner/components/settings/OwnerFoodTypesTab";
import SocialLinksTab from "@Features/owner/components/settings/SocialLinksTab";
import GalleryTab from "@Features/owner/components/settings/GalleryTab";
import useImagePreview from "@Shared/hooks/useImagePreview";
import { validateImageFile } from "@Shared/media/images";
import { useFeedback } from "@Shared/feedback/FeedbackProvider";

const NAV_ITEMS = [
  { label: "General", icon: Business, description: "Identidad y operación" },
  { label: "Ubicación", icon: LocationOn, description: "Dirección y mapa" },
  { label: "Horarios", icon: Schedule, description: "Días y apertura" },
  { label: "Delivery", icon: LocalShipping, description: "Cobertura y tiempos" },
  { label: "Pagos", icon: Payment, description: "Métodos aceptados" },
  { label: "Categorías", icon: Category, description: "Tipo de comida" },
  { label: "Redes", icon: Public, description: "Presencia digital" },
  { label: "Galería", icon: PhotoLibrary, description: "Fotos y portada" },
];

const OwnerSettings = ({ businessData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const logo = useImagePreview();
  const feedback = useFeedback();

  const {
    basicInfo,
    locationInfo,
    schedules,
    deliverySettings,
    paymentMethods,
    selectedFoodTypes,
    socialInfo,
    photos,
    coverImage,
    setBasicInfo,
    setLocationInfo,
    setSchedules,
    setDeliverySettings,
    setPaymentMethods,
    setSelectedFoodTypes,
    setSocialInfo,
    availableFoodTypes,
    loadingCatalogs,
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
    loading,
    error,
  } = useBusinessSettings(businessData);

  const handleResult = (result, successMessage, options = {}) => {
    if (!result?.success) {
      feedback.error(result?.error || "Ocurrió un error");
      return false;
    }
    feedback.success(successMessage);
    options.afterSuccess?.();
    if (options.refresh !== false) onRefresh?.();
    return true;
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try { await logo.selectImage(file); }
    catch (err) { feedback.error(err.message); }
  };

  const handleSaveBasicInfo = async () => {
    const result = await updateBasicInfo(logo.file);
    handleResult(result, "Información actualizada", { afterSuccess: () => logo.resetImage(basicInfo.logo || "") });
  };

  const handleSaveLocation = async () => handleResult(await updateLocation(), "Ubicación actualizada");
  const handleSaveSchedules = async () => handleResult(await updateSchedules(), "Horarios actualizados");
  const handleSaveDelivery = async () => handleResult(await updateDelivery(), "Configuración de delivery actualizada");
  const handleSavePayments = async () => handleResult(await updatePayments(), "Métodos de pago actualizados");
  const handleSaveFoodTypes = async () => handleResult(await updateFoodTypes(), "Categorías actualizadas");
  const handleSaveSocial = async () => handleResult(await updateSocial(), "Redes sociales actualizadas");

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      validateImageFile(file);
      handleResult(await uploadPhoto(file), "Foto agregada", { refresh: false });
    } catch (err) { feedback.error(err.message); }
  };

  const handleDeletePhoto = async (photoId) => handleResult(await deletePhoto(photoId), "Foto eliminada", { refresh: false });
  const handleSetCover = async (photoUrl) => handleResult(await updateCoverImage(photoUrl), "Portada actualizada", { refresh: false });

  const togglePaymentMethod = (method) => {
    setPaymentMethods((current) => current.map((paymentMethod) => paymentMethod.method === method ? { ...paymentMethod, active: !paymentMethod.active } : paymentMethod));
  };

  const toggleFoodType = (typeId) => {
    const normalizedId = Number(typeId);
    setSelectedFoodTypes((current) => {
      const normalized = current.map(Number);
      return normalized.includes(normalizedId) ? normalized.filter((id) => id !== normalizedId) : [...normalized, normalizedId];
    });
  };

  const tabs = [
    <BasicInfoTab key="basic" basicInfo={basicInfo} setBasicInfo={setBasicInfo} logoFile={logo.file} logoPreview={logo.preview} onLogoChange={handleLogoChange} onSave={handleSaveBasicInfo} loading={loading} />,
    <OwnerLocationTab key="location" locationInfo={locationInfo} setLocationInfo={setLocationInfo} onSave={handleSaveLocation} loading={loading} />,
    <SchedulesTab key="schedules" schedules={schedules} setSchedules={setSchedules} onSave={handleSaveSchedules} loading={loading} />,
    <DeliveryTab key="delivery" deliverySettings={deliverySettings} setDeliverySettings={setDeliverySettings} onSave={handleSaveDelivery} loading={loading} />,
    <PaymentMethodsTab key="payments" paymentMethods={paymentMethods} onToggle={togglePaymentMethod} onSave={handleSavePayments} loading={loading} />,
    <OwnerFoodTypesTab key="food-types" availableFoodTypes={availableFoodTypes} selectedFoodTypes={selectedFoodTypes} loadingCatalogs={loadingCatalogs} onToggle={toggleFoodType} onSave={handleSaveFoodTypes} loading={loading} />,
    <SocialLinksTab key="social" socialInfo={socialInfo} setSocialInfo={setSocialInfo} onSave={handleSaveSocial} loading={loading} />,
    <GalleryTab key="gallery" photos={photos} coverImage={coverImage} onSetCover={handleSetCover} onUpload={handlePhotoUpload} onDelete={handleDeletePhoto} loading={loading} />,
  ];

  return (
    <Box>
      <Box sx={{ mb: 3, p: { xs: 2, sm: 2.4 }, borderRadius: 3, background: "linear-gradient(120deg, rgba(255,75,69,.08), rgba(255,171,64,.05) 55%, rgba(255,255,255,0))" }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontSize: ".65rem" }}>CONFIGURACIÓN</Typography>
        <Typography variant="h4" fontWeight={850} sx={{ mt: .2 }}>Tu negocio</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: .6 }}>Mantén la información que ven tus clientes y la operación diaria en un solo lugar.</Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, mb: 3, scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {NAV_ITEMS.map((item, index) => {
          const Icon = item.icon;
          const selected = activeTab === index;
          return (
            <Button key={item.label} onClick={() => setActiveTab(index)} startIcon={<Icon fontSize="small" />} sx={{ flex: "0 0 auto", minWidth: 145, justifyContent: "flex-start", textTransform: "none", borderRadius: 2.3, px: 1.6, py: 1.1, color: selected ? "text.primary" : "text.secondary", bgcolor: selected ? "rgba(255,75,69,.09)" : "rgba(255,255,255,.56)", border: "1px solid", borderColor: selected ? "rgba(255,75,69,.24)" : "divider", "&:hover": { bgcolor: selected ? "rgba(255,75,69,.13)" : "action.hover" } }}>
              <Stack alignItems="flex-start" spacing={0}>
                <Typography variant="body2" fontWeight={selected ? 850 : 650}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>{item.description}</Typography>
              </Stack>
            </Button>
          );
        })}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      <Box>{tabs[activeTab]}</Box>
    </Box>
  );
};

export default OwnerSettings;
