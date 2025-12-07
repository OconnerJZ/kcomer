// src/services/apiService.js
import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'https://api.qscome.com.mx';

const apiClient = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000,
});

// Interceptor para agregar token si existe
apiClient.interceptors.request.use((config) => {
  const user = localStorage.getItem('qscome_user');
  if (user) {
    const userData = JSON.parse(user);
    if (userData.token) {
      config.headers.Authorization = `Bearer ${userData.token}`;
    }
  }
  return config;
});

// Interceptor para manejar errores
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem('qscome_user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ============== USUARIOS ==============
export const userAPI = {
  getAll: () => apiClient.get('/api/users'),
  getById: (id) => apiClient.get(`/api/users/${id}`),
  create: (data) => apiClient.post('/api/users', data),
  update: (id, data) => apiClient.put(`/api/users/${id}`, data),
  login: (credentials) => apiClient.post('/api/auth/login', credentials),
  register: (data) => apiClient.post('/api/auth/register', data),
};

// ============== NEGOCIOS ==============
export const businessAPI = {
  getAll: () => apiClient.get('/api/business'),
  getById: (id) => apiClient.get(`/api/business/${id}`),
  create: (data) => apiClient.post('/api/business', data),
  update: (id, data) => apiClient.put(`/api/business/${id}`, data),
  getMenu: (id) => apiClient.get(`/api/business/${id}/menu`),
};

// ============== ÓRDENES ==============
export const orderAPI = {
  getAll: () => apiClient.get('/api/orders'),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  getByUser: (userId) => apiClient.get(`/api/orders/user/${userId}`),
  getByBusiness: (businessId) => apiClient.get(`/api/orders/business/${businessId}`),
  create: (data) => apiClient.post('/api/orders', data),
  updateStatus: (id, status) => apiClient.patch(`/api/orders/${id}/status`, { status }),
};

// ============== MENÚ ==============
export const menuAPI = {
  getAll: () => apiClient.get('/api/menus'),
  getById: (id) => apiClient.get(`/api/menus/${id}`),
  getByBusiness: (businessId) => apiClient.get(`/api/menus/business/${businessId}`),
  create: (data) => apiClient.post('/api/menus', data),
  update: (id, data) => apiClient.put(`/api/menus/${id}`, data),
};

// ============== PAGOS ==============
export const paymentAPI = {
  create: (data) => apiClient.post('/api/payments', data),
  verify: (id) => apiClient.get(`/api/payments/${id}/verify`),
};

// ============== UPLOAD DE ARCHIVOS ==============
export const uploadAPI = {
  uploadImage: async (file) => {
    const formData = new FormData();
    formData.append('image', file);
    return apiClient.post('/api/upload/image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
  },
};

export default apiClient;