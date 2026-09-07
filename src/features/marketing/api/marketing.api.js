import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const marketingApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getMarketingOverview: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.marketing.business}/${businessId}`,
      providesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-${businessId}` }],
    }),
    getMarketingSegments: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.marketing.business}/${businessId}/segments`,
      providesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-segments-${businessId}` }],
    }),
    createMarketingCampaign: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.marketing.business}/${businessId}/campaigns`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-${businessId}` }],
    }),
    setMarketingCampaignStatus: builder.mutation({
      query: ({ businessId, campaignId, status }) => ({
        url: `${ENDPOINTS.marketing.business}/${businessId}/campaigns/${campaignId}/status`,
        method: "PATCH",
        data: { status },
      }),
      invalidatesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-${businessId}` }],
    }),
    createAdCampaign: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.marketing.business}/${businessId}/ads`,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-${businessId}` }],
    }),
    submitAdCampaign: builder.mutation({
      query: ({ businessId, adCampaignId }) => ({
        url: `${ENDPOINTS.marketing.business}/${businessId}/ads/${adCampaignId}/submit`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-${businessId}` }],
    }),
    pauseAdCampaign: builder.mutation({
      query: ({ businessId, adCampaignId }) => ({
        url: `${ENDPOINTS.marketing.business}/${businessId}/ads/${adCampaignId}/pause`,
        method: "POST",
      }),
      invalidatesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `marketing-${businessId}` }],
    }),
    getSponsoredListings: builder.query({
      query: ({ surface = "explore" } = {}) => `${ENDPOINTS.marketing.sponsored}?surface=${surface}`,
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMarketingOverviewQuery,
  useGetMarketingSegmentsQuery,
  useCreateMarketingCampaignMutation,
  useSetMarketingCampaignStatusMutation,
  useCreateAdCampaignMutation,
  useSubmitAdCampaignMutation,
  usePauseAdCampaignMutation,
  useGetSponsoredListingsQuery,
} = marketingApi;
