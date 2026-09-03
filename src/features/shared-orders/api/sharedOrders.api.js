import { api } from "@Shared/api/rtk/api";

const base = "/api/shared-orders";
const activeTag = { type: "SharedOrder", id: "ACTIVE" };
const tags = (_result, _error, arg) => [activeTag, { type: "SharedOrder", id: arg?.id || "CURRENT" }];
const sessionTags = (_result, _error, arg) => [activeTag, ...tags(_result, _error, arg)];

const sharedOrdersApi = api.injectEndpoints({
  endpoints: (builder) => ({
    createSharedOrder: builder.mutation({ query: (data) => ({ url: base, method: "POST", data }), invalidatesTags: [activeTag] }),
    joinSharedOrderByCode: builder.mutation({ query: (code) => ({ url: `${base}/join/code`, method: "POST", data: { code } }), invalidatesTags: [activeTag] }),
    joinSharedOrderByToken: builder.mutation({ query: (token) => ({ url: `${base}/join/${token}`, method: "POST" }), invalidatesTags: [activeTag] }),
    getActiveSharedOrder: builder.query({ query: () => `${base}/active`, providesTags: [activeTag] }),
    getSharedOrder: builder.query({ query: (id) => `${base}/${id}`, providesTags: (_r, _e, id) => [{ type: "SharedOrder", id }] }),
    addSharedOrderItem: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/items`, method: "POST", data }), invalidatesTags: tags }),
    addSharedOrderItems: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/items/batch`, method: "POST", data }), invalidatesTags: tags }),
    updateSharedOrderItem: builder.mutation({ query: ({ id, itemId, ...data }) => ({ url: `${base}/${id}/items/${itemId}`, method: "PUT", data }), invalidatesTags: tags }),
    deleteSharedOrderItem: builder.mutation({ query: ({ id, itemId, expectedVersion }) => ({ url: `${base}/${id}/items/${itemId}`, method: "DELETE", data: { expectedVersion } }), invalidatesTags: tags }),
    rotateSharedOrderInvite: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/rotate-invite`, method: "POST", data }), invalidatesTags: tags }),
    leaveSharedOrder: builder.mutation({ query: ({ id, expectedVersion }) => ({ url: `${base}/${id}/leave`, method: "POST", data: { expectedVersion } }), invalidatesTags: sessionTags }),
    cancelSharedOrder: builder.mutation({ query: ({ id, expectedVersion }) => ({ url: `${base}/${id}/cancel`, method: "POST", data: { expectedVersion } }), invalidatesTags: sessionTags }),
    submitSharedOrder: builder.mutation({ query: ({ id, ...data }) => ({ url: `${base}/${id}/submit`, method: "POST", data }), invalidatesTags: sessionTags }),
  }),
});

export const { useCreateSharedOrderMutation, useJoinSharedOrderByCodeMutation, useJoinSharedOrderByTokenMutation, useGetActiveSharedOrderQuery, useGetSharedOrderQuery, useAddSharedOrderItemMutation, useAddSharedOrderItemsMutation, useUpdateSharedOrderItemMutation, useDeleteSharedOrderItemMutation, useRotateSharedOrderInviteMutation, useLeaveSharedOrderMutation, useCancelSharedOrderMutation, useSubmitSharedOrderMutation } = sharedOrdersApi;
