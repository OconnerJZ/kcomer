import apiClient from "./config";

export const ordersAPI = {
  getAll: () => apiClient.get("/api/orders"),
  getById: (id) => apiClient.get(`/api/orders/${id}`),
  getByUser: (userId) => apiClient.get(`/api/orders/user/${userId}`),
  getByBusiness: (businessId) =>
    apiClient.get(`/api/orders/business/${businessId}`),

  create: (data) => apiClient.post("/api/orders", data),

  updateStatus: (id, status, note = "") =>
    apiClient.patch(`/api/orders/${id}/status`, { status, note }),
  
  cancel: (id, reason = "") =>
    apiClient.patch(`/api/orders/${id}/status`, {
      status: "cancelled",
      note: reason,
    }),
};
