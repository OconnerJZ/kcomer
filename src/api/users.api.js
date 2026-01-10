import apiClient from "./config";

export const usersAPI = {
  getAll: () => apiClient.get("/api/users"),
  getById: (id) => apiClient.get(`/api/users/${id}`),
  update: (id, data) => apiClient.put(`/api/users/${id}`, data),
  delete: (id) => apiClient.delete(`/api/users/${id}`),
};
