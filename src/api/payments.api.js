import apiClient from "./config";

export const paymentsAPI = {
  create: (data) => apiClient.post("/api/payments", data),
  verify: (id) => apiClient.get(`/api/payments/${id}/verify`),

  // Nuevos métodos para pasarela real (cuando se integre)
  createPaymentIntent: (data) => apiClient.post("/api/payments/intent", data),
  confirmPayment: (id, data) =>
    apiClient.post(`/api/payments/${id}/confirm`, data),
};
