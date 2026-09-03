import { useCallback, useEffect, useRef, useState } from "react";
import { useGetMeQuery } from "../api/auth.api";
import {
  createSessionUser,
  getAuthErrorMessage,
  isValidSessionUser,
  refreshSessionUser,
} from "../session/sessionModel";
import { sessionStorage } from "../session/sessionStorage";
import { isTokenExpired } from "../utils/token";

const SESSION_CHECK_INTERVAL = 15 * 60 * 1000;

export const useAuthSession = () => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldFetchMe, setShouldFetchMe] = useState(false);
  const sessionCheckInterval = useRef(null);
  const {
    data: meData,
    isLoading: isMeLoading,
    isSuccess: isMeSuccess,
    isError: isMeError,
    refetch: refetchMe,
  } = useGetMeQuery(undefined, { skip: !shouldFetchMe });

  const clearSession = useCallback(() => {
    sessionStorage.clear();
    setUser(null);
    setError(null);
    setShouldFetchMe(false);

    if (sessionCheckInterval.current) {
      clearInterval(sessionCheckInterval.current);
      sessionCheckInterval.current = null;
    }
  }, []);

  const persistSessionUser = useCallback((sessionUser) => {
    if (!sessionStorage.save(sessionUser)) return false;
    setUser(sessionUser);
    setError(null);
    setShouldFetchMe(true);
    return true;
  }, []);

  const persistMeData = useCallback((userData) => {
    const currentUser = sessionStorage.load();
    const updatedUser = refreshSessionUser({ currentUser, userData });
    if (!sessionStorage.save(updatedUser)) {
      throw new Error("No se pudo guardar la actualización");
    }
    setUser(updatedUser);
    return updatedUser;
  }, []);

  const validateToken = useCallback(async () => {
    try {
      const result = await refetchMe();
      if (!result.data) throw new Error("Token validation failed");
      persistMeData(result.data);
      return { success: true };
    } catch (requestError) {
      console.error("Token validation error:", requestError);
      clearSession();
      return { success: false, error: requestError.message };
    }
  }, [clearSession, persistMeData, refetchMe]);

  const startSessionWatcher = useCallback(() => {
    if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);

    sessionCheckInterval.current = setInterval(() => {
      const current = sessionStorage.load();
      if (!current?.token || isTokenExpired(current.token)) {
        clearSession();
        return;
      }
      validateToken();
    }, SESSION_CHECK_INTERVAL);
  }, [clearSession, validateToken]);

  const completeAuthentication = useCallback((authData) => {
    try {
      const sessionUser = createSessionUser(authData);
      if (!persistSessionUser(sessionUser)) {
        throw new Error("No se pudo guardar la sesión");
      }
      startSessionWatcher();
      return { success: true, user: sessionUser };
    } catch (sessionError) {
      console.error("Auth success handler error:", sessionError);
      return { success: false, error: sessionError.message };
    }
  }, [persistSessionUser, startSessionWatcher]);

  const updateUser = useCallback(async () => {
    setError(null);
    try {
      const result = await refetchMe();
      if (!result.data) throw new Error("No se pudo actualizar el usuario");
      const updatedUser = persistMeData(result.data);
      return { success: true, user: updatedUser };
    } catch (requestError) {
      const message = getAuthErrorMessage(requestError);
      setError(message);
      return { success: false, error: message };
    }
  }, [persistMeData, refetchMe]);

  const logout = useCallback(() => {
    clearSession();
    return { success: true };
  }, [clearSession]);

  const refreshUser = useCallback(() => updateUser(), [updateUser]);
  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (isMeSuccess && meData) {
      try {
        persistMeData(meData);
      } catch (refreshError) {
        console.error("Error refreshing session user:", refreshError);
        clearSession();
      }
    }

    if (isMeError) {
      console.warn("Error validating token, clearing session");
      clearSession();
    }
  }, [clearSession, isMeError, isMeSuccess, meData, persistMeData]);

  useEffect(() => {
    setAuthLoading(true);
    const savedUser = sessionStorage.load();

    if (!savedUser) {
      setAuthLoading(false);
      return undefined;
    }

    if (!isValidSessionUser(savedUser) || isTokenExpired(savedUser.token)) {
      clearSession();
      setAuthLoading(false);
      return undefined;
    }

    setUser(savedUser);
    setShouldFetchMe(true);
    startSessionWatcher();
    setAuthLoading(false);

    return () => {
      if (sessionCheckInterval.current) clearInterval(sessionCheckInterval.current);
    };
  }, [clearSession, startSessionWatcher]);

  useEffect(() => {
    const onUnauthorized = () => clearSession();
    window.addEventListener("auth:unauthorized", onUnauthorized);
    return () => window.removeEventListener("auth:unauthorized", onUnauthorized);
  }, [clearSession]);

  return {
    user,
    error,
    loading: authLoading || isMeLoading,
    setAuthError: setError,
    completeAuthentication,
    logout,
    updateUser,
    refreshUser,
    validateToken,
    clearError,
  };
};

export default useAuthSession;
