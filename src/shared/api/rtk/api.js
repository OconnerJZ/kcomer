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
  ],
  endpoints: () => ({}),
});

const getArgId = (arg) => (arg && typeof arg === "object" ? arg.id : arg);

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
      query: (arg) => (dynamicPath ? dynamicPath(arg) : `/${resource}`),
      providesTags: provideListTags(tagType),
    }),
    [getName("getOne")]: builder.query({
      query: (arg) => (dynamicPath ? dynamicPath(arg) : `/${resource}/${arg}`),
      providesTags: provideOneTag(tagType),
    }),
    [getName("create")]: builder.mutation({
      query: (payload) => ({
        url: `/${resource}`,
        method: "POST",
        data: payload,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateList(tagType),
    }),
    [getName("update")]: builder.mutation({
      query: ({ id, body }) => ({
        url: dynamicPath ? dynamicPath({ id, body }) : `/${resource}/${id}`,
        method: "PUT",
        data: body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateItemAndList(tagType),
    }),
    [getName("patch")]: builder.mutation({
      query: ({ id, body }) => ({
        url: dynamicPath ? dynamicPath({ id, body }) : `/${resource}/${id}`,
        method: "PATCH",
        data: body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateItemAndList(tagType),
    }),
    [getName("delete")]: builder.mutation({
      query: (arg) => ({
        url: dynamicPath ? dynamicPath(arg) : `/${resource}/${arg}`,
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
