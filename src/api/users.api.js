import { api, createEndpointBuilder } from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

const catalogsEndpoints = (builder) => {
  const endpoints = createEndpointBuilder(api, builder);
  return {
    getFoodTypes: endpoints(ENDPOINTS.catalogs.foodTypes, "getAll", { tagType: "Catalogs" }),
    getCategories: endpoints(ENDPOINTS.catalogs.categories, "getAll", { tagType: "Catalogs" }),
    getPaymentMethods: endpoints(ENDPOINTS.catalogs.paymentMethods, "getAll", { tagType: "Catalogs" }),
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