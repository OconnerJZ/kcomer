import {
  api,
  createEndpointBuilder,
  crudEndpoints,
} from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const dynamicEndpoints = {
  menu: {
    path: ({ businessId }) => `${ENDPOINTS.businesses.base}/${businessId}/menu`,
    tagType: "Menu",
  },
  owner: {
    path: ({ ownerId }) => `${ENDPOINTS.businesses.owner}/${ownerId}`,
    tagType: "Business",
  },
  location: {
    path: ({ id }) => `${ENDPOINTS.businesses.base}/${id}/location`,
    tagType: "Business",
  },
  schedules: {
    path: ({ id }) => `${ENDPOINTS.businesses.base}/${id}/schedules`,
    tagType: "Business",
  },
  deliverySettings: {
    path: ({ id }) => `${ENDPOINTS.businesses.base}/${id}/delivery-settings`,
    tagType: "Business",
  },
  paymentMethods: {
    path: ({ id }) => `${ENDPOINTS.businesses.base}/${id}/payment-methods`,
    tagType: "Business",
  },
  foodTypes: {
    path: ({ id }) => `${ENDPOINTS.businesses.base}/${id}/food-types`,
    tagType: "Business",
  },
  photos: {
    path: ({ id }) => `${ENDPOINTS.businesses.base}/${id}/photos`,
    tagType: "Business",
  },
  photo: {
    path: ({ id, photoId }) => `${ENDPOINTS.businesses.base}/${id}/photos/${photoId}`,
    tagType: "Business",
  },
};

const endpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);
  const createEndpoint = (key, method) =>
    endpoint(key, method, {
      dynamicPath: dynamicEndpoints[key].path,
      tagType: dynamicEndpoints[key].tagType,
    });

  return {
    getMenu: createEndpoint("menu", "getAll"),
    getByOwner: createEndpoint("owner", "getAll"),
    updateBusinessLocation: createEndpoint("location", "put"),
    updateBusinessSchedules: createEndpoint("schedules", "put"),
    updateBusinessDeliverySettings: createEndpoint("deliverySettings", "put"),
    updateBusinessPaymentMethods: createEndpoint("paymentMethods", "put"),
    updateBusinessFoodTypes: createEndpoint("foodTypes", "put"),
    addBusinessPhoto: createEndpoint("photos", "post"),
    deleteBusinessPhoto: createEndpoint("photo", "delete"),
  };
};

const businessEndpoint = (builder) => ({
  ...crudEndpoints(ENDPOINTS.businesses.base, {
    prefix: "Business",
    tagType: "Business",
  })(builder),
  ...endpoints(builder),
});

const apiBusiness = api.injectEndpoints({
  endpoints: businessEndpoint,
  overrideExisting: false,
});

export const {
  useCreateBusinessMutation,
  useGetAllBusinessQuery,
  useGetOneBusinessQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useGetMenuQuery,
  useGetByOwnerQuery,
  useUpdateBusinessLocationMutation,
  useUpdateBusinessSchedulesMutation,
  useUpdateBusinessDeliverySettingsMutation,
  useUpdateBusinessPaymentMethodsMutation,
  useUpdateBusinessFoodTypesMutation,
  useAddBusinessPhotoMutation,
  useDeleteBusinessPhotoMutation,
} = apiBusiness;
