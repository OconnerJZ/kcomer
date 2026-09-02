import { normalizeSessionUser, normalizeUser } from "../../users/model/user.js";

export const createSessionUser = (authResponse) => {
  if (!authResponse?.user || !authResponse?.token) {
    throw new Error("Datos de autenticación incompletos");
  }

  return normalizeSessionUser({
    user: authResponse.user,
    token: authResponse.token,
  });
};

export const refreshSessionUser = ({ currentUser, userData }) => {
  if (!currentUser?.token) {
    throw new Error("Sesión no válida");
  }

  return normalizeSessionUser({
    user: {
      ...normalizeUser(currentUser),
      ...normalizeUser(userData),
    },
    token: currentUser.token,
  });
};

export const isValidSessionUser = (userData) =>
  Boolean(userData?.token && userData?.id);

export const prepareRegisterPayload = (userData) => {
  if (!userData?.name || !userData?.email || !userData?.password) {
    throw new Error("Datos de registro incompletos");
  }

  return {
    user_name: userData.name,
    email: userData.email,
    password: userData.password,
    ...(userData.isBusiness && { isBusiness: true }),
  };
};

export const getAuthErrorMessage = (error) =>
  error?.data?.message || error?.message || "Error desconocido";
