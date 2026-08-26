import { useEffect, useRef, useState } from "react";
import { Alert, Box, CircularProgress, IconButton, Paper, TextField, Tooltip, Typography } from "@mui/material";
import { MyLocation } from "@mui/icons-material";
import { getCurrentPosition, loadGoogleMaps, reverseGeocode } from "@Shared/services/maps/googleMaps";

const DEFAULT_CENTER = { lat: 19.4326, lng: -99.1332 };
const toCoords = (value) => ({ lat: Number(value?.lat ?? value?.latitude ?? DEFAULT_CENTER.lat), lng: Number(value?.lng ?? value?.longitude ?? DEFAULT_CENTER.lng) });

export default function GoogleMapField({ value, onChange, label = "Ubicación", apiKey, height = 320, compact = false }) {
  const mapNode = useRef(null); const mapRef = useRef(null); const markerRef = useRef(null);
  const [loading, setLoading] = useState(true); const [error, setError] = useState(null);
  const [address, setAddress] = useState(value?.formatted_address || value?.address || "");

  const publish = async (coords) => {
    try {
      const geo = await reverseGeocode(coords);
      setAddress(geo?.formatted_address || geo?.address || "");
      onChange?.({ latitude: coords.lat, longitude: coords.lng, ...(geo || {}) });
    } catch {
      onChange?.({ latitude: coords.lat, longitude: coords.lng });
    }
  };

  useEffect(() => {
    let disposed = false;
    (async () => {
      try {
        setLoading(true); setError(null); await loadGoogleMaps(apiKey);
        if (disposed || !mapNode.current) return;
        const center = toCoords(value);
        const map = new window.google.maps.Map(mapNode.current, { center, zoom: 16, mapTypeControl: false, streetViewControl: false, fullscreenControl: !compact });
        const marker = new window.google.maps.Marker({ position: center, map, draggable: true });
        mapRef.current = map; markerRef.current = marker;
        marker.addListener("dragend", () => { const p = marker.getPosition(); publish({ lat: p.lat(), lng: p.lng() }); });
        map.addListener("click", (event) => { const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() }; marker.setPosition(coords); publish(coords); });
      } catch (e) { if (!disposed) setError(e.message || "No se pudo cargar el mapa"); }
      finally { if (!disposed) setLoading(false); }
    })();
    return () => { disposed = true; markerRef.current?.setMap(null); };
  }, [apiKey, compact]);

  useEffect(() => {
    if (!mapRef.current || !markerRef.current || !value?.latitude || !value?.longitude) return;
    const coords = toCoords(value); mapRef.current.setCenter(coords); markerRef.current.setPosition(coords);
    setAddress(value.formatted_address || value.address || address);
  }, [value?.latitude, value?.longitude, value?.address, value?.formatted_address]);

  const locate = async () => {
    try { setLoading(true); const coords = await getCurrentPosition(); mapRef.current?.setCenter(coords); markerRef.current?.setPosition(coords); await publish(coords); }
    catch (e) { setError(e.message || "No se pudo obtener tu ubicación"); }
    finally { setLoading(false); }
  };

  return <Box>
    {label && <Typography variant="subtitle2" fontWeight={800} sx={{ mb: 1 }}>{label}</Typography>}
    {error && <Alert severity="warning" sx={{ mb: 1 }}>{error}</Alert>}
    <TextField fullWidth size={compact ? "small" : "medium"} value={address} placeholder="Selecciona el punto exacto en el mapa" InputProps={{ readOnly: true, endAdornment: <Tooltip title="Usar mi ubicación"><span><IconButton size="small" onClick={locate} disabled={loading}><MyLocation fontSize="small" /></IconButton></span></Tooltip> }} sx={{ mb: 1.25 }} />
    <Paper elevation={0} sx={{ height, borderRadius: 3, overflow: "hidden", border: "1px solid", borderColor: "divider", position: "relative" }}>
      <Box ref={mapNode} sx={{ width: "100%", height: "100%" }} />
      {loading && <Box sx={{ position: "absolute", inset: 0, display: "grid", placeItems: "center", bgcolor: "rgba(255,255,255,.72)" }}><CircularProgress size={28} /></Box>}
    </Paper>
  </Box>;
}
