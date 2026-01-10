import { API_URL_SERVER } from "@Utils/enviroments";
import axios from "axios";

export const apiClient = axios.create({
  baseURL: API_URL_SERVER,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

// Interceptor para agregar token si existe
apiClient.interceptors.request.use((config) => {
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

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const originalUrl = error?.config?.url;
    const status = error?.response?.status;

    // Errores de red (sin respuesta)
    if (!error.response) {
      console.error("Network error:", error.message);
      // Mostrar notificación al usuario
      if (globalThis.showNetworkError) {
        globalThis.showNetworkError("No hay conexión a internet");
      }
      const networkError = new Error(
        "Error de conexión. Verifica tu internet."
      );
      networkError.type = "network";

      return Promise.reject(networkError);
    }

    // 401 - Token expirado
    if (status === 401 && originalUrl?.includes("/login")) {
      return Promise.reject(error);
    }

    if (status === 401) {
      localStorage.removeItem("qscome_user");
      globalThis.location.href = "/login";
    }

    // 403 - Forbidden
    if (status === 403) {
      console.error("Forbidden:", originalUrl);
    }

    // 500 - Server error
    if (status >= 500) {
      console.error("Server error:", status, originalUrl);
    }

    return Promise.reject(error);
  }
);

export const handleApiError = (error) => {
  if (error.response) {
    return {
      success: false,
      message: error.response.data?.message || "Error del servidor",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    return {
      success: false,
      message: "No se pudo conectar con el servidor. Verifica tu conexión.",
      status: 0,
    };
  } else {
    return {
      success: false,
      message: error.message || "Error desconocido",
      status: -1,
    };
  }
};

// Helper para retry automático
export const apiWithRetry = async (apiCall, maxRetries = 3) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }

  throw lastError;
};

export default apiClient;
