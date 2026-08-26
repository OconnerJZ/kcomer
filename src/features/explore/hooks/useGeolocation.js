import { useEffect, useState } from "react";
import { axiosGet } from "@Shared/api/http/baseQuery";
import { API_KEY_MAPS } from "@Shared/config/env";

const errorCallback = (error) => {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      return "Permiso denegado para obtener la ubicación";
    case error.POSITION_UNAVAILABLE:
      return "Ubicación no disponible";
    case error.TIMEOUT:
      return "Tiempo de espera agotado para obtener la ubicación";
    default:
      return "Se produjo un error desconocido";
  }
};

const getAddress = async (location) => {
  try {
    const uri = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${location?.latitude},${location?.longitude}&key=${API_KEY_MAPS}`;
    const data = await axiosGet({ url: uri });
    if (data?.status === "ZERO_RESULTS") return "";
    const results = data?.results?.[0];
    const splitAddress = results?.formatted_address?.split(",") || [];
    return `${splitAddress[1]?.trim() || ""}, ${splitAddress[2]?.trim() || ""}`;
  } catch (err) {
    console.error("Error obteniendo dirección:", err);
    return "";
  }
};

export default function useGeolocation() {
  const [location, setLocation] = useState(null);
  const [error, setError] = useState(null);
  const [address, setAddress] = useState("");

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
      (err) => setError(errorCallback(err)),
    );
  }, []);

  useEffect(() => {
    if (!location) return;
    (async () => setAddress(await getAddress(location)))();
  }, [location]);

  return { location, error, address };
}
