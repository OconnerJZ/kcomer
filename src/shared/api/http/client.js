import { API_URL_SERVER } from "@Shared/config/env";
import axios from "axios";

const client = axios.create({
  baseURL: API_URL_SERVER,
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
});

client.interceptors.request.use((config) => {
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

client.interceptors.response.use(
  (response) => response,
  (error) => {
    if (!error.response) {
      error.isNetworkError = true;
      error.friendlyMessage = "El servicio no está disponible. Intenta más tarde.";
    } else {
      error.friendlyMessage =
        error.response?.data?.message || "Ocurrió un error en el servidor.";

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
  },
);

export default client;
