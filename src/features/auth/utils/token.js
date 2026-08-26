import { jwtDecode } from "jwt-decode";

export const getTokenExp = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token)?.exp ?? null;
  } catch {
    return null;
  }
};

export const isTokenExpired = (token, skewSeconds = 30) => {
  const exp = getTokenExp(token);
  if (!exp) return true;
  return Date.now() >= (exp - skewSeconds) * 1000;
};
