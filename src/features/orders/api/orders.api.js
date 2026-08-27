import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const dynamicEndpoints = {
  status: {
    path: ({ id }) => `${ENDPOINTS.orders.base}/${id}/status`,
    cacheKey: ({ businessId, userId }) => businessId || userId || undefined,
  },
  kitchenItem: {
    path: ({ id, detailId }) => `${ENDPOINTS.orders.base}/${id}/items/${detailId}/kitchen-status`,
    cacheKey: ({ businessId, userId }) => businessId || userId || undefined,
  },
  user: {
    path: ({ userId }) => `${ENDPOINTS.orders.user}/${userId}`,
    cacheKey: ({ userId }) => userId,
  },
  business: {
    path: ({ businessId }) => `${ENDPOINTS.orders.business}/${businessId}`,
    cacheKey: ({ businessId }) => businessId,
  },
};

const customEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);
  const createEndpoint = (key, method) => endpoint(key, method, {
    dynamicPath: dynamicEndpoints[key].path,
    getCacheKey: dynamicEndpoints[key].cacheKey,
    tagType: "Orders",
  });

  return {
    orderUpdateStatus: createEndpoint("status", "patch"),
    orderUpdateKitchenItem: createEndpoint("kitchenItem", "patch"),
    getOrdersByUser: createEndpoint("user", "getAll"),
    getOrdersByBusiness: createEndpoint("business", "getAll"),
  };
};

const ordersEndpoints = (builder) => ({
  ...crudEndpoints(ENDPOINTS.orders.base, { prefix: "Orders", tagType: "Orders" })(builder),
  ...customEndpoints(builder),
});

const apiOrders = api.injectEndpoints({
  endpoints: ordersEndpoints,
  overrideExisting: false,
});

export const {
  useCreateOrdersMutation,
  useGetAllOrdersQuery,
  useGetOneOrdersQuery,
  useUpdateOrdersMutation,
  usePatchOrdersMutation,
  useDeleteOrdersMutation,
  useOrderUpdateStatusMutation,
  useOrderUpdateKitchenItemMutation,
  useGetOrdersByUserQuery,
  useGetOrdersByBusinessQuery,
} = apiOrders;
