import apiClient from "./config";

export const reviewsAPI = {
  getByBusiness: (businessId) =>
    apiClient.get(`/api/reviews/business/${businessId}`),
  create: (data) => apiClient.post("/api/reviews", data),
  update: (id, data) => apiClient.put(`/api/reviews/${id}`, data),
  delete: (id) => apiClient.delete(`/api/reviews/${id}`),
};