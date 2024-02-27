import { useState, useEffect } from "react";

function errorCallback(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Permiso denegado para obtener la ubicación"
    case error.POSITION_UNAVAILABLE:
      return "Ubicación no disponible"
    case error.TIMEOUT:
      return "Tiempo de espera agotado para obtener la ubicación"
    case error.UNKNOWN_ERROR:
      return "Se produjo un error desconocido"
    default:
      return "Se produjo un error no identificado"
  }
}

function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      setError("La geolocalización no está disponible en este navegador");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        setError(() => errorCallback(error));
      }
    );
  }, []);

  return { location, error };
}

export default useGeolocation;
