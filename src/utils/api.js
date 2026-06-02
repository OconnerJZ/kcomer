import { clientAxiosBaseQuery } from "@Config/axios/methodRequest";
import { createApi } from "@reduxjs/toolkit/query/react";
import * as optimisticHandlers from "./optimisticUpdates";

export const api = createApi({
  reducerPath: "api",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: clientAxiosBaseQuery(),
  keepUnusedDataFor: 60 * 60,
  endpoints: () => ({}),
});

export const builders = ({
  api,
  builder,
  resource,
  prefix,
  dynamicPath,
  getCacheKey = () => undefined,
  isJSON = true,
  useOptimisticUpdates = true,
}) => {

  const getName = (operation) => {
    if (!prefix) return operation;
    return `${operation}${prefix}`;
  };

  return {
    [getName("getAll")]: builder.query({
      query: (arg) => (dynamicPath ? dynamicPath(arg) : `/${resource}`),
    }),

    [getName("getOne")]: builder.query({
      query: (id) => `/${resource}/${id}`,
    }),

    [getName("create")]: builder.mutation({
      query: (payload) => ({
        url: `/${resource}`,
        method: "POST",
        data: payload,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onCreate(api, getCacheKey, getName("getAll")),
      }),
    }),

    [getName("update")]: builder.mutation({
      query: ({ id, body }) => ({
        url: dynamicPath ? dynamicPath({ id, body }) : `/${resource}/${id}`,
        method: "PUT",
        data: body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onUpdate(api, getCacheKey, getName("getAll")),
      }),
    }),

    [getName("patch")]: builder.mutation({
      query: ({ id, body }) => ({
        url: dynamicPath ? dynamicPath({ id, body }) : `/${resource}/${id}`,
        method: "PATCH",
        data: body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onUpdate(api, getCacheKey, getName("getAll")),
      }),
    }),

    [getName("delete")]: builder.mutation({
      query: (id) => ({
        url: `/${resource}/${id}`,
        method: "DELETE",
      }),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onDelete(api, getCacheKey, getName("getAll")),
      }),
    }),
  };
};

export const crudEndpoints =
  (resource, config = {}) =>
  (builder) => {
    return builders({
      api,
      builder,
      resource,
      ...config,
    });
  };

export const createEndpointBuilder = (api, builder) => {
  return (resource, method, config = {}) => {
    return builders({
      api,
      builder,
      resource,
      ...config,
    })[method];
  };
};

export default api;
