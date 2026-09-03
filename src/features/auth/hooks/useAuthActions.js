import { useCallback } from "react";
import {
  useLoginGoogleMutation,
  useLoginMutation,
  useRegisterMutation,
} from "../api/auth.api";
import { getAuthErrorMessage, prepareRegisterPayload } from "../session/sessionModel";

export const useAuthActions = ({ completeAuthentication, setAuthError }) => {
  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [loginGoogleMutation, { isLoading: isGoogleLoginLoading }] = useLoginGoogleMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const runAuthentication = useCallback(async (request) => {
    setAuthError(null);
    try {
      return completeAuthentication(await request());
    } catch (error) {
      const message = getAuthErrorMessage(error);
      setAuthError(message);
      return { success: false, error: message };
    }
  }, [completeAuthentication, setAuthError]);

  const login = useCallback(async (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }
    return runAuthentication(() => loginMutation(credentials).unwrap());
  }, [loginMutation, runAuthentication]);

  const loginWithGoogle = useCallback(async (payload) => {
    if (!payload?.idToken) {
      return { success: false, error: "Token de Google requerido" };
    }
    return runAuthentication(() => loginGoogleMutation(payload).unwrap());
  }, [loginGoogleMutation, runAuthentication]);

  const register = useCallback(async (userData) => runAuthentication(
    () => registerMutation(prepareRegisterPayload(userData)).unwrap(),
  ), [registerMutation, runAuthentication]);

  return {
    login,
    loginWithGoogle,
    register,
    loading: isLoginLoading || isGoogleLoginLoading || isRegisterLoading,
  };
};

export default useAuthActions;
