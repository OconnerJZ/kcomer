import { api } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const adminPaymentsApi = api.injectEndpoints({
  endpoints: (builder) => ({
    getAdminPaymentSummary: builder.query({
      query: () => `${ENDPOINTS.admin.payments}/summary`,
      providesTags: [{ type: "Orders", id: "ADMIN_PAYMENT_AUDIT" }],
    }),
    getAdminTransferPayments: builder.query({
      query: ({ q = "", status = "", businessId = "", limit = 50 } = {}) => ({
        url: `${ENDPOINTS.admin.payments}/transfers`,
        params: { q, status, businessId, limit },
      }),
      providesTags: [{ type: "Orders", id: "ADMIN_PAYMENT_AUDIT" }],
    }),
    getAdminTransferPayment: builder.query({
      query: ({ orderId }) => `${ENDPOINTS.admin.payments}/transfers/${orderId}`,
      providesTags: (_result, _error, { orderId }) => [{ type: "Orders", id: `transfer-audit-${orderId}` }],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetAdminPaymentSummaryQuery,
  useGetAdminTransferPaymentsQuery,
  useGetAdminTransferPaymentQuery,
} = adminPaymentsApi;
