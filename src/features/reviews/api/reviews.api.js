import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const customEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    getReviewsByBusiness: endpoint("reviews", "getAll", {
      dynamicPath: ({ businessId }) => `${ENDPOINTS.reviews.business}/${businessId}`,
      tagType: "Reviews",
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
} = apiReviews;
