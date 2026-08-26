import { clientAxiosBaseQuery } from "@Config/axios/methodRequest";
import { createApi } from "@reduxjs/toolkit/query/react";
import * as optimisticHandlers from "./optimisticUpdates";

export const api = createApi({
  reducerPath: "api",
  refetchOnFocus: true,
  refetchOnReconnect: true,
  baseQuery: clientAxiosBaseQuery(),
  keepUnusedDataFor: 60 * 60,
  // Tipos de tag para invalidación declarativa de caché.
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

// ============================================================================
// TAG HELPERS
// ============================================================================
// Convención estándar de RTK Query:
//  - Cada lista provee un tag { type, id: "LIST" } + un tag por item.
//  - Las mutaciones invalidan el "LIST" (y el item afectado) para que RTK
//    Query re-fetchee automáticamente las queries suscritas.
//
// Como user-list y business-list comparten el mismo { type: "Orders", id:
// "LIST" }, cualquier mutación de orden refresca ambas vistas del mismo actor.
// La sincronización entre actores distintos (owner ↔ cliente) la siguen dando
// los sockets; los tags cubren el refetch del propio actor sin polling.

const getArgId = (arg) => (arg && typeof arg === "object" ? arg.id : arg);

const provideListTags = (tagType) => (result) => {
  if (!tagType) return [];
  const items = Array.isArray(result) ? result : result?.data ?? [];
  const itemTags = items
    .filter((it) => it && it.id != null)
    .map((it) => ({ type: tagType, id: it.id }));
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

// ============================================================================
// ENDPOINT BUILDERS
// ============================================================================

export const builders = ({
  api,
  builder,
  resource,
  prefix,
  dynamicPath,
  getCacheKey = () => undefined,
  isJSON = true,
  tagType, // ⟵ nuevo: activa providesTags / invalidatesTags
  // Optimistic updates apagado por defecto: los tags ya reconcilian la caché
  // y los handlers previos apuntaban a un getAll que nadie consumía.
  useOptimisticUpdates = false,
}) => {
  const getName = (operation) => {
    if (!prefix) return operation;
    return `${operation}${prefix}`;
  };

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
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onCreate(
          api,
          getCacheKey,
          getName("getAll"),
        ),
      }),
    }),

    [getName("update")]: builder.mutation({
      query: ({ id, body }) => ({
        url: dynamicPath ? dynamicPath({ id, body }) : `/${resource}/${id}`,
        method: "PUT",
        data: body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateItemAndList(tagType),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onUpdate(
          api,
          getCacheKey,
          getName("getAll"),
        ),
      }),
    }),

    [getName("patch")]: builder.mutation({
      query: ({ id, body }) => ({
        url: dynamicPath ? dynamicPath({ id, body }) : `/${resource}/${id}`,
        method: "PATCH",
        data: body,
        headers: isJSON ? { "Content-Type": "application/json" } : undefined,
      }),
      invalidatesTags: invalidateItemAndList(tagType),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onUpdate(
          api,
          getCacheKey,
          getName("getAll"),
        ),
      }),
    }),

    [getName("delete")]: builder.mutation({
      query: (arg) => ({
        url: dynamicPath ? dynamicPath(arg) : `/${resource}/${arg}`,
        method: "DELETE",
      }),
      invalidatesTags: invalidateItemAndList(tagType),
      ...(useOptimisticUpdates && {
        onQueryStarted: optimisticHandlers.onDelete(
          api,
          getCacheKey,
          getName("getAll"),
        ),
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