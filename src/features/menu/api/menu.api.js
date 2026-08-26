import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const dynamicEndpoints = {
  business: {
    path: ({ businessId }) => `${ENDPOINTS.menus.business}/${businessId}`,
  },
  managedBusiness: {
    path: ({ businessId }) => `${ENDPOINTS.menus.business}/${businessId}/manage`,
  },
};

const dynamicEndpoint = (builder, key, method) =>
  createEndpointBuilder(api, builder)(key, method, {
    dynamicPath: dynamicEndpoints[key].path,
    tagType: "Menu",
  });

const customsEndpoints = (builder) => ({
  getMenuByBusiness: dynamicEndpoint(builder, "business", "getAll"),
  getManagedMenuByBusiness: dynamicEndpoint(builder, "managedBusiness", "getAll"),
});

const menuEndpoints = (builder) => ({
  ...crudEndpoints(ENDPOINTS.menus.base, { prefix: "Menu", tagType: "Menu" })(builder),
  ...customsEndpoints(builder),
});

const apiMenu = api.injectEndpoints({
  endpoints: menuEndpoints,
  overrideExisting: false,
});

export const {
  useCreateMenuMutation,
  useGetAllMenuQuery,
  useGetOneMenuQuery,
  useUpdateMenuMutation,
  useDeleteMenuMutation,
  useGetMenuByBusinessQuery,
  useGetManagedMenuByBusinessQuery,
} = apiMenu;
