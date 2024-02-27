import axios from "axios";
// import { decrypt, encrypt, getAccessToken } from "@Utils/auth";

const clienteAxios = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  headers: {
    "X-Requested-With": "XMLHttpRequest",
  },
  // transformRequest: [(data) => encrypt({ data, crypto: true })],
  // transformResponse: [(data) => decrypt({ data, crypto: false })],
});
// clienteAxios.interceptors.request.use((config) => {
//   const accessToken = getAccessToken();
//   config.headers.Authorization = `Bearer ${accessToken}`;
//   return config;
// });

export default clienteAxios;
