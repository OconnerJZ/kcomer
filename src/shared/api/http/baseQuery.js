import axios from "axios";
import client from "./client";

export const clientAxiosBaseQuery = () => async (config) => {
  try {
    const result = await client.request({
      url: config?.url ?? config,
      method: config?.method,
      data: config?.data,
      params: config?.params,
      headers: config?.headers,
    });

    const normalizedData = result.data?.data ?? result.data;
    return { data: normalizedData };
  } catch (axiosError) {
    const err = axiosError;
    return {
      error: {
        status: err.response?.status ?? "NETWORK_ERROR",
        data: err.response?.data || err.friendlyMessage || err.message,
      },
    };
  }
};

export const axiosGet = async ({ url, params, headers, responseType }) => {
  const response = await axios.get(url, {
    params,
    headers,
    responseType,
  });
  return response.data;
};
