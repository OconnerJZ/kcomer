import { useEffect, useRef, useState } from "react";
import { Box, Container, Typography, TextField, Paper } from "@mui/material";

const GoogleMapCanvas = ({ apiKey }) => {
  const mapRef = useRef(null);
  const [coords, setCoords] = useState("");
  const [address, setAddress] = useState("Buscando dirección...");
  const [error, setError] = useState(null);

  useEffect(() => {
    let map, marker;

    const format = (lat, lng) => `(${lat.toFixed(6)}, ${lng.toFixed(6)})`;

    const getUserLocation = () =>
      new Promise((resolve) => {
        if (!navigator.geolocation) return resolve({ lat: -10, lng: -60 });
        navigator.geolocation.getCurrentPosition(
          (pos) =>
            resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
          () => resolve({ lat: -10, lng: -60 })
        );
      });

    const loadScript = (src) =>
      new Promise((resolve, reject) => {
        if (document.querySelector(`script[src='${src}']`)) return resolve();
        const s = document.createElement("script");
        s.src = src;
        s.async = true;
        s.onload = resolve;
        s.onerror = reject;
        document.body.appendChild(s);
      });

    const reverseGeocode = async (lat, lng) => {
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lng}`
        );
        const data = await res.json();
        setAddress(data.display_name || "Dirección no encontrada");
      } catch {
        setAddress("Error obteniendo dirección");
      }
    };

    (async () => {
      const center = await getUserLocation();

      if (apiKey) {
        try {
          await loadScript(
            `https://maps.googleapis.com/maps/api/js?key=${apiKey}`
          );
          map = new window.google.maps.Map(mapRef.current, {
            center,
            zoom: 15,
          });
          marker = new window.google.maps.Marker({
            position: center,
            map,
            draggable: true,
          });

          marker.addListener("dragend", () => {
            const pos = marker.getPosition();
            const lat = pos.lat();
            const lng = pos.lng();
            setCoords(format(lat, lng));
            reverseGeocode(lat, lng);
          });

          setCoords(format(center.lat, center.lng));
          reverseGeocode(center.lat, center.lng);
        } catch (e) {
          setError("Google Maps failed, fallback not implemented.");
        }
      } else {
        setError("API key missing. Cannot load Google Maps.");
      }
    })();
  }, [apiKey]);

  return (
    <Container maxWidth="md" sx={{ mt: 3 }}>
      <Paper sx={{ p: 3, borderRadius: 3 }}>
        <Typography variant="h6" gutterBottom>
          Mapa Interactivo
        </Typography>
        <TextField
          label="Coordenadas"
          fullWidth
          value={coords}
          InputProps={{ readOnly: true }}
          sx={{ mb: 2 }}
        />
        <Box
          ref={mapRef}
          sx={{
            width: "100%",
            height: 400,
            borderRadius: 2,
            overflow: "hidden",
          }}
        />
        <Typography variant="body2" sx={{ mt: 2 }}>
          Dirección: {address}
        </Typography>
        {error && (
          <Typography variant="body2" color="error" sx={{ mt: 1 }}>
            {error}
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

export default GoogleMapCanvas;
