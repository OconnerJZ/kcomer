const asCoordinate = (value) => {
  if (value === null || value === undefined || value === "") return null;
  const coordinate = Number(value);
  return Number.isFinite(coordinate) ? coordinate : null;
};

const radians = (degrees) => degrees * (Math.PI / 180);

export const distanceBetweenKm = (from = {}, to = {}) => {
  const origin = from || {};
  const destination = to || {};
  const fromLat = asCoordinate(origin.latitude ?? origin.lat);
  const fromLng = asCoordinate(origin.longitude ?? origin.lng);
  const toLat = asCoordinate(destination.latitude ?? destination.lat);
  const toLng = asCoordinate(destination.longitude ?? destination.lng);
  if ([fromLat, fromLng, toLat, toLng].some((value) => value === null)) return null;

  const earthRadiusKm = 6371;
  const deltaLat = radians(toLat - fromLat);
  const deltaLng = radians(toLng - fromLng);
  const value = Math.sin(deltaLat / 2) ** 2
    + Math.cos(radians(fromLat)) * Math.cos(radians(toLat)) * Math.sin(deltaLng / 2) ** 2;
  return earthRadiusKm * 2 * Math.atan2(Math.sqrt(value), Math.sqrt(1 - value));
};

export const distanceLabel = (from, to) => {
  const distance = distanceBetweenKm(from, to);
  if (distance === null) return "";
  return distance < 1 ? `A ${Math.round(distance * 1000)} m` : `A ${distance.toFixed(1)} km`;
};

export const foodTypeLabels = (business = {}) =>
  (business.tags || business.foodTypes || [])
    .map((item) => typeof item === "string" ? item : item?.label || item?.name || item?.value || "")
    .filter(Boolean);
