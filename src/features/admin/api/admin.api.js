import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => ENDPOINTS.admin.dashboard,
      providesTags: [{ type: "Stats", id: "admin-dashboard" }],
    }),
    getAdminBusinesses: builder.query({
      query: ({ q = "", limit = 20 } = {}) => ({
        url: ENDPOINTS.admin.businesses,
        params: { q, limit },
      }),
      providesTags: (result) => {
        const items = result?.data ?? result ?? [];
        return [
          { type: "Business", id: "ADMIN_LIST" },
          ...items.map((business) => ({ type: "Business", id: `admin-${business.id}` })),
        ];
      },
    }),
    getAdminBusiness: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.admin.businesses}/${businessId}`,
      providesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `admin-${businessId}` }],
    }),
    updateAdminBusinessStatus: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.admin.businesses}/${businessId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [
        { type: "Business", id: `admin-${businessId}` },
        { type: "Business", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
      ],
    }),
    updateAdminBusinessVerification: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.admin.businesses}/${businessId}/verification`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [
        { type: "Business", id: `admin-${businessId}` },
        { type: "Business", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
      ],
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
  useGetAdminDashboardQuery,
  useGetAdminBusinessesQuery,
  useGetAdminBusinessQuery,
  useUpdateAdminBusinessStatusMutation,
  useUpdateAdminBusinessVerificationMutation,
  useGetAdminBusinessPlanQuery,
  useGetAdminBusinessPlanImpactQuery,
  useGetAdminBusinessPlanHistoryQuery,
  useAssignAdminBusinessPlanMutation,
  useGrantAdminBusinessPlanTrialMutation,
  useCancelAdminBusinessPlanTrialMutation,
} = adminApi;
