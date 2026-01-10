import apiClient from "./config";

export const authAPI = {
  login: (credentials) => apiClient.post("/api/auth/login", credentials),
  register: (data) => apiClient.post("/api/auth/register", data),
  getMe: () => apiClient.get("/api/auth/me"),
  loginGoogle: (idToken) => apiClient.post("/api/auth/google", idToken),
  loginFacebook: () => apiClient.post("/api/auth/facebook"),
};