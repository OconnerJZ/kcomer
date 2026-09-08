import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const adminAuditApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAuditSummary: builder.query({
      query: () => `${ENDPOINTS.admin.audit}/summary`,
    }),
    getAdminAuditEvents: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.admin.audit,
        params,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminAuditSummaryQuery,
  useGetAdminAuditEventsQuery,
} = adminAuditApi;
