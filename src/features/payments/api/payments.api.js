import { api, createEndpointBuilder } from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

const paymentsEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);

  return {
    create: endpoint(ENDPOINTS.payments.base, "create"),
    verify: endpoint("payments-verify", "getOne", {
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
  useCreateMutation,
  useVerifyQuery,
  useCreatePaymentIntentMutation,
  useConfirmPaymentMutation,
} = apiPayments;
