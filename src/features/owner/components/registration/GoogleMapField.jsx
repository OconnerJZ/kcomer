import { useEffect, useRef, useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Paper,
  CircularProgress,
  Alert,
} from "@mui/material";
import { MyLocation } from "@mui/icons-material";
import {
  getCurrentPosition,
  loadGoogleMaps,
  reverseGeocode,
} from "@Shared/services/maps/googleMaps";

const DEFAULT_CENTER = { lat: 19.4326, lng: -99.1332 };

const toMapCoords = (value) => {
  if (!value) return DEFAULT_CENTER;
  return {
    lat: value.lat ?? value.latitude ?? DEFAULT_CENTER.lat,
    lng: value.lng ?? value.longitude ?? DEFAULT_CENTER.lng,
  };
};

const GoogleMapField = ({ value, onChange, label = "Ubicación en mapa", apiKey }) => {
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
      onChange({
        latitude: coords.lat,
        longitude: coords.lng,
        ...(geocodeData || {}),
      });
    } catch (geocodeError) {
      console.error("Error en geocoding:", geocodeError);
      onChange({ latitude: coords.lat, longitude: coords.lng });
    }
  };

  useEffect(() => {
    let disposed = false;

    const initialize = async () => {
      try {
        setLoading(true);
        setError(null);
        await loadGoogleMaps(apiKey);
        if (disposed || !mapRef.current) return;

        const center = toMapCoords(value);
        const map = new window.google.maps.Map(mapRef.current, {
          center,
          zoom: 15,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: true,
        });
        mapInstanceRef.current = map;

        const marker = new window.google.maps.Marker({
          position: center,
          map,
          draggable: true,
          animation: window.google.maps.Animation.DROP,
          title: "Arrastra para cambiar ubicación",
        });
        markerRef.current = marker;

        marker.addListener("dragend", () => {
          const position = marker.getPosition();
          publishLocation({ lat: position.lat(), lng: position.lng() });
        });

        map.addListener("click", (event) => {
          const coords = { lat: event.latLng.lat(), lng: event.latLng.lng() };
          marker.setPosition(coords);
          publishLocation(coords);
        });

        if (value) {
          const geocodeData = await reverseGeocode(center);
          if (!disposed && geocodeData?.formatted_address) {
            setAddress(geocodeData.formatted_address);
          }
        }
      } catch (initializationError) {
        console.error("Error al inicializar Google Maps:", initializationError);
        if (!disposed) setError(initializationError.message || "Error al cargar Google Maps");
      } finally {
        if (!disposed) setLoading(false);
      }
    };

    initialize();

    return () => {
      disposed = true;
      if (markerRef.current) markerRef.current.setMap(null);
    };
  }, [apiKey]);

  const handleGetCurrentLocation = async () => {
    try {
      setLoading(true);
      setError(null);
      const coords = await getCurrentPosition();
      mapInstanceRef.current?.setCenter(coords);
      markerRef.current?.setPosition(coords);
      await publishLocation(coords);
    } catch (locationError) {
      const messages = {
        1: "Permiso de ubicación denegado",
        2: "Ubicación no disponible",
        3: "Tiempo de espera agotado",
      };
      setError(messages[locationError.code] || locationError.message || "No se pudo obtener la ubicación");
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>{label}</Typography>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>{label}</Typography>
      <TextField
        fullWidth
        value={address}
        placeholder="Haz clic en el mapa o arrastra el marcador"
        InputProps={{
          readOnly: true,
          endAdornment: loading ? (
            <CircularProgress size={20} />
          ) : (
            <MyLocation
              sx={{ cursor: "pointer", "&:hover": { color: "primary.main" } }}
              onClick={handleGetCurrentLocation}
              titleAccess="Obtener mi ubicación actual"
            />
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: 400,
          borderRadius: "10px",
          overflow: "hidden",
          position: "relative",
          bgcolor: loading ? "grey.100" : "transparent",
        }}
      >
        <Box ref={mapRef} sx={{ width: "100%", height: "100%" }} />
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              textAlign: "center",
              bgcolor: "rgba(255,255,255,0.9)",
              p: 3,
              borderRadius: "10px",
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2">Cargando mapa...</Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default GoogleMapField;
