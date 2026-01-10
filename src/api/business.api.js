import apiClient from "./config";

export const businessAPI = {
  getAll: () => apiClient.get("/api/business"),
  getById: (id) => apiClient.get(`/api/business/${id}`),
  create: (data) => apiClient.post("/api/business", data),
  update: (id, data) => apiClient.put(`/api/business/${id}`, data),
  getMenu: (id) => apiClient.get(`/api/business/${id}/menu`),
  getByOwner: (ownerId) => apiClient.get(`/api/business/owner/${ownerId}`),
};
