import { api, createEndpointBuilder } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const paymentsEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    createPayment: endpoint(ENDPOINTS.payments.base, "create"),
    verifyPayment: endpoint("payments-verify", "getOne", {
      dynamicPath: ({ id }) => `${ENDPOINTS.payments.base}/${id}/verify`,
    }),
    createPaymentIntent: endpoint(ENDPOINTS.payments.intent, "create"),
    confirmPayment: endpoint("payments-confirm", "create", {
      dynamicPath: ({ id }) => `${ENDPOINTS.payments.base}/${id}/confirm`,
    }),
  };
};

const apiPayments = api.injectEndpoints({
  endpoints: paymentsEndpoints,
  overrideExisting: false,
});

export const {
  useCreatePaymentMutation,
  useVerifyPaymentQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = apiPayments;
