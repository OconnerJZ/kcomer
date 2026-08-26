import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const customEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    getReviewsByBusiness: endpoint("reviews", "getAll", {
      dynamicPath: ({ businessId }) => `${ENDPOINTS.reviews.base}/business/${businessId}`,
      tagType: "Reviews",
    }),
  };
};

const reviewsEndpoints = (builder) => ({
  ...crudEndpoints(ENDPOINTS.reviews.base, { tagType: "Reviews" })(builder),
  ...customEndpoints(builder),
});

const apiReviews = api.injectEndpoints({
  endpoints: reviewsEndpoints,
  overrideExisting: false,
});

export const {
  useCreateMutation,
  useUpdateMutation,
  useDeleteMutation,
  useGetReviewsByBusinessQuery,
} = apiReviews;
