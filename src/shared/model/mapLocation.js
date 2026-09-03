export const DEFAULT_MAP_CENTER = { lat: 19.4326, lng: -99.1332 };

const coordinateValue = (value, fallback) => {
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : fallback;
};

export const toMapCoordinates = (value) => ({
  lat: coordinateValue(value?.lat ?? value?.latitude, DEFAULT_MAP_CENTER.lat),
  lng: coordinateValue(value?.lng ?? value?.longitude, DEFAULT_MAP_CENTER.lng),
});

export const hasLocationCoordinates = (value) => {
  const rawLatitude = value?.lat ?? value?.latitude;
  const rawLongitude = value?.lng ?? value?.longitude;
  if (rawLatitude === "" || rawLatitude == null || rawLongitude === "" || rawLongitude == null) {
    return false;
  }
  const latitude = Number(rawLatitude);
  const longitude = Number(rawLongitude);
  return Number.isFinite(latitude) && Number.isFinite(longitude);
};

export const getLocationAddress = (value) => (
  value?.formatted_address || value?.address || ""
);

export const toPublishedLocation = (coords, geocodeData = null) => ({
  latitude: Number(coords.lat),
  longitude: Number(coords.lng),
  ...(geocodeData || {}),
});

export const getLocationErrorMessage = (error) => ({
  1: "Permiso de ubicación denegado",
  2: "Ubicación no disponible",
  3: "Tiempo de espera agotado",
}[error?.code] || error?.message || "No se pudo obtener tu ubicación");
