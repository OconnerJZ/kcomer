import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const dynamicEndpoints = {
  status: { path: ({ id }) => `${ENDPOINTS.orders.base}/${id}/status`, cacheKey: ({ businessId, userId }) => businessId || userId || undefined },
  editItems: { path: ({ id }) => `${ENDPOINTS.orders.base}/${id}/items`, cacheKey: ({ userId }) => userId || undefined },
  kitchenItem: { path: ({ id, detailId }) => `${ENDPOINTS.orders.base}/${id}/items/${detailId}/kitchen-status`, cacheKey: ({ businessId, userId }) => businessId || userId || undefined },
  user: { path: ({ userId }) => `${ENDPOINTS.orders.user}/${userId}`, cacheKey: ({ userId }) => userId },
  business: { path: ({ businessId }) => `${ENDPOINTS.orders.business}/${businessId}`, cacheKey: ({ businessId }) => businessId },
};

const customEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);
  const createEndpoint = (key, method) => endpoint(key, method, { dynamicPath: dynamicEndpoints[key].path, getCacheKey: dynamicEndpoints[key].cacheKey, tagType: "Orders" });
  return {
    orderUpdateStatus: createEndpoint("status", "patch"),
    orderEditPendingItems: createEndpoint("editItems", "update"),
    orderUpdateKitchenItem: createEndpoint("kitchenItem", "patch"),
    getOrderAudit: builder.query({
      query: ({ id }) => `${ENDPOINTS.orders.base}/${id}/audit`,
      providesTags: (result, error, { id }) => [{ type: "Orders", id }],
    }),
    getTransferPayment: builder.query({
      query: ({ id }) => `${ENDPOINTS.orders.base}/${id}/transfer-payment`,
      providesTags: (_result, _error, { id }) => [{ type: "Orders", id }],
    }),
    submitTransferPaymentEvidence: builder.mutation({
      query: ({ id, file }) => {
        const data = new FormData();
        data.append("file", file);
        return { url: `${ENDPOINTS.orders.base}/${id}/transfer-payment/evidence`, method: "POST", data };
      },
      invalidatesTags: (_result, _error, { id }) => [{ type: "Orders", id }, { type: "Orders", id: "LIST" }],
    }),
    reviewTransferPayment: builder.mutation({
      query: ({ id, status, message, expectedVersion }) => ({ url: `${ENDPOINTS.orders.base}/${id}/transfer-payment/review`, method: "PATCH", data: { status, message, expectedVersion } }),
      invalidatesTags: (_result, _error, { id }) => [{ type: "Orders", id }, { type: "Orders", id: "LIST" }],
    }),
    getOrdersByUser: createEndpoint("user", "getAll"),
    getOrdersByBusiness: createEndpoint("business", "getAll"),
  };
};

const ordersEndpoints = (builder) => ({ ...crudEndpoints(ENDPOINTS.orders.base, { prefix: "Orders", tagType: "Orders" })(builder), ...customEndpoints(builder) });
const apiOrders = api.injectEndpoints({ endpoints: ordersEndpoints, overrideExisting: false });

export const {
  useCreateOrdersMutation,
  useGetAllOrdersQuery,
  useGetOneOrdersQuery,
  useUpdateOrdersMutation,
  usePatchOrdersMutation,
  useDeleteOrdersMutation,
  useOrderUpdateStatusMutation,
  useOrderEditPendingItemsMutation,
  useOrderUpdateKitchenItemMutation,
  useGetOrderAuditQuery,
  useGetTransferPaymentQuery,
  useSubmitTransferPaymentEvidenceMutation,
  useReviewTransferPaymentMutation,
  useGetOrdersByUserQuery,
  useGetOrdersByBusinessQuery,
} = apiOrders;
