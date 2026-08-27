import { api, createEndpointBuilder } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const catalogsEndpoints = (builder) => {
  const endpoints = createEndpointBuilder(api, builder);
  return {
    getFoodTypes: endpoints(ENDPOINTS.catalogs.foodTypes, "getAll"),
    getCategories: endpoints(ENDPOINTS.catalogs.categories, "getAll"),
    getPaymentMethods: endpoints(ENDPOINTS.catalogs.paymentMethods, "getAll"),
  };
};

const apiCatalogs = api.injectEndpoints({
  endpoints: catalogsEndpoints,
  overrideExisting: false,
});

export const {
  useGetCategoriesQuery,
  useGetFoodTypesQuery,
  useGetPaymentMethodsQuery,
} = apiCatalogs;
