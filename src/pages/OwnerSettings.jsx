// src/pages/dashboard/OwnerSettings.jsx - REFACTORIZADO
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  TextField,
  Button,
  Stack,
  Switch,
  FormControlLabel,
  Divider,
  Grid,
  Alert,
  Snackbar,
  CircularProgress,
  Chip,
  IconButton,
  Card,
  CardMedia,
  CardActions,
  CardContent,
  Avatar,
} from "@mui/material";
import {
  Business,
  LocationOn,
  Schedule,
  LocalShipping,
  Payment,
  Category,
  PhotoLibrary,
  Delete,
  Add,
  Edit,
} from "@mui/icons-material";

// ✅ Importar hook refactorizado
import useBusinessSettings from "@Hooks/generales/useBusinessSettings";
import ScheduleField from "@Components/forms/ScheduleField";

const OwnerSettings = ({ businessData, onRefresh }) => {
  const [activeTab, setActiveTab] = useState(0);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // ✅ Hook refactorizado con RTK Query
  const {
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
    availablePaymentMethods,
    loadingCatalogs,

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
    loading,
    error,
  } = useBusinessSettings(businessData);

  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState("");

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const showSnackbar = (message, severity = "success") => {
    setSnackbar({ open: true, message, severity });
  };

  const handleLogoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showSnackbar("La imagen debe pesar menos de 5MB", "error");
        return;
      }

      setLogoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setLogoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveBasicInfo = async () => {
    const result = await updateBasicInfo(logoFile);
    if (result.success) {
      showSnackbar("Información actualizada exitosamente");
      setLogoFile(null);
      if (onRefresh) onRefresh();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSaveLocation = async () => {
    const result = await updateLocation();
    if (result.success) {
      showSnackbar("Ubicación actualizada exitosamente");
      if (onRefresh) onRefresh();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSaveSchedules = async () => {
    const result = await updateSchedules();
    if (result.success) {
      showSnackbar("Horarios actualizados exitosamente");
      if (onRefresh) onRefresh();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSaveDelivery = async () => {
    const result = await updateDelivery();
    if (result.success) {
      showSnackbar("Configuración de delivery actualizada");
      if (onRefresh) onRefresh();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSavePayments = async () => {
    const result = await updatePayments();
    if (result.success) {
      showSnackbar("Métodos de pago actualizados");
      if (onRefresh) onRefresh();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleSaveFoodTypes = async () => {
    const result = await updateFoodTypes();
    if (result.success) {
      showSnackbar("Tipos de comida actualizados");
      if (onRefresh) onRefresh();
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      showSnackbar("La imagen debe pesar menos de 5MB", "error");
      return;
    }

    const result = await uploadPhoto(file);
    if (result.success) {
      showSnackbar("Foto subida exitosamente");
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const handleDeletePhoto = async (photoId) => {
    const result = await deletePhoto(photoId);
    if (result.success) {
      showSnackbar("Foto eliminada");
    } else {
      showSnackbar(result.error, "error");
    }
  };

  const togglePaymentMethod = (method) => {
    setPaymentMethods(prev =>
      prev.map(pm =>
        pm.method === method ? { ...pm, is_active: !pm.is_active } : pm
      )
    );
  };

  const toggleFoodType = (typeId) => {
    setSelectedFoodTypes(prev =>
      prev.includes(typeId)
        ? prev.filter(id => id !== typeId)
        : [...prev, typeId]
    );
  };

  // ============================================================================
  // TAB COMPONENTS
  // ============================================================================

  const BasicInfoTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Business color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Información General
        </Typography>
      </Stack>

      <Card sx={{ mb: 3 }} elevation={0}>
        <CardContent>
          <Box sx={{ textAlign: 'center', mb: 2 }}>
            <Avatar
              src={logoPreview || basicInfo.logo_url}
              sx={{
                width: 120,
                height: 120,
                mx: 'auto',
                mb: 2,
                border: '3px solid',
                borderColor: 'primary.light',
              }}
            >
              <Business sx={{ fontSize: 60 }} />
            </Avatar>

            <Button
              variant="outlined"
              component="label"
              fullWidth
              startIcon={<Edit />}
            >
              {logoFile ? "Cambiar Logo" : "Subir Logo"}
              <input
                type="file"
                hidden
                accept="image/*"
                onChange={handleLogoChange}
              />
            </Button>
          </Box>

          <Alert severity="info" sx={{ fontSize: '0.75rem' }}>
            Tamaño recomendado: 512x512px
            <br />
            Máximo: 5MB
          </Alert>
        </CardContent>
      </Card>

      <Stack spacing={2}>
        <TextField
          label="Nombre del negocio"
          value={basicInfo.business_name}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, business_name: e.target.value })
          }
          fullWidth
          required
        />
        
        <TextField
          label="Descripción"
          value={basicInfo.description}
          onChange={(e) =>
            setBasicInfo({ ...basicInfo, description: e.target.value })
          }
          multiline
          rows={3}
          fullWidth
        />

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Teléfono"
              value={basicInfo.phone}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, phone: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Email"
              type="email"
              value={basicInfo.email}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, email: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tiempo de preparación (minutos)"
              type="number"
              value={basicInfo.prep_time_min}
              onChange={(e) =>
                setBasicInfo({
                  ...basicInfo,
                  prep_time_min: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Tiempo estimado de entrega (minutos)"
              type="number"
              value={basicInfo.estimated_delivery_min}
              onChange={(e) =>
                setBasicInfo({
                  ...basicInfo,
                  estimated_delivery_min: parseInt(e.target.value) || 0,
                })
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <FormControlLabel
          control={
            <Switch
              color="success"
              checked={basicInfo.is_open}
              onChange={(e) =>
                setBasicInfo({ ...basicInfo, is_open: e.target.checked })
              }
            />
          }
          label={
            basicInfo.is_open 
              ? <Chip label="Negocio abierto" color="success" variant="outlined" />  
              : <Chip label="Negocio cerrado" color="error" variant="outlined" />
          }
        />

        <Button
          variant="contained"
          onClick={handleSaveBasicInfo}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar Cambios"}
        </Button>
      </Stack>
    </Paper>
  );

  const LocationTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <LocationOn color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Ubicación del Negocio
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <TextField
          label="Dirección"
          value={locationInfo.address}
          onChange={(e) =>
            setLocationInfo({ ...locationInfo, address: e.target.value })
          }
          fullWidth
          multiline
          rows={2}
        />
        
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Ciudad"
              value={locationInfo.city}
              onChange={(e) =>
                setLocationInfo({ ...locationInfo, city: e.target.value })
              }
              fullWidth
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Código Postal"
              value={locationInfo.postal_code}
              onChange={(e) =>
                setLocationInfo({ ...locationInfo, postal_code: e.target.value })
              }
              fullWidth
            />
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid item xs={12} md={6}>
            <TextField
              label="Latitud"
              type="number"
              value={locationInfo.latitude}
              onChange={(e) =>
                setLocationInfo({ ...locationInfo, latitude: e.target.value })
              }
              fullWidth
              placeholder="19.4326"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              label="Longitud"
              type="number"
              value={locationInfo.longitude}
              onChange={(e) =>
                setLocationInfo({ ...locationInfo, longitude: e.target.value })
              }
              fullWidth
              placeholder="-99.1332"
            />
          </Grid>
        </Grid>

        <Alert severity="info">
          Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en la ubicación.
        </Alert>

        <Button
          variant="contained"
          onClick={handleSaveLocation}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar Ubicación"}
        </Button>
      </Stack>
    </Paper>
  );

  const SchedulesTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Schedule color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Horarios de Atención
        </Typography>
      </Stack>

      <ScheduleField 
        schedules={schedules}
        onChange={setSchedules}
      />

      <Button
        variant="contained"
        onClick={handleSaveSchedules}
        disabled={loading}
        sx={{ mt: 3 }}
      >
        {loading ? <CircularProgress size={24} /> : "Guardar Horarios"}
      </Button>
    </Paper>
  );

  const DeliveryTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <LocalShipping color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Configuración de Delivery
        </Typography>
      </Stack>

      <Stack spacing={2}>
        <TextField
          label="Radio de entrega (km)"
          type="number"
          value={deliverySettings.delivery_radius_km}
          onChange={(e) =>
            setDeliverySettings({
              ...deliverySettings,
              delivery_radius_km: parseFloat(e.target.value) || 0,
            })
          }
          fullWidth
        />

        <TextField
          label="Costo de envío"
          type="number"
          value={deliverySettings.delivery_fee}
          onChange={(e) =>
            setDeliverySettings({
              ...deliverySettings,
              delivery_fee: parseFloat(e.target.value) || 0,
            })
          }
          fullWidth
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
          }}
        />

        <TextField
          label="Monto mínimo de orden"
          type="number"
          value={deliverySettings.min_order_amount}
          onChange={(e) =>
            setDeliverySettings({
              ...deliverySettings,
              min_order_amount: parseFloat(e.target.value) || 0,
            })
          }
          fullWidth
          InputProps={{
            startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
          }}
        />

        <TextField
          label="Tiempo estimado de entrega (minutos)"
          type="number"
          value={deliverySettings.estimated_time_min}
          onChange={(e) =>
            setDeliverySettings({
              ...deliverySettings,
              estimated_time_min: parseInt(e.target.value) || 0,
            })
          }
          fullWidth
        />

        <FormControlLabel
          control={
            <Switch
              checked={deliverySettings.use_own_delivery}
              onChange={(e) =>
                setDeliverySettings({
                  ...deliverySettings,
                  use_own_delivery: e.target.checked,
                })
              }
            />
          }
          label="Usar repartidores propios"
        />

        <Button
          variant="contained"
          onClick={handleSaveDelivery}
          disabled={loading}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar Configuración"}
        </Button>
      </Stack>
    </Paper>
  );

  const PaymentMethodsTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Payment color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Métodos de Pago
        </Typography>
      </Stack>

      <Stack spacing={2}>
        {paymentMethods.map((method) => (
          <Card key={method.method} variant="outlined">
            <CardContent>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Typography>{method.label}</Typography>
                <Switch
                  checked={method.is_active}
                  onChange={() => togglePaymentMethod(method.method)}
                />
              </Stack>
            </CardContent>
          </Card>
        ))}

        <Button
          variant="contained"
          onClick={handleSavePayments}
          disabled={loading}
          sx={{ mt: 2 }}
        >
          {loading ? <CircularProgress size={24} /> : "Guardar Métodos"}
        </Button>
      </Stack>
    </Paper>
  );

  const FoodTypesTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <Category color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Tipos de Comida
        </Typography>
      </Stack>

      {loadingCatalogs ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <CircularProgress />
        </Box>
      ) : (
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {availableFoodTypes.map((type) => (
              <Grid item xs={6} md={4} key={type.id}>
                <Card 
                  variant="outlined"
                  sx={{
                    cursor: 'pointer',
                    borderWidth: selectedFoodTypes.includes(type.id) ? 2 : 1,
                    borderColor: selectedFoodTypes.includes(type.id) ? 'primary.main' : 'divider',
                  }}
                  onClick={() => toggleFoodType(type.id)}
                >
                  <CardContent>
                    <Typography align="center">
                      {type.name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Button
            variant="contained"
            onClick={handleSaveFoodTypes}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : "Guardar Tipos"}
          </Button>
        </Stack>
      )}
    </Paper>
  );

  const GalleryTab = () => (
    <Paper sx={{ p: 3 }}>
      <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
        <PhotoLibrary color="primary" />
        <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
          Galería de Fotos
        </Typography>
      </Stack>

      <Button
        variant="outlined"
        component="label"
        startIcon={<Add />}
        disabled={loading}
        sx={{ mb: 3 }}
      >
        Agregar Foto
        <input
          type="file"
          hidden
          accept="image/*"
          onChange={handlePhotoUpload}
        />
      </Button>

      <Grid container spacing={2}>
        {photos.map((photo) => (
          <Grid item xs={12} sm={6} md={4} key={photo.id}>
            <Card>
              <CardMedia
                component="img"
                height="200"
                image={photo.url}
                alt="Business photo"
              />
              <CardActions>
                <IconButton
                  size="small"
                  color="error"
                  onClick={() => handleDeletePhoto(photo.id)}
                  disabled={loading}
                >
                  <Delete />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {photos.length === 0 && (
        <Alert severity="info">
          No hay fotos en la galería. Agrega algunas para mostrar tu negocio.
        </Alert>
      )}
    </Paper>
  );

  // ============================================================================
  // MAIN RENDER
  // ============================================================================

  return (
    <Box>
      <Paper sx={{ mb: 3 }}>
        <Tabs
          value={activeTab}
          onChange={(e, newValue) => setActiveTab(newValue)}
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

      <Box sx={{ mt: 3 }}>
        {activeTab === 0 && <BasicInfoTab />}
        {activeTab === 1 && <LocationTab />}
        {activeTab === 2 && <SchedulesTab />}
        {activeTab === 3 && <DeliveryTab />}
        {activeTab === 4 && <PaymentMethodsTab />}
        {activeTab === 5 && <FoodTypesTab />}
        {activeTab === 6 && <GalleryTab />}
      </Box>

      {/* Snackbar */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerSettings;