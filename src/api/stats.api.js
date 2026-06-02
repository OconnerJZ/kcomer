import { api, createEndpointBuilder } from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

const statsEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    getBusinessStats: endpoint("stats", "getAll", {
      dynamicPath: ({ businessId, period = 7 }) => 
        `${ENDPOINTS.stats.business}/${businessId}?period=${period}`,
      getCacheKey: ({ businessId, period = 7 }) => `${businessId}-${period}`,
    }),

    getDashboardSummary: endpoint("stats-summary", "getAll", {
      dynamicPath: ({ businessId }) => 
        `${ENDPOINTS.stats.business}/${businessId}/summary`,
      getCacheKey: ({ businessId }) => businessId,
    }),

    getRevenueByPeriod: endpoint("stats-revenue", "getAll", {
      dynamicPath: ({ businessId, startDate, endDate }) => 
        `${ENDPOINTS.stats.business}/${businessId}/revenue?startDate=${startDate}&endDate=${endDate}`,
      getCacheKey: ({ businessId, startDate, endDate }) => 
        `${businessId}-${startDate}-${endDate}`,
    }),
  };
};

const apiStats = api.injectEndpoints({
  endpoints: statsEndpoints,
  overrideExisting: false,
});

export const {
  useGetBusinessStatsQuery,
  useGetDashboardSummaryQuery,
  useGetRevenueByPeriodQuery,
} = apiStats;