import { api, crudEndpoints } from "@Shared/api/rtk/api";
import { ENDPOINTS } from "@Shared/api/endpoints";

const apiUsers = api.injectEndpoints({
  endpoints: crudEndpoints(ENDPOINTS.users.base, { prefix: "Users" }),
  overrideExisting: false,
});

export const {
  useCreateUsersMutation,
  useGetAllUsersQuery,
  useGetOneUsersQuery,
  useUpdateUsersMutation,
  useDeleteUsersMutation,
} = apiUsers;
