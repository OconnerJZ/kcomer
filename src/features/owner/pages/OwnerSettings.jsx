import { useState } from "react";
import {
  Alert,
  Box,
  Paper,
  Snackbar,
  Tab,
  Tabs,
} from "@mui/material";
import {
  Business,
  Category,
  LocalShipping,
  LocationOn,
  Payment,
  PhotoLibrary,
  Schedule,
} from "@mui/icons-material";
import useBusinessSettings from "@Features/owner/hooks/useBusinessSettings";
import {
  BasicInfoTab,
  DeliveryTab,
  FoodTypesTab,
  GalleryTab,
  LocationTab,
  PaymentMethodsTab,
  SchedulesTab,
} from "@Features/owner/components/settings/SettingsTabs";

const OwnerSettings = ({ businessData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  const {
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
    loadingCatalogs,
    updateBasicInfo,
    updateLocation,
    updateSchedules,
    updateDelivery,
    updatePayments,
    updateFoodTypes,
    uploadPhoto,
    deletePhoto,
    loading,
    error,
  } = useBusinessSettings(businessData);

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const closeSnackbar = () => {
    setSnackbar((current) => ({ ...current, open: false }));
  };

  const refreshIfNeeded = () => onRefresh?.();

  const handleResult = (result, successMessage, options = {}) => {
    if (!result?.success) {
      showSnackbar(result?.error || "Ocurrió un error", "error");
      return false;
    }

    showSnackbar(successMessage);
    options.afterSuccess?.();
    if (options.refresh !== false) refreshIfNeeded();
    return true;
  };

  const handleLogoChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("La imagen debe pesar menos de 5MB", "error");
      return;
    }

    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const handleSaveBasicInfo = async () => {
    const result = await updateBasicInfo(logoFile);
    handleResult(result, "Información actualizada exitosamente", {
      afterSuccess: () => setLogoFile(null),
    });
  };

  const handleSaveLocation = async () => {
    handleResult(await updateLocation(), "Ubicación actualizada exitosamente");
  };

  const handleSaveSchedules = async () => {
    handleResult(await updateSchedules(), "Horarios actualizados exitosamente");
  };

  const handleSaveDelivery = async () => {
    handleResult(await updateDelivery(), "Configuración de delivery actualizada");
  };

  const handleSavePayments = async () => {
    handleResult(await updatePayments(), "Métodos de pago actualizados");
  };

  const handleSaveFoodTypes = async () => {
    handleResult(await updateFoodTypes(), "Tipos de comida actualizados");
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("La imagen debe pesar menos de 5MB", "error");
      return;
    }

    handleResult(await uploadPhoto(file), "Foto subida exitosamente", { refresh: false });
  };

  const handleDeletePhoto = async (photoId) => {
    handleResult(await deletePhoto(photoId), "Foto eliminada", { refresh: false });
  };

  const togglePaymentMethod = (method) => {
    setPaymentMethods((current) =>
      current.map((paymentMethod) =>
        paymentMethod.method === method
          ? { ...paymentMethod, is_active: !paymentMethod.is_active }
          : paymentMethod,
      ),
    );
  };

  const toggleFoodType = (typeId) => {
    setSelectedFoodTypes((current) =>
      current.includes(typeId)
        ? current.filter((id) => id !== typeId)
        : [...current, typeId],
    );
  };

  const tabs = [
    <BasicInfoTab
      key="basic"
      basicInfo={basicInfo}
      setBasicInfo={setBasicInfo}
      logoFile={logoFile}
      logoPreview={logoPreview}
      onLogoChange={handleLogoChange}
      onSave={handleSaveBasicInfo}
      loading={loading}
    />,
    <LocationTab
      key="location"
      locationInfo={locationInfo}
      setLocationInfo={setLocationInfo}
      onSave={handleSaveLocation}
      loading={loading}
    />,
    <SchedulesTab
      key="schedules"
      schedules={schedules}
      setSchedules={setSchedules}
      onSave={handleSaveSchedules}
      loading={loading}
    />,
    <DeliveryTab
      key="delivery"
      deliverySettings={deliverySettings}
      setDeliverySettings={setDeliverySettings}
      onSave={handleSaveDelivery}
      loading={loading}
    />,
    <PaymentMethodsTab
      key="payments"
      paymentMethods={paymentMethods}
      onToggle={togglePaymentMethod}
      onSave={handleSavePayments}
      loading={loading}
    />,
    <FoodTypesTab
      key="food-types"
      availableFoodTypes={availableFoodTypes}
      selectedFoodTypes={selectedFoodTypes}
      loadingCatalogs={loadingCatalogs}
      onToggle={toggleFoodType}
      onSave={handleSaveFoodTypes}
      loading={loading}
    />,
    <GalleryTab
      key="gallery"
      photos={photos}
      onUpload={handlePhotoUpload}
      onDelete={handleDeletePhoto}
      loading={loading}
    />,
  ];

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(_, newValue) => setActiveTab(newValue)}
          variant="scrollable"
          scrollButtons="auto"
        >
          <Tab icon={<Business />} label="Básico" />
          <Tab icon={<LocationOn />} label="Ubicación" />
          <Tab icon={<Schedule />} label="Horarios" />
          <Tab icon={<LocalShipping />} label="Delivery" />
          <Tab icon={<Payment />} label="Pagos" />
          <Tab icon={<Category />} label="Categorías" />
          <Tab icon={<PhotoLibrary />} label="Galería" />
        </Tabs>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Box sx={{ mt: 3 }}>{tabs[activeTab]}</Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={closeSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity={snackbar.severity} onClose={closeSnackbar}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerSettings;
