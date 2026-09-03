const normalizeUrl = (value = "") => String(value).trim().replace(/\/$/, "");
const defaultApiUrl = import.meta.env.PROD
  ? "https://api.qscome.com.mx"
  : "http://localhost:3000";

export const API_URL_SERVER = normalizeUrl(
  import.meta.env.VITE_API_URL || defaultApiUrl,
);
export const API_URL_MEDIA_SERVER = normalizeUrl(
  import.meta.env.VITE_MEDIA_URL || `${API_URL_SERVER}/uploads`,
);
export const API_KEY_MAPS = String(
  import.meta.env.VITE_REACT_API_KEY_MAPS || "",
).trim();
export const GOOGLE_CLIENT_ID = String(
  import.meta.env.VITE_GOOGLE_CLIENT_ID || "",
).trim();
