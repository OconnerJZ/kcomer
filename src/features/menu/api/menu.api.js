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
  getMenuModifiers: builder.query({
    query: (menuId) => `/menus/${menuId}/modifiers`,
    providesTags: (_result, _error, menuId) => [{ type: "Menu", id: `modifiers-${menuId}` }],
  }),
  updateMenuModifiers: builder.mutation({
    query: ({ menuId, groups }) => ({
      url: `/menus/${menuId}/modifiers`,
      method: "PUT",
      data: { groups },
      headers: { "Content-Type": "application/json" },
    }),
    invalidatesTags: (_result, _error, { menuId }) => [
      { type: "Menu", id: `modifiers-${menuId}` },
      { type: "Menu", id: menuId },
      { type: "Menu", id: "LIST" },
    ],
  }),
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
  useGetMenuModifiersQuery,
  useUpdateMenuModifiersMutation,
} = apiMenu;
