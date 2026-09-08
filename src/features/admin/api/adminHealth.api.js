import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const adminHealthApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminHealth: builder.query({
      query: () => ENDPOINTS.admin.health,
      providesTags: [{ type: "Admin", id: "HEALTH" }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetAdminHealthQuery } = adminHealthApi;
