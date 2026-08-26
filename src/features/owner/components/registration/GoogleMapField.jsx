import { useEffect, useRef, useState } from "react";
import { Box, Typography, TextField, Paper, CircularProgress, Alert, IconButton, InputAdornment } from "@mui/material";
import { MyLocationRounded } from "@mui/icons-material";
import { getCurrentPosition, loadGoogleMaps, reverseGeocode } from "@Shared/services/maps/googleMaps";

const DEFAULT_CENTER = { lat: 19.4326, lng: -99.1332 };
const toMapCoords = (value) => ({
  lat: Number(value?.lat ?? value?.latitude) || DEFAULT_CENTER.lat,
  lng: Number(value?.lng ?? value?.longitude) || DEFAULT_CENTER.lng,
});

const GoogleMapField = ({ value, onChange, label = "Ubicación en mapa", apiKey, height = 400, compact = false }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const mapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState(value?.formatted_address || value?.address || "");
  const [error, setError] = useState(null);

  const publishLocation = async (coords) => {
    try {
      const geocodeData = await reverseGeocode(coords);
      if (geocodeData?.formatted_address) setAddress(geocodeData.formatted_address);
      onChange?.({ latitude: coords.lat, longitude: coords.lng, ...(geocodeData || {}) });
    } catch (geocodeError) {
      console.error("Error en geocoding:", geocodeError);
      onChange?.({ latitude: coords.lat, longitude: coords.lng });
    }
  };

  useEffect(() => {
    let disposed = false;
    const initialize = async () => {
      try {
        setLoading(true); setError(null);
        await loadGoogleMaps(apiKey);
        if (disposed || !mapRef.current) return;
        const center = toMapCoords(value);
        const map = new window.google.maps.Map(mapRef.current, { center, zoom: 16, mapTypeControl: false, streetViewControl: false, fullscreenControl: !compact, gestureHandling: "greedy" });
        mapInstanceRef.current = map;
        const marker = new window.google.maps.Marker({ position: center, map, draggable: true, animation: window.google.maps.Animation.DROP, title: "Arrastra para cambiar ubicación" });
        markerRef.current = marker;
        marker.addListener("dragend", () => { const position = marker.getPosition(); publishLocation({ lat: position.lat(), lng: position.lng() }); });
        map.addListener("click", (event) => { const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() }; marker.setPosition(coords); publishLocation(coords); });
        if (value?.address || value?.formatted_address) setAddress(value.formatted_address || value.address);
        else if (value?.latitude && value?.longitude) {
          const geocodeData = await reverseGeocode(center);
          if (!disposed && geocodeData?.formatted_address) setAddress(geocodeData.formatted_address);
        }
      } catch (initializationError) {
        if (!disposed) setError(initializationError.message || "Error al cargar Google Maps");
      } finally { if (!disposed) setLoading(false); }
    };
    initialize();
    return () => { disposed = true; if (markerRef.current) markerRef.current.setMap(null); };
  }, [apiKey, compact]);

  useEffect(() => {
    const hasCoords = value?.latitude != null && value?.longitude != null;
    if (!hasCoords || !mapInstanceRef.current || !markerRef.current) return;
    const coords = toMapCoords(value);
    mapInstanceRef.current.setCenter(coords);
    markerRef.current.setPosition(coords);
    setAddress(value?.formatted_address || value?.address || "");
  }, [value?.latitude, value?.longitude, value?.address, value?.formatted_address]);

  const handleGetCurrentLocation = async () => {
    try {
      setLoading(true); setError(null);
      const coords = await getCurrentPosition();
      mapInstanceRef.current?.panTo(coords);
      markerRef.current?.setPosition(coords);
      await publishLocation(coords);
    } catch (locationError) {
      const messages = { 1: "Permiso de ubicación denegado", 2: "Ubicación no disponible", 3: "Tiempo de espera agotado" };
      setError(messages[locationError.code] || locationError.message || "No se pudo obtener la ubicación");
    } finally { setLoading(false); }
  };

  return (
    <Box sx={{ my: compact ? 0 : 2 }}>
      {label && <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 750 }}>{label}</Typography>}
      {error && <Alert severity="warning" sx={{ mb: 1.5 }}>{error}</Alert>}
      <TextField
        fullWidth
        size={compact ? "small" : "medium"}
        value={address}
        placeholder="Haz clic en el mapa o arrastra el marcador"
        InputProps={{
          readOnly: true,
          endAdornment: <InputAdornment position="end">{loading ? <CircularProgress size={18} /> : <IconButton size="small" onClick={handleGetCurrentLocation} title="Usar mi ubicación"><MyLocationRounded fontSize="small" /></IconButton>}</InputAdornment>,
        }}
        sx={{ mb: 1.5 }}
      />
      <Paper elevation={0} sx={{ width: "100%", height: { xs: Math.min(Number(height) || 400, 340), sm: height }, borderRadius: 3, overflow: "hidden", position: "relative", bgcolor: "grey.100", border: "1px solid", borderColor: "divider" }}>
        <Box ref={mapRef} sx={{ width: "100%", height: "100%" }} />
        {loading && <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.68)", backdropFilter: "blur(2px)" }}><Box sx={{ textAlign: "center" }}><CircularProgress size={26} /><Typography variant="caption" display="block" sx={{ mt: 1 }}>Cargando mapa…</Typography></Box></Box>}
      </Paper>
      <Typography variant="caption" color="text.secondary" sx={{ display: "block", mt: 1 }}>Toca el mapa o arrastra el pin. La dirección se obtiene automáticamente y puedes corregirla antes de guardar.</Typography>
    </Box>
  );
};
export default GoogleMapField;
