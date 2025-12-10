// src/components/forms/GoogleMapField.jsx
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

const parseAddressComponents = (addressComponents) => {
  if (!addressComponents || !Array.isArray(addressComponents)) {
    return {
      address: "",
      city: "",
      postalCode: "",
      state: "",
      country: "",
    };
  }
  
  const findComponent = (types) => {
    return addressComponents.find((component) =>
      types.some((type) => component.types.includes(type))
    );
  };

  const route = findComponent(["route"]);
  const streetNumber = findComponent(["street_number"]);
  const locality = findComponent(["locality"]);
  const postalCode = findComponent(["postal_code"]);
  const state = findComponent(["administrative_area_level_1"]);
  const country = findComponent(["country"]);
  const sublocality = findComponent(["sublocality", "sublocality_level_1"]);

  const addressParts = [];
  if (route?.long_name) addressParts.push(route.long_name);
  if (streetNumber?.long_name) addressParts.push(streetNumber.long_name);

  return {
    address: addressParts.join(" ") || "",
    city: locality?.long_name || sublocality?.long_name || "",
    postalCode: postalCode?.long_name || "",
    state: state?.long_name || "",
    stateShort: state?.short_name || "",
    country: country?.long_name || "",
    countryShort: country?.short_name || "",
  };
};

const GoogleMapField = ({ value, onChange, label, apiKey }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!apiKey || apiKey === "" || apiKey === "undefined") {
      setError("API Key de Google Maps no configurada");
      setLoading(false);
      return;
    }

    const loadGoogleMaps = () => {
      try {
        if (window.google?.maps) {
          initMap();
          return;
        }

        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );

        if (existingScript) {
          existingScript.addEventListener("load", initMap);
          return;
        }

        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;

        script.onload = () => {
          console.log("✅ Google Maps cargado correctamente");
          initMap();
        };

        script.onerror = (e) => {
          console.error("❌ Error al cargar Google Maps:", e);
          setError(
            "Error al cargar Google Maps. Verifica tu API key y conexión."
          );
          setLoading(false);
        };

        document.head.appendChild(script);
      } catch (err) {
        console.error("❌ Error en loadGoogleMaps:", err);
        setError(err.message);
        setLoading(false);
      }
    };

    const initMap = () => {
      try {
        if (!window.google?.maps) {
          setError("Google Maps no está disponible");
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

        // ✅ CORRECCIÓN: Evento drag end - ahora es async
        marker.addListener("dragend", async () => {
          const position = marker.getPosition();
          const coords = {
            lat: position.lat(),
            lng: position.lng(),
          };

          // Primero obtenemos la data del geocoding
          const geocodeData = await reverseGeocode(coords);
          
          // Luego llamamos onChange con TODO junto
          onChange({
            latitude: coords.lat,
            longitude: coords.lng,
            ...geocodeData, // Incluye address, city, postalCode, state, etc.
          });
        });

        // ✅ CORRECCIÓN: Click en el mapa - ahora es async
        map.addListener("click", async (e) => {
          const coords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          marker.setPosition(e.latLng);

          // Primero obtenemos la data del geocoding
          const geocodeData = await reverseGeocode(coords);
          
          // Luego llamamos onChange con TODO junto
          onChange({
            latitude: coords.lat,
            longitude: coords.lng,
            ...geocodeData,
          });
        });

        // Geocode inicial
        if (value) {
          reverseGeocode(value);
        }

        setLoading(false);
        console.log("✅ Mapa inicializado correctamente");
      } catch (err) {
        console.error("❌ Error al inicializar mapa:", err);
        setError("Error al inicializar el mapa: " + err.message);
        setLoading(false);
      }
    };

    // ✅ CORRECCIÓN: reverseGeocode ahora RETORNA los datos parseados
    const reverseGeocode = async (coords) => {
      try {
        if (!window.google?.maps) return null;

        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({ location: coords });
        
        if (response.results[0]) {
          const result = response.results[0];
          setAddress(result.formatted_address);
          
          // Parsear y RETORNAR los componentes
          const parsedAddress = parseAddressComponents(result.address_components);
          
          return {
            formatted_address: result.formatted_address,
            ...parsedAddress,
          };
        }
        
        return null;
      } catch (err) {
        console.error("❌ Error en geocoding:", err);
        setAddress("No se pudo obtener la dirección");
        return null;
      }
    };

    loadGoogleMaps();

    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [apiKey]);

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError("Geolocalización no disponible en tu navegador");
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };

        if (googleMapInstanceRef.current && markerRef.current) {
          googleMapInstanceRef.current.setCenter(coords);
          markerRef.current.setPosition(coords);

          // ✅ CORRECCIÓN: Primero geocode, luego onChange
          const geocoder = new window.google.maps.Geocoder();
          
          try {
            const response = await geocoder.geocode({ location: coords });
            
            if (response.results[0]) {
              const result = response.results[0];
              setAddress(result.formatted_address);
              
              const parsedAddress = parseAddressComponents(
                result.address_components
              );
              
              // Llamar onChange con TODO junto
              onChange({
                latitude: coords.lat,
                longitude: coords.lng,
                formatted_address: result.formatted_address,
                ...parsedAddress,
              });
            }
          } catch (err) {
            console.error("Error en geocoding:", err);
          } finally {
            setLoading(false);
          }
        }
      },
      (error) => {
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
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
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
        Arrastra el marcador o haz clic en el mapa para seleccionar ubicación
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