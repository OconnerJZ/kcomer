import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const featureBusinessTag = (businessId) => ({ type: "FeatureControl", id: `business-${businessId}` });
const featureBroadTags = [
  { type: "FeatureControl", id: "CATALOG" },
  { type: "FeatureControl", id: "BUSINESSES" },
];

const adminApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminDashboard: builder.query({
      query: () => ENDPOINTS.admin.dashboard,
      providesTags: [{ type: "Stats", id: "admin-dashboard" }],
    }),
    getAdminUsers: builder.query({
      query: ({ q = "", limit = 20 } = {}) => ({
        url: ENDPOINTS.admin.users,
        params: { q, limit },
      }),
      providesTags: (result) => {
        const items = result?.data ?? result ?? [];
        return [
          { type: "Users", id: "ADMIN_LIST" },
          ...items.map((user) => ({ type: "Users", id: `admin-${user.id}` })),
        ];
      },
    }),
    getAdminUser: builder.query({
      query: ({ userId }) => `${ENDPOINTS.admin.users}/${userId}`,
      providesTags: (_result, _error, { userId }) => [{ type: "Users", id: `admin-${userId}` }],
    }),
    updateAdminUserStatus: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `${ENDPOINTS.admin.users}/${userId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Users", id: `admin-${userId}` },
        { type: "Users", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
      ],
    }),
    updateAdminUserRole: builder.mutation({
      query: ({ userId, ...data }) => ({
        url: `${ENDPOINTS.admin.users}/${userId}/role`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { userId }) => [
        { type: "Users", id: `admin-${userId}` },
        { type: "Users", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
      ],
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
    getAdminPlanSummary: builder.query({
      query: () => ENDPOINTS.admin.planSummary,
      providesTags: [{ type: "BusinessPlan", id: "ADMIN_SUMMARY" }],
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
        { type: "BusinessPlan", id: "ADMIN_SUMMARY" },
        { type: "Business", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
        featureBusinessTag(businessId),
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
        { type: "BusinessPlan", id: "ADMIN_SUMMARY" },
        { type: "Business", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
        featureBusinessTag(businessId),
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
        { type: "BusinessPlan", id: "ADMIN_SUMMARY" },
        { type: "Business", id: "ADMIN_LIST" },
        { type: "Stats", id: "admin-dashboard" },
        featureBusinessTag(businessId),
      ],
    }),
    getAdminFeatures: builder.query({
      query: () => ENDPOINTS.admin.features,
      providesTags: [{ type: "FeatureControl", id: "CATALOG" }],
    }),
    getAdminBusinessFeatures: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.admin.features}/businesses/${businessId}`,
      providesTags: (_result, _error, { businessId }) => [
        { type: "FeatureControl", id: "BUSINESSES" },
        featureBusinessTag(businessId),
      ],
    }),
    updateAdminGlobalFeature: builder.mutation({
      query: ({ featureKey, ...data }) => ({
        url: `${ENDPOINTS.admin.features}/${encodeURIComponent(featureKey)}/global`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: featureBroadTags,
    }),
    updateAdminPlanFeature: builder.mutation({
      query: ({ featureKey, planCode, ...data }) => ({
        url: `${ENDPOINTS.admin.features}/${encodeURIComponent(featureKey)}/plans/${planCode}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: featureBroadTags,
    }),
    updateAdminBusinessFeature: builder.mutation({
      query: ({ featureKey, businessId, ...data }) => ({
        url: `${ENDPOINTS.admin.features}/${encodeURIComponent(featureKey)}/businesses/${businessId}`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [featureBusinessTag(businessId)],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminDashboardQuery,
  useGetAdminUsersQuery,
  useGetAdminUserQuery,
  useUpdateAdminUserStatusMutation,
  useUpdateAdminUserRoleMutation,
  useGetAdminBusinessesQuery,
  useGetAdminBusinessQuery,
  useUpdateAdminBusinessStatusMutation,
  useUpdateAdminBusinessVerificationMutation,
  useGetAdminPlanSummaryQuery,
  useGetAdminBusinessPlanQuery,
  useGetAdminBusinessPlanImpactQuery,
  useGetAdminBusinessPlanHistoryQuery,
  useAssignAdminBusinessPlanMutation,
  useGrantAdminBusinessPlanTrialMutation,
  useCancelAdminBusinessPlanTrialMutation,
  useGetAdminFeaturesQuery,
  useGetAdminBusinessFeaturesQuery,
  useUpdateAdminGlobalFeatureMutation,
  useUpdateAdminPlanFeatureMutation,
  useUpdateAdminBusinessFeatureMutation,
} = adminApi;
