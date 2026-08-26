import { api, createEndpointBuilder } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const statsEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    getBusinessStats: endpoint("stats", "getAll", {
      dynamicPath: ({ businessId, period = 7 }) =>
        `${ENDPOINTS.stats.business}/${businessId}?period=${period}`,
      tagType: "Stats",
    }),

    getDashboardSummary: endpoint("stats-summary", "getAll", {
      dynamicPath: ({ businessId }) =>
        `${ENDPOINTS.stats.business}/${businessId}/summary`,
      tagType: "Stats",
    }),

    getRevenueByPeriod: endpoint("stats-revenue", "getAll", {
      dynamicPath: ({ businessId, startDate, endDate }) =>
        `${ENDPOINTS.stats.business}/${businessId}/revenue?startDate=${startDate}&endDate=${endDate}`,
      tagType: "Stats",
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
