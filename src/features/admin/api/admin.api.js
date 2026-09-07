import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminBusinesses: builder.query({
      query: ({ q = "", limit = 20 } = {}) => ({
        url: ENDPOINTS.admin.businesses,
        params: { q, limit },
      }),
    }),
    getAdminBusinessPlan: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.admin.businesses}/${businessId}/plan`,
      providesTags: (_result, _error, { businessId }) => [{ type: "BusinessPlan", id: businessId }],
    }),
    getAdminBusinessPlanImpact: builder.query({
      query: ({ businessId, planCode }) => ({
        url: `${ENDPOINTS.admin.businesses}/${businessId}/plan/impact`,
        params: { planCode },
      }),
    }),
    getAdminBusinessPlanHistory: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.admin.businesses}/${businessId}/plan/history`,
      providesTags: (_result, _error, { businessId }) => [{ type: "BusinessPlan", id: `history-${businessId}` }],
    }),
    assignAdminBusinessPlan: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.admin.businesses}/${businessId}/plan`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [
        { type: "BusinessPlan", id: businessId },
        { type: "BusinessPlan", id: `history-${businessId}` },
      ],
    }),
    grantAdminBusinessPlanTrial: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.admin.businesses}/${businessId}/trial`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [
        { type: "BusinessPlan", id: businessId },
        { type: "BusinessPlan", id: `history-${businessId}` },
      ],
    }),
    cancelAdminBusinessPlanTrial: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.admin.businesses}/${businessId}/trial/cancel`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [
        { type: "BusinessPlan", id: businessId },
        { type: "BusinessPlan", id: `history-${businessId}` },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminBusinessesQuery,
  useGetAdminBusinessPlanQuery,
  useGetAdminBusinessPlanImpactQuery,
  useGetAdminBusinessPlanHistoryQuery,
  useAssignAdminBusinessPlanMutation,
  useGrantAdminBusinessPlanTrialMutation,
  useCancelAdminBusinessPlanTrialMutation,
} = adminApi;
