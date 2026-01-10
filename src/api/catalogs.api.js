import apiClient from "./config";

export const catalogsAPI = {
  getFoodTypes: () => apiClient.get("/api/catalogs/food-types"),

  // Nuevos catálogos útiles
  getCategories: () => apiClient.get("/api/catalogs/categories"),
  getPaymentMethods: () => apiClient.get("/api/catalogs/payment-methods"),
};
