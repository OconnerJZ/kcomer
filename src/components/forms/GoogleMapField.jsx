// src/components/forms/GoogleMapField.jsx
import { useEffect, useRef, useState } from 'react';
import { Box, Typography, TextField, Paper, CircularProgress, Alert } from '@mui/material';
import { MyLocation } from '@mui/icons-material';
import PropTypes from 'prop-types';

const GoogleMapField = ({ value, onChange, label, apiKey }) => {
  const mapRef = useRef(null);
  const markerRef = useRef(null);
  const googleMapInstanceRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [address, setAddress] = useState('');
  const [error, setError] = useState(null);

  useEffect(() => {
    // Validar API key
    if (!apiKey || apiKey === '' || apiKey === 'undefined') {
      setError('API Key de Google Maps no configurada. Revisa tu archivo .env');
      setLoading(false);
      return;
    }

    const loadGoogleMaps = () => {
      try {
        // Verificar si ya está cargado
        if (window.google?.maps) {
          initMap();
          return;
        }

        // Verificar si el script ya está en el DOM
        const existingScript = document.querySelector(
          'script[src*="maps.googleapis.com"]'
        );
        
        if (existingScript) {
          existingScript.addEventListener('load', initMap);
          return;
        }

        // Cargar script
        const script = document.createElement('script');
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.defer = true;
        
        script.onload = () => {
          console.log('✅ Google Maps cargado correctamente');
          initMap();
        };
        
        script.onerror = (e) => {
          console.error('❌ Error al cargar Google Maps:', e);
          setError('Error al cargar Google Maps. Verifica tu API key y conexión.');
          setLoading(false);
        };
        
        document.head.appendChild(script);
      } catch (err) {
        console.error('❌ Error en loadGoogleMaps:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    const initMap = () => {
      try {
        if (!window.google?.maps) {
          setError('Google Maps no está disponible');
          setLoading(false);
          return;
        }

        if (!mapRef.current) {
          setError('Referencia del mapa no disponible');
          setLoading(false);
          return;
        }

        const defaultCenter = value || { lat: 19.4326, lng: -99.1332 }; // CDMX

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
          title: 'Arrastra para cambiar ubicación'
        });

        markerRef.current = marker;

        // Evento drag end
        marker.addListener('dragend', () => {
          const position = marker.getPosition();
          const coords = {
            lat: position.lat(),
            lng: position.lng(),
          };
          onChange(coords);
          reverseGeocode(coords);
        });

        // Click en el mapa
        map.addListener('click', (e) => {
          const coords = {
            lat: e.latLng.lat(),
            lng: e.latLng.lng(),
          };
          marker.setPosition(e.latLng);
          onChange(coords);
          reverseGeocode(coords);
        });

        // Geocode inicial
        if (value) {
          reverseGeocode(value);
        }

        setLoading(false);
        console.log('✅ Mapa inicializado correctamente');
      } catch (err) {
        console.error('❌ Error al inicializar mapa:', err);
        setError('Error al inicializar el mapa: ' + err.message);
        setLoading(false);
      }
    };

    const reverseGeocode = async (coords) => {
      try {
        if (!window.google?.maps) return;

        const geocoder = new window.google.maps.Geocoder();
        const response = await geocoder.geocode({ location: coords });
        
        if (response.results[0]) {
          setAddress(response.results[0].formatted_address);
        }
      } catch (err) {
        console.error('❌ Error en geocoding:', err);
        setAddress('No se pudo obtener la dirección');
      }
    };

    loadGoogleMaps();

    // Cleanup
    return () => {
      if (markerRef.current) {
        markerRef.current.setMap(null);
      }
    };
  }, [apiKey]); // Solo depende de apiKey

  const handleGetCurrentLocation = () => {
    if (!navigator.geolocation) {
      setError('Geolocalización no disponible en tu navegador');
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        
        // Actualizar mapa y marker
        if (googleMapInstanceRef.current && markerRef.current) {
          googleMapInstanceRef.current.setCenter(coords);
          markerRef.current.setPosition(coords);
          onChange(coords);
          
          // Geocode para obtener dirección
          const geocoder = new window.google.maps.Geocoder();
          geocoder.geocode({ location: coords }, (results, status) => {
            if (status === 'OK' && results[0]) {
              setAddress(results[0].formatted_address);
            }
            setLoading(false);
          });
        }
      },
      (error) => {
        console.error('❌ Error de geolocalización:', error);
        let errorMsg = 'No se pudo obtener la ubicación';
        
        switch(error.code) {
          case error.PERMISSION_DENIED:
            errorMsg = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMsg = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMsg = 'Tiempo de espera agotado';
            break;
        }
        
        setError(errorMsg);
        setLoading(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
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
          {error.includes('API Key') && (
            <Typography variant="caption" sx={{ display: 'block', mt: 1 }}>
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

      {/* Campo de dirección */}
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
                cursor: 'pointer',
                '&:hover': { color: 'primary.main' }
              }}
              onClick={handleGetCurrentLocation}
              titleAccess="Obtener mi ubicación actual"
            />
          ),
        }}
        sx={{ mb: 2 }}
      />

      {/* Coordenadas */}
      {value && (
        <Typography 
          variant="caption" 
          color="text.secondary" 
          sx={{ mb: 1, display: 'block' }}
        >
          📍 Lat: {value.lat.toFixed(6)}, Lng: {value.lng.toFixed(6)}
        </Typography>
      )}

      {/* Mapa */}
      <Paper
        elevation={3}
        sx={{
          width: '100%',
          height: 400,
          borderRadius: 2,
          overflow: 'hidden',
          position: 'relative',
          bgcolor: loading ? 'grey.100' : 'transparent'
        }}
      >
        <Box
          ref={mapRef}
          sx={{
            width: '100%',
            height: '100%',
          }}
        />
        
        {loading && (
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              bgcolor: 'rgba(255,255,255,0.9)',
              p: 3,
              borderRadius: 2,
            }}
          >
            <CircularProgress sx={{ mb: 2 }} />
            <Typography variant="body2">
              Cargando mapa...
            </Typography>
          </Box>
        )}
      </Paper>

      <Typography 
        variant="caption" 
        color="text.secondary" 
        sx={{ mt: 1, display: 'block' }}
      >
        💡 Arrastra el marcador o haz clic en el mapa para seleccionar ubicación
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
  label: 'Ubicación en mapa',
  value: null,
};

export default GoogleMapField;