import { API_URL_SERVER } from "@Utils/enviroments";
import axios from "axios";
// import { decrypt, encrypt, getAccessToken } from "@Utils/auth";

const clienteAxios = axios.create({
  baseURL: API_URL_SERVER,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  // transformRequest: [(data) => encrypt({ data, crypto: true })],
  // transformResponse: [(data) => decrypt({ data, crypto: false })],
});
clienteAxios.interceptors.request.use((config) => {
  const user = localStorage.getItem("qscome_user");
  if (user) {
    try {
      const userData = JSON.parse(user);
      if (userData.token) {
        config.headers.Authorization = `Bearer ${userData.token}`;
      }
    } catch (error) {
      console.error("Error parsing user data:", error);
    }
  }
  return config;
});

clienteAxios.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      // Servidor caído, sin conexión, timeout, etc.
      error.isNetworkError = true;
      error.friendlyMessage = "El servicio no está disponible. Intenta más tarde.";
    } else {
      // Errores HTTP (500, 503, etc.)
      error.friendlyMessage =
        error.response?.data?.message || "Ocurrió un error en el servidor.";

      // Token rechazado/expirado: avisar a la app para cerrar sesión.
      // Solo si había sesión y no es un intento de login/registro (un 401 ahí
      // es "credenciales inválidas", no una sesión vencida).
      if (error.response.status === 401) {
        const hasSession = !!localStorage.getItem("qscome_user");
        const isAuthEndpoint = /\/auth\/(login|register|google)/.test(
          error.config?.url || "",
        );
        if (hasSession && !isAuthEndpoint) {
          window.dispatchEvent(new CustomEvent("auth:unauthorized"));
        }
      }
    }
    return Promise.reject(error);
  }
);

export default clienteAxios;