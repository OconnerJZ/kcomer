import { createApi } from "@reduxjs/toolkit/query/react";
import { clientAxiosBaseQuery } from "@Shared/api/http/baseQuery";

export const api = createApi({
  reducerPath: "api",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: clientAxiosBaseQuery(),
  keepUnusedDataFor: 60 * 60,
  tagTypes: [
    "Business",
    "Menu",
    "Orders",
    "Stats",
    "Reviews",
    "Users",
    "Catalogs",
    "BusinessTeam",
    "SharedOrder",
    "BusinessPlan",
  ],
  endpoints: () => ({}),
});

const normalizePath = (path = "") => `/${String(path).replace(/^\/+/, "")}`;
const getArgId = (arg) => (arg && typeof arg === "object" ? arg.id : arg);

const resolvePath = ({ resource, dynamicPath, arg, suffix }) => {
  if (dynamicPath) return normalizePath(dynamicPath(arg));
  const base = normalizePath(resource);
  return suffix == null ? base : `${base}/${suffix}`;
};

const provideListTags = (tagType) => (result) => {
  if (!tagType) return [];
  const items = Array.isArray(result) ? result : result?.data ?? [];
  const itemTags = items
    .filter((item) => item && item.id != null)
    .map((item) => ({ type: tagType, id: item.id }));
  return [{ type: tagType, id: "LIST" }, ...itemTags];
};

const provideOneTag = (tagType) => (result, error, arg) =>
  tagType ? [{ type: tagType, id: getArgId(arg) }] : [];

const invalidateList = (tagType) => () =>
  tagType ? [{ type: tagType, id: "LIST" }] : [];

const invalidateItemAndList = (tagType) => (result, error, arg) => {
  if (!tagType) return [];
  const id = getArgId(arg);
  return [
    { type: tagType, id: "LIST" },
    ...(id != null ? [{ type: tagType, id }] : []),
  ];
};

export const builders = ({
  builder,
  resource,
  prefix,
  dynamicPath,
  isJSON = true,
  tagType,
}) => {
  const getName = (operation) => (prefix ? `${operation}${prefix}` : operation);

  return {
    [getName("getAll")]: builder.query({
      query: (arg) => resolvePath({ resource, dynamicPath, arg }),
      providesTags: provideListTags(tagType),
    }),
    [getName("getOne")]: builder.query({
      query: (arg) =>
        resolvePath({ resource, dynamicPath, arg, suffix: dynamicPath ? undefined : arg }),
      providesTags: provideOneTag(tagType),
    }),
    [getName("create")]: builder.mutation({
      query: (payload) => ({
        url: resolvePath({ resource, dynamicPath, arg: payload }),
        method: "POST",
        data: payload,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateList(tagType),
    }),
    [getName("update")]: builder.mutation({
      query: (arg) => ({
        url: resolvePath({
          resource,
          dynamicPath,
          arg,
          suffix: dynamicPath ? undefined : arg.id,
        }),
        method: "PUT",
        data: arg.body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateItemAndList(tagType),
    }),
    [getName("patch")]: builder.mutation({
      query: (arg) => ({
        url: resolvePath({
          resource,
          dynamicPath,
          arg,
          suffix: dynamicPath ? undefined : arg.id,
        }),
        method: "PATCH",
        data: arg.body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateItemAndList(tagType),
    }),
    [getName("delete")]: builder.mutation({
      query: (arg) => ({
        url: resolvePath({
          resource,
          dynamicPath,
          arg,
          suffix: dynamicPath ? undefined : arg,
        }),
        method: "DELETE",
      }),
      invalidatesTags: invalidateItemAndList(tagType),
    }),
  };
};

export const crudEndpoints =
  (resource, config = {}) =>
  (builder) =>
    builders({ builder, resource, ...config });

export const createEndpointBuilder = (apiInstance, builder) =>
  (resource, method, config = {}) =>
    builders({ builder, resource, ...config })[method];

export default api;
