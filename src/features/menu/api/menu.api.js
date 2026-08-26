import { api, createEndpointBuilder, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const dynamicEndpoints = {
  business: {
    path: ({ businessId }) => `${ENDPOINTS.menus.business}/${businessId}`,
  },
  toggle: {
    path: ({ id }) => `${ENDPOINTS.menus.base}/${id}/toggle-availability`,
  },
};

const dynamicEndpoint = (builder, key, method) =>
  createEndpointBuilder(api, builder)(key, method, {
    dynamicPath: dynamicEndpoints[key].path,
    tagType: "Menu",
  });

const customsEndpoints = (builder) => ({
  getMenuByBusiness: dynamicEndpoint(builder, "business", "getAll"),
  toggleAvailability: dynamicEndpoint(builder, "toggle", "patch"),
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
  useToggleAvailabilityMutation,
} = apiMenu;
