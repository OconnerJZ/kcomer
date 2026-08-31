import { api } from "@Shared/api/rtk/api";

const base = "/api/shared-orders";
const tags = (_result, _error, arg) => [{ type: "SharedOrder", id: arg?.id || "CURRENT" }];

const sharedOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSharedOrder: builder.mutation({ query: (data) => ({ url: base, method: "POST", data }) }),
    joinSharedOrderByCode: builder.mutation({ query: (code) => ({ url: `${base}/join/code`, method: "POST", data: { code } }) }),
    joinSharedOrderByToken: builder.mutation({ query: (token) => ({ url: `${base}/join/${token}`, method: "POST" }) }),
    getSharedOrder: builder.query({ query: (id) => `${base}/${id}`, providesTags: (_r, _e, id) => [{ type: "SharedOrder", id }] }),
    addSharedOrderItem: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/items`, method: "POST", data }), invalidatesTags: tags }),
    addSharedOrderItems: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/items/batch`, method: "POST", data }), invalidatesTags: tags }),
    updateSharedOrderItem: builder.mutation({ query: ({ id, itemId, ...data }) => ({ url: `${base}/${id}/items/${itemId}`, method: "PUT", data }), invalidatesTags: tags }),
    deleteSharedOrderItem: builder.mutation({ query: ({ id, itemId, expectedVersion }) => ({ url: `${base}/${id}/items/${itemId}`, method: "DELETE", data: { expectedVersion } }), invalidatesTags: tags }),
    rotateSharedOrderInvite: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/rotate-invite`, method: "POST", data }), invalidatesTags: tags }),
    leaveSharedOrder: builder.mutation({ query: ({ id, expectedVersion }) => ({ url: `${base}/${id}/leave`, method: "POST", data: { expectedVersion } }) }),
    cancelSharedOrder: builder.mutation({ query: ({ id, expectedVersion }) => ({ url: `${base}/${id}/cancel`, method: "POST", data: { expectedVersion } }), invalidatesTags: tags }),
    submitSharedOrder: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/submit`, method: "POST", data }), invalidatesTags: tags }),
  }),
});

export const { useCreateSharedOrderMutation, useJoinSharedOrderByCodeMutation, useJoinSharedOrderByTokenMutation, useGetSharedOrderQuery, useAddSharedOrderItemMutation, useAddSharedOrderItemsMutation, useUpdateSharedOrderItemMutation, useDeleteSharedOrderItemMutation, useRotateSharedOrderInviteMutation, useLeaveSharedOrderMutation, useCancelSharedOrderMutation, useSubmitSharedOrderMutation } = sharedOrdersApi;
