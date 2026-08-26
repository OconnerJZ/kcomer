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

const SectionShell = ({ eyebrow, title, description, children }) => (
  <Paper
    elevation={0}
    sx={{
      p: { xs: 2, sm: 3 },
      borderRadius: 3,
      border: "1px solid",
      borderColor: "divider",
      bgcolor: "rgba(255,255,255,.88)",
    }}
  >
    <Box sx={{ mb: 3 }}>
      {eyebrow && (
        <Typography variant="overline" color="text.secondary" sx={{ letterSpacing: ".13em", fontSize: ".62rem" }}>
          {eyebrow}
        </Typography>
      )}
      <Typography variant="h6" fontWeight={800}>{title}</Typography>
      {description && (
        <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5, maxWidth: 680 }}>
          {description}
        </Typography>
      )}
    </Box>
    {children}
  </Paper>
);

export const BasicInfoTab = ({ basicInfo, setBasicInfo, logoFile, logoPreview, onLogoChange, onSave, loading }) => (
  <SectionShell
    eyebrow="IDENTIDAD"
    title="Información general"
    description="Define cómo se presenta tu negocio y los datos base que utiliza Kcomer durante la operación."
  >
    <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "220px minmax(0,1fr)" }, gap: 3.5, alignItems: "start" }}>
      <Box>
        <Box
          sx={{
            p: 2.5,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 3,
            textAlign: "center",
            bgcolor: "rgba(248,248,248,.7)",
          }}
        >
          <Avatar
            src={logoPreview || basicInfo.logo}
            sx={{ width: 112, height: 112, mx: "auto", mb: 2, bgcolor: "grey.100", color: "text.secondary", border: "1px solid", borderColor: "divider" }}
          >
            <Business sx={{ fontSize: 42 }} />
          </Avatar>
          <Typography variant="body2" fontWeight={800}>Logo del negocio</Typography>
          <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 0.4, mb: 1.75 }}>
            Ideal en formato cuadrado, hasta 5 MB.
          </Typography>
          <Button variant="outlined" component="label" startIcon={<Edit />} sx={{ textTransform: "none", borderRadius: 2 }}>
            {logoFile ? "Cambiar logo" : "Actualizar logo"}
            <input type="file" hidden accept="image/*" onChange={onLogoChange} />
          </Button>
        </Box>
      </Box>

      <Stack spacing={2.1}>
        <TextField label="Nombre del negocio" value={basicInfo.name} onChange={(e) => setBasicInfo({ ...basicInfo, name: e.target.value })} fullWidth required />
        <TextField label="Descripción" value={basicInfo.description} onChange={(e) => setBasicInfo({ ...basicInfo, description: e.target.value })} multiline minRows={3} maxRows={5} fullWidth />
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField label="Teléfono" value={basicInfo.phone} onChange={(e) => setBasicInfo({ ...basicInfo, phone: e.target.value })} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField label="Email" type="email" value={basicInfo.email} onChange={(e) => setBasicInfo({ ...basicInfo, email: e.target.value })} fullWidth /></Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={6}><TextField label="Preparación estimada" helperText="Minutos promedio de cocina" type="number" value={basicInfo.prepTimeMin} onChange={(e) => setBasicInfo({ ...basicInfo, prepTimeMin: parseInt(e.target.value, 10) || 0 })} fullWidth /></Grid>
          <Grid item xs={12} md={6}><TextField label="Entrega estimada" helperText="Minutos promedio hasta el cliente" type="number" value={basicInfo.estimatedDeliveryMin} onChange={(e) => setBasicInfo({ ...basicInfo, estimatedDeliveryMin: parseInt(e.target.value, 10) || 0 })} fullWidth /></Grid>
        </Grid>

        <Box sx={{ px: 1.5, py: 1.1, border: "1px solid", borderColor: "divider", borderRadius: 2 }}>
          <FormControlLabel
            sx={{ m: 0, width: "100%", justifyContent: "space-between", flexDirection: "row-reverse" }}
            control={<Switch checked={basicInfo.open} onChange={(e) => setBasicInfo({ ...basicInfo, open: e.target.checked })} />}
            label={
              <Box>
                <Typography variant="body2" fontWeight={800}>{basicInfo.open ? "Negocio abierto" : "Negocio cerrado"}</Typography>
                <Typography variant="caption" color="text.secondary">
                  {basicInfo.open ? "Tus clientes pueden ver el negocio como disponible." : "El negocio se mostrará temporalmente cerrado."}
                </Typography>
              </Box>
            }
          />
        </Box>

        <Stack direction="row" justifyContent="flex-end">
          <Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2, minWidth: 150, fontWeight: 700 }}>
            {loading ? <CircularProgress size={22} color="inherit" /> : "Guardar cambios"}
          </Button>
        </Stack>
      </Stack>
    </Box>
  </SectionShell>
);

export const LocationTab = ({ locationInfo, setLocationInfo, onSave, loading }) => (
  <SectionShell eyebrow="UBICACIÓN" title="Dónde encontrarte" description="Mantén actualizada la dirección y coordenadas que utilizan tus clientes para localizar el negocio.">
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
      <Alert severity="info" sx={{ borderRadius: 2 }}>Puedes obtener las coordenadas desde Google Maps haciendo clic derecho en la ubicación.</Alert>
      <Stack direction="row" justifyContent="flex-end"><Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>{loading ? <CircularProgress size={22} /> : "Guardar ubicación"}</Button></Stack>
    </Stack>
  </SectionShell>
);

export const SchedulesTab = ({ schedules, setSchedules, onSave, loading }) => (
  <SectionShell eyebrow="HORARIOS" title="Cuándo estás disponible" description="Configura los horarios que tus clientes verán en Explore y que utilizará la operación del negocio.">
    <ScheduleField schedules={schedules} onChange={setSchedules} />
    <Stack direction="row" justifyContent="flex-end" sx={{ mt: 3 }}><Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>{loading ? <CircularProgress size={22} /> : "Guardar horarios"}</Button></Stack>
  </SectionShell>
);

export const DeliveryTab = ({ deliverySettings, setDeliverySettings, onSave, loading }) => (
  <SectionShell eyebrow="DELIVERY" title="Entrega a domicilio" description="Define cobertura, costo y tiempos estimados para que el cliente sepa qué esperar antes de ordenar.">
    <Stack spacing={2}>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Radio de entrega (km)" type="number" value={deliverySettings.deliveryRadiusKm} onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryRadiusKm: parseFloat(e.target.value) || 0 })} fullWidth /></Grid>
        <Grid item xs={12} md={6}><TextField label="Tiempo estimado (min)" type="number" value={deliverySettings.estimatedTimeMin} onChange={(e) => setDeliverySettings({ ...deliverySettings, estimatedTimeMin: parseInt(e.target.value, 10) || 0 })} fullWidth /></Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}><TextField label="Costo de envío" type="number" value={deliverySettings.deliveryFee} onChange={(e) => setDeliverySettings({ ...deliverySettings, deliveryFee: parseFloat(e.target.value) || 0 })} fullWidth InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} /></Grid>
        <Grid item xs={12} md={6}><TextField label="Monto mínimo de orden" type="number" value={deliverySettings.minOrderAmount} onChange={(e) => setDeliverySettings({ ...deliverySettings, minOrderAmount: parseFloat(e.target.value) || 0 })} fullWidth InputProps={{ startAdornment: <Typography sx={{ mr: 1 }}>$</Typography> }} /></Grid>
      </Grid>
      <FormControlLabel control={<Switch checked={deliverySettings.useOwnDelivery} onChange={(e) => setDeliverySettings({ ...deliverySettings, useOwnDelivery: e.target.checked })} />} label="Usar repartidores propios" />
      <Stack direction="row" justifyContent="flex-end"><Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>{loading ? <CircularProgress size={22} /> : "Guardar delivery"}</Button></Stack>
    </Stack>
  </SectionShell>
);

export const PaymentMethodsTab = ({ paymentMethods, onToggle, onSave, loading }) => (
  <SectionShell eyebrow="PAGOS" title="Métodos aceptados" description="Activa únicamente las opciones que realmente puedes recibir en este negocio.">
    <Stack spacing={1.25}>
      {paymentMethods.map((method) => (
        <Box key={method.method} sx={{ px: 1.5, py: 1.15, border: "1px solid", borderColor: "divider", borderRadius: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box><Typography variant="body2" fontWeight={800}>{method.label}</Typography><Typography variant="caption" color="text.secondary">{method.active ? "Disponible para clientes" : "Desactivado"}</Typography></Box>
          <Switch checked={method.active} onChange={() => onToggle(method.method)} />
        </Box>
      ))}
      <Stack direction="row" justifyContent="flex-end" sx={{ pt: 1 }}><Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>{loading ? <CircularProgress size={22} /> : "Guardar métodos"}</Button></Stack>
    </Stack>
  </SectionShell>
);

export const FoodTypesTab = ({ availableFoodTypes, selectedFoodTypes, loadingCatalogs, onToggle, onSave, loading }) => (
  <SectionShell eyebrow="CATEGORÍAS" title="Qué tipo de comida ofreces" description="Ayuda a que los clientes entiendan rápidamente qué encontrarán en tu negocio.">
    {loadingCatalogs ? (
      <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}><CircularProgress /></Box>
    ) : (
      <Stack spacing={2.5}>
        <Stack direction="row" gap={1} flexWrap="wrap">
          {availableFoodTypes.map((type) => {
            const selected = selectedFoodTypes.includes(type.id);
            return <Chip key={type.id} label={type.name} clickable onClick={() => onToggle(type.id)} variant={selected ? "filled" : "outlined"} color={selected ? "primary" : "default"} sx={{ fontWeight: selected ? 700 : 500 }} />;
          })}
        </Stack>
        <Stack direction="row" justifyContent="flex-end"><Button variant="contained" disableElevation onClick={onSave} disabled={loading} sx={{ textTransform: "none", borderRadius: 2 }}>{loading ? <CircularProgress size={22} /> : "Guardar categorías"}</Button></Stack>
      </Stack>
    )}
  </SectionShell>
);

const normalizePhotoUrl = (photo) => typeof photo === "string" ? photo : photo?.url || photo?.image || photo?.imageUrl || "";

export const GalleryTab = ({ photos = [], coverImage = "", onUpload, onDelete, loading }) => {
  const effectiveCover = coverImage || normalizePhotoUrl(photos[0]);

  return (
    <SectionShell eyebrow="IMAGEN" title="Galería y portada" description="Las fotografías son la parte más visual de tu negocio en Explore. Si no hay una portada configurada, Kcomer utiliza la primera foto de la galería.">
      <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ xs: "stretch", sm: "center" }} gap={1.5} sx={{ mb: 3 }}>
        <Box>
          <Typography variant="body2" fontWeight={800}>{photos.length} {photos.length === 1 ? "fotografía" : "fotografías"}</Typography>
          <Typography variant="caption" color="text.secondary">Prioriza imágenes horizontales, luminosas y representativas del lugar o la comida.</Typography>
        </Box>
        <Button variant="outlined" component="label" startIcon={<Add />} disabled={loading} sx={{ textTransform: "none", borderRadius: 2, alignSelf: { xs: "flex-start", sm: "center" } }}>
          Agregar foto
          <input type="file" hidden accept="image/*" onChange={onUpload} />
        </Button>
      </Stack>

      {photos.length === 0 ? (
        <Box sx={{ py: 6, px: 2, textAlign: "center", border: "1px dashed", borderColor: "divider", borderRadius: 3 }}>
          <PhotoLibrary sx={{ fontSize: 38, color: "text.disabled", mb: 1 }} />
          <Typography variant="body2" fontWeight={800}>Tu galería todavía está vacía</Typography>
          <Typography variant="caption" color="text.secondary">Agrega fotografías para hacer más atractiva tu presencia en Explore.</Typography>
        </Box>
      ) : (
        <Grid container spacing={2}>
          {photos.map((photo, index) => {
            const url = normalizePhotoUrl(photo);
            const id = typeof photo === "object" ? photo.id : index;
            const isCover = Boolean(url) && String(url) === String(effectiveCover);
            return (
              <Grid item xs={12} sm={6} md={4} key={id ?? url}>
                <Card elevation={0} sx={{ position: "relative", overflow: "hidden", borderRadius: 3, border: "1px solid", borderColor: isCover ? "rgba(255,75,69,.32)" : "divider" }}>
                  <CardMedia component="img" height="190" image={url} alt={`Foto ${index + 1} del negocio`} sx={{ objectFit: "cover" }} />
                  {isCover && (
                    <Chip label="Portada actual" size="small" sx={{ position: "absolute", top: 10, left: 10, bgcolor: "rgba(255,255,255,.94)", fontWeight: 800, backdropFilter: "blur(8px)" }} />
                  )}
                  <CardActions sx={{ justifyContent: "space-between", px: 1.5, py: 1 }}>
                    <Typography variant="caption" color="text.secondary">Foto {index + 1}</Typography>
                    <IconButton size="small" color="error" onClick={() => onDelete(id)} disabled={loading} aria-label="eliminar foto"><Delete fontSize="small" /></IconButton>
                  </CardActions>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      )}

      {photos.length > 0 && !coverImage && (
        <Alert severity="info" sx={{ mt: 2.5, borderRadius: 2 }}>
          La primera fotografía está funcionando como portada de Explore. La selección manual quedará disponible cuando el backend exponga ese ajuste de forma persistente.
        </Alert>
      )}
    </SectionShell>
  );
};
