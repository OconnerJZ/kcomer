import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const loyaltyApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getLoyaltyProgram: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.loyalty.business}/${businessId}/program`,
      providesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `loyalty-${businessId}` }],
    }),
    saveLoyaltyProgram: builder.mutation({
      query: ({ businessId, ...data }) => ({
        url: `${ENDPOINTS.loyalty.business}/${businessId}/program`,
        method: "PUT",
        data,
      }),
      invalidatesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `loyalty-${businessId}` }],
    }),
    getMyLoyaltyProgress: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.loyalty.business}/${businessId}/me`,
      providesTags: (_result, _error, { businessId }) => [{ type: "Business", id: `loyalty-progress-${businessId}` }],
    }),
    getMyLoyaltyPrograms: builder.query({
      query: () => ENDPOINTS.loyalty.me,
      providesTags: [{ type: "Business", id: "loyalty-me" }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetLoyaltyProgramQuery,
  useSaveLoyaltyProgramMutation,
  useGetMyLoyaltyProgressQuery,
  useGetMyLoyaltyProgramsQuery,
} = loyaltyApi;
