import { api, createEndpointBuilder, crudEndpoints } from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

const dynamicEndpoints = {
  status: {
    path: ({ id }) => `${ENDPOINTS.orders.base}/${id}/status`,
    // Para optimistic updates, necesitamos saber qué cache actualizar
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
  
  const createEndpoint = (key, method) =>
    endpoint(key, method, {
      dynamicPath: dynamicEndpoints[key].path,
      getCacheKey: dynamicEndpoints[key].cacheKey,
    });

  return {
    orderUpdateStatus: createEndpoint("status", "patch"),
    getOrdersByUser: createEndpoint("user", "getAll"),
    getOrdersByBusiness: createEndpoint("business", "getAll"),
  };
};

const ordersEndpoints = (builder) => ({
  ...crudEndpoints(ENDPOINTS.orders.base, {prefix: "Orders"})(builder),
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
  useGetOrdersByUserQuery,
  useGetOrdersByBusinessQuery,
} = apiOrders;