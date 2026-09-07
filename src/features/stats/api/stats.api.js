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
    getCustomerIntelligence: builder.query({
      query: ({ businessId, period = 30 }) =>
        `${ENDPOINTS.stats.business}/${businessId}/customers?period=${period}`,
      providesTags: (_result, _error, { businessId, period }) => [
        { type: "Stats", id: `customers-${businessId}-${period}` },
      ],
    }),
  };
};

const apiStats = api.injectEndpoints({
  endpoints: statsEndpoints,
  overrideExisting: false,
});

export const { useGetBusinessStatsQuery, useGetCustomerIntelligenceQuery } = apiStats;
