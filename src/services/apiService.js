// src/services/apiService.js - VERSIÓN COMPLETA
import { API_URL_SERVER } from "@Utils/enviroments";
import axios from "axios";

const apiClient = axios.create({
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
    
    if (status === 401 && originalUrl?.includes("/login")) {
      return Promise.reject(error);
    }
    
    if (status === 401) {
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
  loginGoogle: (idToken) => apiClient.post("/api/auth/google", idToken),
  loginFacebook: () => apiClient.post("/api/auth/facebook"),
};

// ============== NEGOCIOS ==============
export const businessAPI = {
  getAll: () => apiClient.get("/api/business"),
  getById: (id) => apiClient.get(`/api/business/${id}`),
  create: (data) => apiClient.post("/api/business", data),
  update: (id, data) => apiClient.put(`/api/business/${id}`, data),
  getMenu: (id) => apiClient.get(`/api/business/${id}/menu`),
  
  // Nuevo: Obtener negocios por owner
  getByOwner: (ownerId) => apiClient.get(`/api/business/owner/${ownerId}`),
};

// ============== ÓRDENES ==============
export const orderAPI = {
  getAll: () => apiClient.get("/api/orders"),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  getByUser: (userId) => apiClient.get(`/api/orders/user/${userId}`),
  getByBusiness: (businessId) => apiClient.get(`/api/orders/business/${businessId}`),
  
  create: (data) => apiClient.post("/api/orders", data),
  
  // CORREGIDO: Enviar status en el body
  updateStatus: (id, status, note = '') => 
    apiClient.patch(`/api/orders/${id}/status`, { status, note }),
  
  // Nuevo: Cancelar orden
  cancel: (id, reason = '') => 
    apiClient.patch(`/api/orders/${id}/status`, { 
      status: 'cancelled', 
      note: reason 
    }),
};

// ============== MENÚ ==============
export const menuAPI = {
  getAll: () => apiClient.get("/api/menus"),
  getById: (id) => apiClient.get(`/api/menus/${id}`),
  getByBusiness: (businessId) => apiClient.get(`/api/menus/business/${businessId}`),
  
  create: (data) => apiClient.post("/api/menus", data),
  update: (id, data) => apiClient.put(`/api/menus/${id}`, data),
  delete: (id) => apiClient.delete(`/api/menus/${id}`),
  
  // Nuevo: Toggle disponibilidad
  toggleAvailability: (id) => 
    apiClient.patch(`/api/menus/${id}/toggle-availability`),
};

// ============== PAGOS ==============
export const paymentAPI = {
  create: (data) => apiClient.post("/api/payments", data),
  verify: (id) => apiClient.get(`/api/payments/${id}/verify`),
  
  // Nuevos métodos para pasarela real (cuando se integre)
  createPaymentIntent: (data) => apiClient.post("/api/payments/intent", data),
  confirmPayment: (id, data) => apiClient.post(`/api/payments/${id}/confirm`, data),
};

// ============== ESTADÍSTICAS ==============
export const statsAPI = {
  getBusinessStats: (businessId, period = 7) => 
    apiClient.get(`/api/stats/business/${businessId}`, { params: { period } }),
  
  // Nuevos endpoints útiles
  getDashboardSummary: (businessId) => 
    apiClient.get(`/api/stats/business/${businessId}/summary`),
  
  getRevenueByPeriod: (businessId, startDate, endDate) =>
    apiClient.get(`/api/stats/business/${businessId}/revenue`, {
      params: { startDate, endDate }
    }),
};

// ============== UPLOAD DE ARCHIVOS ==============
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append("file", file);
    return apiClient.post("/api/upload/image", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
  // Nuevo: Upload múltiple
  uploadMultiple: async (files) => {
    const formData = new FormData();
    files.forEach((file, index) => {
      formData.append(`files`, file);
    });
    return apiClient.post("/api/upload/multiple", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  
  // Nuevo: Eliminar imagen
  deleteImage: (filename) => apiClient.delete(`/api/upload/image/${filename}`),
};

// ============== CATÁLOGOS ==============
export const catalogAPI = {
  getFoodTypes: () => apiClient.get("/api/catalogs/food-types"),
  
  // Nuevos catálogos útiles
  getCategories: () => apiClient.get("/api/catalogs/categories"),
  getPaymentMethods: () => apiClient.get("/api/catalogs/payment-methods"),
};

// ============== NOTIFICACIONES (para implementar WebSockets) ==============
export const notificationAPI = {
  getUnread: () => apiClient.get("/api/notifications/unread"),
  markAsRead: (id) => apiClient.patch(`/api/notifications/${id}/read`),
  markAllAsRead: () => apiClient.post("/api/notifications/mark-all-read"),
  
  // WebSocket connection (implementar después)
  connect: (userId) => {
    // TODO: Implementar Socket.io
    console.log('Connecting to WebSocket for user:', userId);
  },
};

// ============== RESEÑAS (para futuro) ==============
export const reviewAPI = {
  getByBusiness: (businessId) => apiClient.get(`/api/reviews/business/${businessId}`),
  create: (data) => apiClient.post("/api/reviews", data),
  update: (id, data) => apiClient.put(`/api/reviews/${id}`, data),
  delete: (id) => apiClient.delete(`/api/reviews/${id}`),
};

// Helper para manejar errores de API
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
        await new Promise(resolve => setTimeout(resolve, 1000 * (i + 1)));
      }
    }
  }
  
  throw lastError;
};

export default apiClient;