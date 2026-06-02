import { api, createEndpointBuilder } from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

const authEndpoints = (builder) => {
  const endpoint = createEndpointBuilder(api, builder);
  return {
    login: endpoint(ENDPOINTS.auth.login, "create"),
    register: endpoint(ENDPOINTS.auth.register, "create"),
    getMe: endpoint(ENDPOINTS.auth.me, "getAll"),
    loginGoogle: endpoint(ENDPOINTS.auth.google, "create"),
  };
};

const apiAuth = api.injectEndpoints({
  endpoints: authEndpoints,
  overrideExisting: false,
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLoginGoogleMutation,
} = apiAuth;
