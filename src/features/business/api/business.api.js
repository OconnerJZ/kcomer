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
    updateBusinessLocation: createEndpoint("location", "update"),
    updateBusinessSchedules: createEndpoint("schedules", "update"),
    updateBusinessDeliverySettings: createEndpoint("deliverySettings", "update"),
    updateBusinessPaymentMethods: createEndpoint("paymentMethods", "update"),
    updateBusinessFoodTypes: createEndpoint("foodTypes", "update"),
    addBusinessPhoto: createEndpoint("photos", "create"),
    deleteBusinessPhoto: createEndpoint("photo", "delete"),
  };
};

const businessEndpoint = (builder) => ({
  ...crudEndpoints(ENDPOINTS.businesses.base, {
    prefix: "Business",
    tagType: "Business",
  })(builder),
  ...endpoints(builder),
  getBusinessTeam: builder.query({
    query: ({ businessId }) => `${ENDPOINTS.businesses.base}/${businessId}/team`,
    providesTags: (_result, _error, { businessId }) => [{ type: "BusinessTeam", id: businessId }],
  }),
  getBusinessPlan: builder.query({
    query: ({ businessId }) => `${ENDPOINTS.businesses.base}/${businessId}/plan`,
    providesTags: (_result, _error, { businessId }) => [{ type: "BusinessPlan", id: businessId }],
  }),
  inviteBusinessMember: builder.mutation({
    query: ({ businessId, ...data }) => ({ url: `${ENDPOINTS.businesses.base}/${businessId}/invitations`, method: "POST", data }),
    invalidatesTags: (_result, _error, { businessId }) => [{ type: "BusinessTeam", id: businessId }],
  }),
  cancelBusinessInvitation: builder.mutation({
    query: ({ businessId, invitationId }) => ({ url: `${ENDPOINTS.businesses.base}/${businessId}/invitations/${invitationId}`, method: "DELETE" }),
    invalidatesTags: (_result, _error, { businessId }) => [{ type: "BusinessTeam", id: businessId }],
  }),
  updateBusinessMember: builder.mutation({
    query: ({ businessId, userId, role }) => ({ url: `${ENDPOINTS.businesses.base}/${businessId}/members/${userId}`, method: "PATCH", data: { role } }),
    invalidatesTags: (_result, _error, { businessId }) => [{ type: "BusinessTeam", id: businessId }],
  }),
  removeBusinessMember: builder.mutation({
    query: ({ businessId, userId }) => ({ url: `${ENDPOINTS.businesses.base}/${businessId}/members/${userId}`, method: "DELETE" }),
    invalidatesTags: (_result, _error, { businessId }) => [{ type: "BusinessTeam", id: businessId }],
  }),
  createOwnershipTransfer: builder.mutation({
    query: ({ businessId, ...data }) => ({ url: `${ENDPOINTS.businesses.base}/${businessId}/ownership-transfers`, method: "POST", data }),
    invalidatesTags: (_result, _error, { businessId }) => [{ type: "BusinessTeam", id: businessId }],
  }),
  getBusinessInvitation: builder.query({
    query: ({ token }) => `${ENDPOINTS.businesses.base}/invitations/${token}`,
  }),
  acceptBusinessInvitation: builder.mutation({
    query: ({ token }) => ({ url: `${ENDPOINTS.businesses.base}/invitations/${token}/accept`, method: "POST" }),
    invalidatesTags: ["Business", "BusinessTeam"],
  }),
  acceptBusinessInvitationCode: builder.mutation({
    query: ({ code }) => ({ url: `${ENDPOINTS.businesses.base}/invitations/accept-code`, method: "POST", data: { code } }),
    invalidatesTags: ["Business", "BusinessTeam"],
  }),
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
  useGetBusinessTeamQuery,
  useGetBusinessPlanQuery,
  useInviteBusinessMemberMutation,
  useCancelBusinessInvitationMutation,
  useUpdateBusinessMemberMutation,
  useRemoveBusinessMemberMutation,
  useCreateOwnershipTransferMutation,
  useGetBusinessInvitationQuery,
  useAcceptBusinessInvitationMutation,
  useAcceptBusinessInvitationCodeMutation,
} = apiBusiness;
