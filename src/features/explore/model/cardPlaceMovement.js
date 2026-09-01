export const resolveExploreMediaUrl = (value = "", mediaBaseUrl = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${mediaBaseUrl.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
};

export const buildBusinessMapsEmbedUrl = (location = {}) => {
  const query = location.latitude && location.longitude
    ? `${location.latitude},${location.longitude}`
    : location.address;
  return query
    ? `https://www.google.com/maps?q=${encodeURIComponent(query)}&output=embed`
    : "";
};

export const getBusinessPhotoUrls = (business = {}, mediaBaseUrl = "") => (
  (business.photos || [])
    .map((photo) => typeof photo === "string"
      ? photo
      : photo?.url || photo?.image || photo?.imageUrl)
    .map((photo) => resolveExploreMediaUrl(photo, mediaBaseUrl))
    .filter(Boolean)
);
