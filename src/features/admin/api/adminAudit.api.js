import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const auditTag = { type: "AdminAudit", id: "LEDGER" };

const adminAuditApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminAuditSummary: builder.query({
      query: () => `${ENDPOINTS.admin.audit}/summary`,
      providesTags: [auditTag],
    }),
    getAdminAuditEvents: builder.query({
      query: (params = {}) => ({
        url: ENDPOINTS.admin.audit,
        params,
      }),
      providesTags: [auditTag],
    }),
  }),
  overrideExisting: false,
});

export export const {
  useGetAdminAuditSummaryQuery,
  useGetAdminAuditEventsQuery,
} = adminAuditApi;
