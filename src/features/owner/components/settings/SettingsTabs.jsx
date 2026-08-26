import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  IconButton,
  Paper,
  Stack,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  Add,
  Business,
  Category,
  Delete,
  Edit,
  LocalShipping,
  LocationOn,
  Payment,
  PhotoLibrary,
  Schedule,
} from "@mui/icons-material";
import ScheduleField from "@Features/owner/components/registration/ScheduleField";

export const BasicInfoTab = ({ basicInfo, setBasicInfo, logoFile, logoPreview, onLogoChange, onSave, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}>
      <Business color="primary" />
      <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Información General</Typography>
    </Stack>
    <Card sx={{ mb: 3 }} elevation={0}>
      <CardContent>
        <Box sx={{ textAlign: "center", mb: 2 }}>
          <Avatar src={logoPreview || basicInfo.logo} sx={{ width: 120, height: 120, mx: "auto", mb: 2, border: "3px solid", borderColor: "primary.light" }}>
            <Business sx={{ fontSize: 60 }} />
          </Avatar>
          <Button variant="outlined" component="label" fullWidth startIcon={<Edit />}>
            {logoFile ? "Cambiar Logo" : "Subir Logo"}
            <input type="file" hidden accept="image/*" onChange={onLogoChange} />
          </Button>
        </Box>
        <Alert severity="info" sx={{ fontSize: "0.75rem" }}>Tamaño recomendado: 512x512px<br />Máximo: 5MB</Alert>
      </CardContent>
    </Card>
    <Stack spacing={2}>
      <TextField label="Nombre del negocio" value={basicInfo.name} onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })} fullWidth required />
      <TextField label="Descripción" value={basicInfo.description} onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })} multiline rows={3} fullWidth />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Teléfono" value={basicInfo.phone} onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })} fullWidth /></Grid>
        <Grid item xs={12} md={6}><TextField label="Email" type="email" value={basicInfo.email} onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })} fullWidth /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Tiempo de preparación (minutos)" type="number" value={basicInfo.prepTimeMin} onChange={(e) => setBasicInfo({ ...basicInfo, prepTimeMin: parseInt(e.target.value, 10) || 0 })} fullWidth /></Grid>
        <Grid item xs={12} md={6}><TextField label="Tiempo estimado de entrega (minutos)" type="number" value={basicInfo.estimatedDeliveryMin} onChange={(e) => setBasicInfo({ ...basicInfo, estimatedDeliveryMin: parseInt(e.target.value, 10) || 0 })} fullWidth /></Grid>
      </Grid>
      <FormControlLabel control={<Switch color="success" checked={basicInfo.open} onChange={(e) => setBasicInfo({ ...basicInfo, open: e.target.checked })} />} label={basicInfo.open ? <Chip label="Negocio abierto" color="success" variant="outlined" /> : <Chip label="Negocio cerrado" color="error" variant="outlined" />} />
      <Button variant="contained" onClick={onSave} disabled={loading} sx={{ mt: 2 }}>{loading ? <CircularProgress size={24} /> : "Guardar Cambios"}</Button>
    </Stack>
  </Paper>
);

export const LocationTab = ({ locationInfo, setLocationInfo, onSave, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}><LocationOn color="primary" /><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Ubicación del Negocio</Typography></Stack>
    <Stack spacing={2}>
      <TextField label="Dirección" value={locationInfo.address} onChange={(e) => setLocationInfo({ ...locationInfo, address: e.target.value })} fullWidth multiline rows={2} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Ciudad" value={locationInfo.city} onChange={(e) => setLocationInfo({ ...locationInfo, city: e.target.value })} fullWidth /></Grid>
        <Grid item xs={12} md={6}><TextField label="Código Postal" value={locationInfo.postalCode} onChange={(e) => setLocationInfo({ ...locationInfo, postalCode: e.target.value })} fullWidth /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Latitud" type="number" value={locationInfo.latitude} onChange={(e) => setLocationInfo({ ...locationInfo, latitude: e.target.value })} fullWidth placeholder="19.4326" /></Grid>
        <Grid item xs={12} md={6}><TextField label="Longitud" type="number" value={locationInfo.longitude} onChange={(e) => setLocationInfo({ ...locationInfo, longitude: e.target.value })} fullWidth placeholder="-99.1332" /></Grid>
      </Grid>
      <Alert severity="info">Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en la ubicación.</Alert>
      <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? <CircularProgress size={24} /> : "Guardar Ubicación"}</Button>
    </Stack>
  </Paper>
);

export const SchedulesTab = ({ schedules, setSchedules, onSave, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}><Schedule color="primary" /><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Horarios de Atención</Typography></Stack>
    <ScheduleField schedules={schedules} onChange={setSchedules} />
    <Button variant="contained" onClick={onSave} disabled={loading} sx={{ mt: 3 }}>{loading ? <CircularProgress size={24} /> : "Guardar Horarios"}</Button>
  </Paper>
);

export const DeliveryTab = ({ deliverySettings, setDeliverySettings, onSave, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}><LocalShipping color="primary" /><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Configuración de Delivery</Typography></Stack>
    <Stack spacing={2}>
      <TextField label="Radio de entrega (km)" type="number" value={deliverySettings.deliveryRadiusKm} onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryRadiusKm: parseFloat(e.target.value) || 0 })} fullWidth />
      <TextField label="Costo de envío" type="number" value={deliverySettings.deliveryFee} onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryFee: parseFloat(e.target.value) || 0 })} fullWidth InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} />
      <TextField label="Monto mínimo de orden" type="number" value={deliverySettings.minOrderAmount} onChange={(e) => setDeliverySettings({ ...deliverySettings, minOrderAmount: parseFloat(e.target.value) || 0 })} fullWidth InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} />
      <TextField label="Tiempo estimado de entrega (minutos)" type="number" value={deliverySettings.estimatedTimeMin} onChange={(e) => setDeliverySettings({ ...deliverySettings, estimatedTimeMin: parseInt(e.target.value, 10) || 0 })} fullWidth />
      <FormControlLabel control={<Switch checked={deliverySettings.useOwnDelivery} onChange={(e) => setDeliverySettings({ ...deliverySettings, useOwnDelivery: e.target.checked })} />} label="Usar repartidores propios" />
      <Button variant="contained" onClick={onSave} disabled={loading}>{loading ? <CircularProgress size={24} /> : "Guardar Configuración"}</Button>
    </Stack>
  </Paper>
);

export const PaymentMethodsTab = ({ paymentMethods, onToggle, onSave, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}><Payment color="primary" /><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Métodos de Pago</Typography></Stack>
    <Stack spacing={2}>
      {paymentMethods.map((method) => <Card key={method.method} variant="outlined"><CardContent><Stack direction="row" justifyContent="space-between" alignItems="center"><Typography>{method.label}</Typography><Switch checked={method.active} onChange={() => onToggle(method.method)} /></Stack></CardContent></Card>)}
      <Button variant="contained" onClick={onSave} disabled={loading} sx={{ mt: 2 }}>{loading ? <CircularProgress size={24} /> : "Guardar Métodos"}</Button>
    </Stack>
  </Paper>
);

export const FoodTypesTab = ({ availableFoodTypes, selectedFoodTypes, loadingCatalogs, onToggle, onSave, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}><Category color="primary" /><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Tipos de Comida</Typography></Stack>
    {loadingCatalogs ? <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}><CircularProgress /></Box> : <Stack spacing={2}><Grid container spacing={2}>{availableFoodTypes.map((type) => <Grid item xs={6} md={4} key={type.id}><Card variant="outlined" sx={{ cursor: "pointer", borderWidth: selectedFoodTypes.includes(type.id) ? 2 : 1, borderColor: selectedFoodTypes.includes(type.id) ? "primary.main" : "divider" }} onClick={() => onToggle(type.id)}><CardContent><Typography align="center">{type.name}</Typography></CardContent></Card></Grid>)}</Grid><Button variant="contained" onClick={onSave} disabled={loading}>{loading ? <CircularProgress size={24} /> : "Guardar Tipos"}</Button></Stack>}
  </Paper>
);

export const GalleryTab = ({ photos, onUpload, onDelete, loading }) => (
  <Paper sx={{ p: 3 }}>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 3 }}><PhotoLibrary color="primary" /><Typography variant="subtitle1" sx={{ fontWeight: 600 }}>Galería de Fotos</Typography></Stack>
    <Button variant="outlined" component="label" startIcon={<Add />} disabled={loading} sx={{ mb: 3 }}>Agregar Foto<input type="file" hidden accept="image/*" onChange={onUpload} /></Button>
    <Grid container spacing={2}>{photos.map((photo) => <Grid item xs={12} sm={6} md={4} key={photo.id}><Card><CardMedia component="img" height="200" image={photo.url} alt="Business photo" /><CardActions><IconButton size="small" color="error" onClick={() => onDelete(photo.id)} disabled={loading}><Delete /></IconButton></CardActions></Card></Grid>)}</Grid>
    {photos.length === 0 && <Alert severity="info">No hay fotos en la galería. Agrega algunas para mostrar tu negocio.</Alert>}
  </Paper>
);
