import apiClient from "./config";

export const menuAPI = {
  getAll: () => apiClient.get("/api/menus"),
  getById: (id) => apiClient.get(`/api/menus/${id}`),
  getByBusiness: (businessId) =>
    apiClient.get(`/api/menus/business/${businessId}`),

  create: (data) => apiClient.post("/api/menus", data),
  update: (id, data) => apiClient.put(`/api/menus/${id}`, data),
  delete: (id) => apiClient.delete(`/api/menus/${id}`),

  toggleAvailability: (id) =>
    apiClient.patch(`/api/menus/${id}/toggle-availability`),
};