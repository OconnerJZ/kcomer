// src/components/forms/GoogleMapField.jsx - VERSIÓN OPTIMIZADA
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
import PropTypes from "prop-types";
import { mapsService } from "@Services/mapsService";

const GoogleMapField = ({ value, onChange, label, apiKey }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    initMap();
  }, []);

  const initMap = async () => {
    try {
      if (!apiKey || apiKey === "" || apiKey === "undefined") {
        setError("API Key de Google Maps no configurada");
        setLoading(false);
        return;
      }

      // Usar servicio centralizado (carga una sola vez)
      await mapsService.loadGoogleMaps();
      
      // Verificar que window.google existe
      if (!window.google || !window.google.maps) {
        setError("Google Maps no se cargó correctamente");
        setLoading(false);
        return;
      }
      
      if (!mapRef.current) {
        setError("Referencia del mapa no disponible");
        setLoading(false);
        return;
      }

      const defaultCenter = value || { lat: 19.4326, lng: -99.1332 };

      const mapOptions = {
        center: defaultCenter,
        zoom: 15,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: true,
      };

      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      googleMapInstanceRef.current = map;

      const marker = new window.google.maps.Marker({
        position: defaultCenter,
        map,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: "Arrastra para cambiar ubicación",
      });

      markerRef.current = marker;

      // Evento drag end - usa cache de geocoding
      marker.addListener("dragend", async () => {
        const position = marker.getPosition();
        const coords = {
          lat: position.lat(),
          lng: position.lng(),
        };

        const geocodeData = await mapsService.reverseGeocode(coords);
        
        onChange({
          latitude: coords.lat,
          longitude: coords.lng,
          ...geocodeData,
        });

        if (geocodeData) {
          setAddress(geocodeData.formatted_address);
        }
      });

      // Click en el mapa - usa cache de geocoding
      map.addListener("click", async (e) => {
        const coords = {
          lat: e.latLng.lat(),
          lng: e.latLng.lng(),
        };
        marker.setPosition(e.latLng);

        const geocodeData = await mapsService.reverseGeocode(coords);
        
        onChange({
          latitude: coords.lat,
          longitude: coords.lng,
          ...geocodeData,
        });

        if (geocodeData) {
          setAddress(geocodeData.formatted_address);
        }
      });

      // Geocode inicial con cache
      if (value) {
        const initialGeocode = await mapsService.reverseGeocode(value);
        if (initialGeocode) {
          setAddress(initialGeocode.formatted_address);
        }
      }

      setLoading(false);
      console.log("✅ Mapa inicializado (reutilizando Google Maps cargado)");
    } catch (err) {
      console.error("❌ Error al inicializar mapa:", err);
      setError("Error al inicializar el mapa: " + err.message);
      setLoading(false);
    }
  };

  const handleGetCurrentLocation = async () => {
    setLoading(true);
    
    try {
      // Usar servicio con cache de ubicación
      const coords = await mapsService.getCurrentLocation();

      if (googleMapInstanceRef.current && markerRef.current) {
        googleMapInstanceRef.current.setCenter(coords);
        markerRef.current.setPosition(coords);

        // Usar geocoding con cache
        const geocodeData = await mapsService.reverseGeocode(coords);
        
        if (geocodeData) {
          setAddress(geocodeData.formatted_address);
          
          onChange({
            latitude: coords.lat,
            longitude: coords.lng,
            ...geocodeData,
          });
        }
      }
    } catch (error) {
      console.error("❌ Error de geolocalización:", error);
      let errorMsg = "No se pudo obtener la ubicación";

      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMsg = "Permiso de ubicación denegado";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMsg = "Ubicación no disponible";
          break;
        case error.TIMEOUT:
          errorMsg = "Tiempo de espera agotado";
          break;
      }

      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  if (error) {
    return (
      <Box sx={{ my: 2 }}>
        <Typography variant="subtitle1" sx={{ mb: 1 }}>
          {label}
        </Typography>
        <Alert severity="error" sx={{ mb: 2 }}>
          <Typography variant="body2" sx={{ fontWeight: 600 }}>
            {error}
          </Typography>
          {error.includes("API Key") && (
            <Typography variant="caption" sx={{ display: "block", mt: 1 }}>
              Solución:
              <br />
              1. Crea un archivo <code>.env</code> en la raíz del proyecto
              <br />
              2. Agrega: <code>VITE_REACT_API_KEY_MAPS=tu_api_key_aquí</code>
              <br />
              3. Reinicia el servidor: <code>npm run dev</code>
            </Typography>
          )}
        </Alert>
      </Box>
    );
  }

  return (
    <Box sx={{ my: 2 }}>
      <Typography variant="subtitle1" sx={{ mb: 1, fontWeight: 600 }}>
        {label}
      </Typography>

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
              sx={{
                cursor: "pointer",
                "&:hover": { color: "primary.main" },
              }}
              onClick={handleGetCurrentLocation}
              titleAccess="Obtener mi ubicación actual"
            />
          ),
        }}
        sx={{ mb: 2 }}
      />

      {value && (
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ mb: 1, display: "block" }}
        >
          Lat: {value.lat?.toFixed(6)}, Lng: {value.lng?.toFixed(6)}
        </Typography>
      )}

      <Paper
        elevation={3}
        sx={{
          width: "100%",
          height: 400,
          borderRadius: 2,
          overflow: "hidden",
          position: "relative",
          bgcolor: loading ? "grey.100" : "transparent",
        }}
      >
        <Box
          ref={mapRef}
          sx={{
            width: "100%",
            height: "100%",
          }}
        />

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
              borderRadius: 2,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2">Cargando mapa...</Typography>
          </Box>
        )}
      </Paper>

      <Typography
        variant="caption"
        color="text.secondary"
        sx={{ mt: 1, display: "block" }}
      >
        💡 Tip: Las ubicaciones se cachean para ahorrar llamadas a la API
      </Typography>
    </Box>
  );
};

GoogleMapField.propTypes = {
  value: PropTypes.shape({
    lat: PropTypes.number,
    lng: PropTypes.number,
  }),
  onChange: PropTypes.func.isRequired,
  label: PropTypes.string,
  apiKey: PropTypes.string.isRequired,
};

GoogleMapField.defaultProps = {
  label: "Ubicación en mapa",
  value: null,
};

export default GoogleMapField;