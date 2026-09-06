import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const customEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    getReviewsByBusiness: endpoint("reviews", "getAll", {
      dynamicPath: ({ businessId }) => `${ENDPOINTS.reviews.business}/${businessId}`,
      tagType: "Reviews",
    }),
    getReviewSummary: builder.query({
      query: ({ businessId }) => `${ENDPOINTS.reviews.business}/${businessId}/summary`,
      providesTags: (_result, _error, { businessId }) => [
        { type: "Reviews", id: "LIST" },
        { type: "Reviews", id: `summary-${businessId}` },
      ],
    }),
    getReputationInsights: builder.query({
      query: ({ businessId, period = 90 }) => `${ENDPOINTS.reviews.business}/${businessId}/insights?period=${period}`,
      providesTags: (_result, _error, { businessId }) => [
        { type: "Reviews", id: `insights-${businessId}` },
      ],
    }),
    getReviewByOrder: builder.query({
      query: ({ orderId }) => `${ENDPOINTS.reviews.base}/order/${orderId}`,
      providesTags: (_result, _error, { orderId }) => [{ type: "Reviews", id: `order-${orderId}` }],
    }),
    createVerifiedReview: builder.mutation({
      query: (data) => ({
        url: ENDPOINTS.reviews.base,
        method: "POST",
        data,
      }),
      invalidatesTags: (_result, _error, { orderId }) => [
        { type: "Reviews", id: "LIST" },
        { type: "Reviews", id: `order-${orderId}` },
      ],
    }),
    respondToReview: builder.mutation({
      query: ({ businessId, reviewId, response }) => ({
        url: `${ENDPOINTS.reviews.business}/${businessId}/${reviewId}/response`,
        method: "POST",
        data: { response },
      }),
      invalidatesTags: (_result, _error, { businessId }) => [
        { type: "Reviews", id: "LIST" },
        { type: "Reviews", id: `summary-${businessId}` },
        { type: "Reviews", id: `insights-${businessId}` },
      ],
    }),
  };
};

const reviewsEndpoints = (builder) => ({
  ...crudEndpoints(ENDPOINTS.reviews.base, {
    prefix: "Review",
    tagType: "Reviews",
  })(builder),
  ...customEndpoints(builder),
});

const apiReviews = api.injectEndpoints({
  endpoints: reviewsEndpoints,
  overrideExisting: false,
});

export const {
  useCreateReviewMutation,
  useGetAllReviewQuery,
  useGetOneReviewQuery,
  useUpdateReviewMutation,
  usePatchReviewMutation,
  useDeleteReviewMutation,
  useGetReviewsByBusinessQuery,
  useGetReviewSummaryQuery,
  useGetReputationInsightsQuery,
  useGetReviewByOrderQuery,
  useCreateVerifiedReviewMutation,
  useRespondToReviewMutation,
} = apiReviews;
