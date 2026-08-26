import {
  api,
  createEndpointBuilder,
  crudEndpoints,
} from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

const dynamicEndpoints = {
  menu: {
    path: ({ businessId }) => `${ENDPOINTS.businesses.base}/${businessId}/menu`,
    cacheKey: ({ businessId }) => businessId,
    tagType: "Menu",
  },
  owner: {
    path: ({ ownerId }) => `${ENDPOINTS.businesses.owner}/${ownerId}`,
    cacheKey: ({ ownerId }) => ownerId,
    tagType: "Business",
  },
};

const endpoints = (builder) => {
  const createEndpoint = (key) =>
    createEndpointBuilder(api, builder)(key, "getAll", {
      dynamicPath: dynamicEndpoints[key].path,
      getCacheKey: dynamicEndpoints[key].cacheKey,
      tagType: dynamicEndpoints[key].tagType,
    });
  return {
    getMenu: createEndpoint("menu"),
    getByOwner: createEndpoint("owner"),
  };
};

const businessEndpoint = (builder) => ({
  ...crudEndpoints(ENDPOINTS.businesses.base, {
    prefix: "Business",
    tagType: "Business",
  })(builder),
  ...endpoints(builder),
});

const apiBusiness = api.injectEndpoints({
  endpoints: businessEndpoint,
  overrideExisting: false,
});

export const {
  useCreateBusinessMutation,
  useGetAllBusinessQuery,
  useGetOneBusinessQuery,
  useUpdateBusinessMutation,
  useDeleteBusinessMutation,
  useGetMenuQuery,
  useGetByOwnerQuery,
} = apiBusiness;