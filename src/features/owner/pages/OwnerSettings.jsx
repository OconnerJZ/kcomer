/* eslint-disable react/prop-types */
import { useState } from "react";
import {
  Alert,
  Box,
  Button,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import {
  Business,
  Category,
  LocalShipping,
  LocationOn,
  Payment,
  PhotoLibrary,
  Public,
  Schedule,
  Groups,
  WorkspacePremium,
} from "@mui/icons-material";
import useBusinessSettings from "@Features/owner/hooks/useBusinessSettings";
import {
  BasicInfoTab,
  DeliveryTab,
  FoodTypesTab,
  PaymentMethodsTab,
  SchedulesTab,
} from "@Features/owner/components/settings/SettingsTabs";
import LocationSettingsTab from "@Features/owner/components/settings/LocationSettingsTab";
import SocialLinksTab from "@Features/owner/components/settings/SocialLinksTab";
import GalleryTab from "@Features/owner/components/settings/GalleryTab";
import TeamAccessTab from "@Features/owner/components/settings/TeamAccessTab";
import BusinessPlanTab from "@Features/plans/components/BusinessPlanTab";
import useImagePreview from "@Shared/hooks/useImagePreview";
import { validateImageFile } from "@Shared/media/images";

const NAV_ITEMS = [
  { label: "General", icon: Business, description: "Identidad y operación" },
  { label: "Ubicación", icon: LocationOn, description: "Dirección y mapa" },
  { label: "Horarios", icon: Schedule, description: "Días y apertura" },
  { label: "Delivery", icon: LocalShipping, description: "Cobertura y tiempos" },
  { label: "Pagos", icon: Payment, description: "Métodos aceptados" },
  { label: "Categorías", icon: Category, description: "Tipo de comida" },
  { label: "Redes", icon: Public, description: "Presencia digital" },
  { label: "Galería", icon: PhotoLibrary, description: "Fotos y portada" },
  { label: "Plan", icon: WorkspacePremium, description: "Nivel y capacidad" },
];

const OwnerSettings = ({ businessData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });
  const logo = useImagePreview();

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

  const showSnackbar = (message, severity = "success") => setSnackbar({ open: true, message, severity });
  const closeSnackbar = () => setSnackbar((current) => ({ ...current, open: false }));

  const handleResult = (result, successMessage, options = {}) => {
    if (!result?.success) {
      showSnackbar(result?.error || "Ocurrió un error", "error");
      return false;
    }
    showSnackbar(successMessage);
    options.afterSuccess?.();
    if (options.refresh !== false) onRefresh?.();
    return true;
  };

  const handleLogoChange = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      await logo.selectImage(file);
    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  const handleSaveBasicInfo = async () => {
    const result = await updateBasicInfo(logo.file);
    handleResult(result, "Información actualizada", {
      afterSuccess: () => logo.resetImage(basicInfo.logo || ""),
    });
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
    } catch (err) {
      showSnackbar(err.message, "error");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    handleResult(await deletePhoto(photoId), "Foto eliminada", { refresh: false });
  };

  const handleSetCover = async (photoUrl) => {
    handleResult(await updateCoverImage(photoUrl), "Portada actualizada", { refresh: false });
  };

  const togglePaymentMethod = (method) => {
    setPaymentMethods((current) => current.map((paymentMethod) =>
      paymentMethod.method === method
        ? { ...paymentMethod, active: !paymentMethod.active }
        : paymentMethod));
  };

  const updatePaymentConfig = (method, field, value) => {
    setPaymentMethods((current) => current.map((paymentMethod) =>
      paymentMethod.method === method
        ? { ...paymentMethod, config: { ...(paymentMethod.config || {}), [field]: value } }
        : paymentMethod));
  };

  const toggleFoodType = (typeId) => {
    setSelectedFoodTypes((current) => current.some((id) => String(id) === String(typeId))
      ? current.filter((id) => String(id) !== String(typeId))
      : [...current, typeId]);
  };

  const canManageTeam = businessData?.membershipRole === "primary_owner" || businessData?.permissions?.includes("team.manage");
  const navItems = canManageTeam
    ? [...NAV_ITEMS, { label: "Equipo", icon: Groups, description: "Roles y acceso" }]
    : NAV_ITEMS;

  const tabs = [
    <BasicInfoTab key="basic" basicInfo={basicInfo} setBasicInfo={setBasicInfo} logoFile={logo.file} logoPreview={logo.preview} onLogoChange={handleLogoChange} onSave={handleSaveBasicInfo} loading={loading} />,
    <LocationSettingsTab key="location" locationInfo={locationInfo} setLocationInfo={setLocationInfo} onSave={handleSaveLocation} loading={loading} />,
    <SchedulesTab key="schedules" schedules={schedules} setSchedules={setSchedules} onSave={handleSaveSchedules} loading={loading} />,
    <DeliveryTab key="delivery" deliverySettings={deliverySettings} setDeliverySettings={setDeliverySettings} onSave={handleSaveDelivery} loading={loading} />,
    <PaymentMethodsTab key="payments" paymentMethods={paymentMethods} onToggle={togglePaymentMethod} onConfigChange={updatePaymentConfig} onSave={handleSavePayments} loading={loading} />,
    <FoodTypesTab key="food-types" availableFoodTypes={availableFoodTypes} selectedFoodTypes={selectedFoodTypes} loadingCatalogs={loadingCatalogs} onToggle={toggleFoodType} onSave={handleSaveFoodTypes} loading={loading} />,
    <SocialLinksTab key="social" socialInfo={socialInfo} setSocialInfo={setSocialInfo} onSave={handleSaveSocial} loading={loading} />,
    <GalleryTab key="gallery" photos={photos} coverImage={coverImage} onSetCover={handleSetCover} onUpload={handlePhotoUpload} onDelete={handleDeletePhoto} loading={loading} />,
    <BusinessPlanTab key="plan" businessId={businessData?.id} />,
    ...(canManageTeam ? [<TeamAccessTab key="team" businessId={businessData?.id} />] : []),
  ];

  return (
    <Box>
      <Box sx={{ mb: { xs: 2, sm: 3 } }}>
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".14em", fontSize: ".65rem" }}>
          CONFIGURACIÓN
        </Typography>
        <Typography variant="h4" fontWeight={800} sx={{ mt: 0.2 }}>Tu negocio</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.6 }}>
          Mantén la información que ven tus clientes y la operación diaria en un solo lugar.
        </Typography>
      </Box>

      <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pb: 1, mb: { xs: 2, sm: 3 }, scrollSnapType: "x proximity", scrollbarWidth: "none", "&::-webkit-scrollbar": { display: "none" } }}>
        {navItems.map((item, index) => {
          const Icon = item.icon;
          const selected = activeTab === index;
          return (
            <Button
              key={item.label}
              onClick={() => setActiveTab(index)}
              startIcon={<Icon fontSize="small" />}
              sx={{
                flex: "0 0 auto",
                minWidth: { xs: 132, sm: 145 },
                scrollSnapAlign: "start",
                justifyContent: "flex-start",
                textTransform: "none",
                borderRadius: 2,
                px: 1.6,
                py: 1.1,
                color: selected ? "text.primary" : "text.secondary",
                bgcolor: selected ? "rgba(255,75,69,.08)" : "transparent",
                border: "1px solid",
                borderColor: selected ? "rgba(255,75,69,.22)" : "divider",
                "&:hover": { bgcolor: selected ? "rgba(255,75,69,.11)" : "action.hover" },
              }}
            >
              <Stack alignItems="flex-start" spacing={0}>
                <Typography variant="body2" fontWeight={selected ? 800 : 600}>{item.label}</Typography>
                <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.2 }}>{item.description}</Typography>
              </Stack>
            </Button>
          );
        })}
      </Box>

      {error && <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>{error}</Alert>}
      <Box>{tabs[activeTab]}</Box>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={closeSnackbar} anchorOrigin={{ vertical: "bottom", horizontal: "right" }}>
        <Alert severity={snackbar.severity} onClose={closeSnackbar} sx={{ borderRadius: 2 }}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerSettings;
