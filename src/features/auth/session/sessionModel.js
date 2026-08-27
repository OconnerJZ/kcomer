import { normalizeSessionUser, normalizeUser } from "@Features/users/model/user";

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
  const refreshedToken = userData?.token || currentUser?.token;
  if (!refreshedToken) {
    throw new Error("Sesión no válida");
  }

  return normalizeSessionUser({
    user: {
      ...normalizeUser(currentUser),
      ...normalizeUser(userData),
    },
    token: refreshedToken,
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
