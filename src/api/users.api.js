import { api, crudEndpoints } from "@Utils/api";
import { ENDPOINTS } from "@Const/api";

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
