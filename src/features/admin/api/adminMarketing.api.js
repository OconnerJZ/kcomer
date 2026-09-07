import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const summaryTag = { type: "AdminMarketing", id: "SUMMARY" };
const campaignsTag = { type: "AdminMarketing", id: "CAMPAIGNS" };
const adsTag = { type: "AdminMarketing", id: "ADS" };

const adminMarketingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminMarketingSummary: builder.query({
      query: () => `${ENDPOINTS.admin.marketing}/summary`,
      providesTags: [summaryTag],
    }),
    getAdminMarketingCampaigns: builder.query({
      query: ({ q = "", status = "", limit = 50 } = {}) => ({
        url: `${ENDPOINTS.admin.marketing}/campaigns`,
        params: { q, status: status || undefined, limit },
      }),
      providesTags: [campaignsTag],
    }),
    updateAdminMarketingCampaignStatus: builder.mutation({
      query: ({ campaignId, ...data }) => ({
        url: `${ENDPOINTS.admin.marketing}/campaigns/${campaignId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [summaryTag, campaignsTag],
    }),
    getAdminAds: builder.query({
      query: ({ q = "", status = "", moderation = "", limit = 50 } = {}) => ({
        url: `${ENDPOINTS.admin.marketing}/ads`,
        params: {
          q,
          status: status || undefined,
          moderation: moderation || undefined,
          limit,
        },
      }),
      providesTags: [adsTag],
    }),
    moderateAdminAd: builder.mutation({
      query: ({ adCampaignId, ...data }) => ({
        url: `${ENDPOINTS.admin.marketing}/ads/${adCampaignId}/moderation`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [summaryTag, adsTag],
    }),
    updateAdminAdStatus: builder.mutation({
      query: ({ adCampaignId, ...data }) => ({
        url: `${ENDPOINTS.admin.marketing}/ads/${adCampaignId}/status`,
        method: "PATCH",
        data,
      }),
      invalidatesTags: [summaryTag, adsTag],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminMarketingSummaryQuery,
  useGetAdminMarketingCampaignsQuery,
  useUpdateAdminMarketingCampaignStatusMutation,
  useGetAdminAdsQuery,
  useModerateAdminAdMutation,
  useUpdateAdminAdStatusMutation,
} = adminMarketingApi;
