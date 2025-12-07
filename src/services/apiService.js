// src/services/apiService.js
import { API_URL_SERVER } from "@Utils/enviroments";
import axios from "axios";

const API_URL = API_URL_SERVER || "http://localhost:3000";

const apiClient = axios.create({
  baseURL: API_URL,
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
    if (status === 401 && originalUrl?.includes("/login")) {
      return Promise.reject(error); // lo manejas en el formulario
    }
    if (status === 401) {
      // Token expirado o inválido
      localStorage.removeItem("qscome_user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ============== USUARIOS ==============
export const userAPI = {
  getAll: () => apiClient.get("/api/users"),
  getById: (id) => apiClient.get(`/api/users/${id}`),
  update: (id, data) => apiClient.put(`/api/users/${id}`, data),
  delete: (id) => apiClient.delete(`/api/users/${id}`),
};

// ============== AUTENTICACIÓN ==============
export const authAPI = {
  login: (credentials) => apiClient.post("/api/auth/login", credentials),
  register: (data) => apiClient.post("/api/auth/register", data),
  getMe: () => apiClient.get("/api/auth/me"),
  loginGoogle: () => apiClient.post("/api/auth/google"),
  loginFacebook: () => apiClient.post("/api/auth/facebook"),
};

// ============== NEGOCIOS ==============
export const businessAPI = {
  getAll: () => apiClient.get("/api/business"),
  getById: (id) => apiClient.get(`/api/business/${id}`),
  create: (data) => apiClient.post("/api/business", data),
  update: (id, data) => apiClient.put(`/api/business/${id}`, data),
  getMenu: (id) => apiClient.get(`/api/business/${id}/menu`),
};

// ============== ÓRDENES ==============
export const orderAPI = {
  getAll: () => apiClient.get("/api/orders"),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  getByUser: (userId) => apiClient.get(`/api/orders/user/${userId}`),
  getByBusiness: (businessId) =>
    apiClient.get(`/api/orders/business/${businessId}`),
  create: (data) => apiClient.post("/api/orders", data),
  updateStatus: (id, status) =>
    apiClient.patch(`/api/orders/${id}/status`, { status }),
};

// ============== MENÚ ==============
export const menuAPI = {
  getAll: () => apiClient.get("/api/menus"),
  getById: (id) => apiClient.get(`/api/menus/${id}`),
  getByBusiness: (businessId) =>
    apiClient.get(`/api/menus/business/${businessId}`),
  create: (data) => apiClient.post("/api/menus", data),
  update: (id, data) => apiClient.put(`/api/menus/${id}`, data),
  delete: (id) => apiClient.delete(`/api/menus/${id}`),
};

// ============== PAGOS ==============
export const paymentAPI = {
  create: (data) => apiClient.post("/api/payments", data),
  verify: (id) => apiClient.get(`/api/payments/${id}/verify`),
};

// ============== UPLOAD DE ARCHIVOS ==============
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("image", file);
    return apiClient.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
};

// Helper para manejar errores de API
export const handleApiError = (error) => {
  if (error.response) {
    // El servidor respondió con un código de error
    return {
      success: false,
      message: error.response.data?.message || "Error del servidor",
      status: error.response.status,
      data: error.response.data,
    };
  } else if (error.request) {
    // La petición se hizo pero no hubo respuesta
    return {
      success: false,
      message: "No se pudo conectar con el servidor",
      status: 0,
    };
  } else {
    // Algo pasó al configurar la petición
    return {
      success: false,
      message: error.message || "Error desconocido",
      status: -1,
    };
  }
};

export default apiClient;
