import apiClient from "./config";

export const statsAPI = {
  getBusinessStats: (businessId, period = 7) =>
    apiClient.get(`/api/stats/business/${businessId}`, { params: { period } }),

  // Nuevos endpoints útiles
  getDashboardSummary: (businessId) =>
    apiClient.get(`/api/stats/business/${businessId}/summary`),

  getRevenueByPeriod: (businessId, startDate, endDate) =>
    apiClient.get(`/api/stats/business/${businessId}/revenue`, {
      params: { startDate, endDate },
    }),
};