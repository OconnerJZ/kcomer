import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLoginGoogleMutation,
} from "@Features/auth/api/auth.api";
import { isTokenExpired } from "@Features/auth/utils/token";
import { sessionStorage } from "@Features/auth/session/sessionStorage";
import {
  createSessionUser,
  getAuthErrorMessage,
  isValidSessionUser,
  prepareRegisterPayload,
  refreshSessionUser,
} from "@Features/auth/session/sessionModel";

const AuthContext = createContext();
const SESSION_CHECK_INTERVAL = 15 * 60 * 1000;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldFetchMe, setShouldFetchMe] = useState(false);
  const sessionCheckInterval = useRef(null);

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [loginGoogleMutation, { isLoading: isGoogleLoginLoading }] = useLoginGoogleMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] = useRegisterMutation();

  const {
    data: meData,
    isLoading: isMeLoading,
    isSuccess: isMeSuccess,
    isError: isMeError,
    refetch: refetchMe,
  } = useGetMeQuery(undefined, { skip: !shouldFetchMe });

  const saveSession = useCallback((userData) => {
    try {
      const validatedUser = createSessionUser({
        user: userData,
        token: userData.token,
      });

      if (!sessionStorage.save(validatedUser)) return false;

      setUser(validatedUser);
      setError(null);
      setShouldFetchMe(true);
      return true;
    } catch (err) {
      console.error("Error saving session:", err);
      setError(err.message);
      return false;
    }
  }, []);

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
    } catch (err) {
      console.error("Token validation error:", err);
      clearSession();
      return { success: false, error: err.message };
    }
  }, [refetchMe, persistMeData, clearSession]);

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
  }, [validateToken, clearSession]);

  const handleAuthSuccess = useCallback(
    (authData) => {
      try {
        const userData = createSessionUser(authData);
        if (!saveSession(userData)) throw new Error("No se pudo guardar la sesión");
        startSessionWatcher();
        return { success: true, user: userData };
      } catch (err) {
        console.error("Auth success handler error:", err);
        return { success: false, error: err.message };
      }
    },
    [saveSession, startSessionWatcher],
  );

  const login = useCallback(async (credentials) => {
    if (!credentials?.email || !credentials?.password) {
      return { success: false, error: "Email y contraseña son requeridos" };
    }
    setError(null);
    try {
      return handleAuthSuccess(await loginMutation(credentials).unwrap());
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, [loginMutation, handleAuthSuccess]);

  const loginWithGoogle = useCallback(async (payload) => {
    if (!payload?.idToken) return { success: false, error: "Token de Google requerido" };
    setError(null);
    try {
      return handleAuthSuccess(await loginGoogleMutation(payload).unwrap());
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, [loginGoogleMutation, handleAuthSuccess]);

  const register = useCallback(async (userData) => {
    setError(null);
    try {
      return handleAuthSuccess(await registerMutation(prepareRegisterPayload(userData)).unwrap());
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, [registerMutation, handleAuthSuccess]);

  const logout = useCallback(() => {
    clearSession();
    return { success: true };
  }, [clearSession]);

  const updateUser = useCallback(async () => {
    setError(null);
    try {
      const result = await refetchMe();
      if (!result.data) throw new Error("No se pudo actualizar el usuario");
      const updatedUser = persistMeData(result.data);
      return { success: true, user: updatedUser };
    } catch (err) {
      const message = getAuthErrorMessage(err);
      setError(message);
      return { success: false, error: message };
    }
  }, [refetchMe, persistMeData]);

  const refreshUser = useCallback(() => updateUser(), [updateUser]);
  const clearError = useCallback(() => setError(null), []);

  useEffect(() => {
    if (isMeSuccess && meData) {
      try {
        persistMeData(meData);
      } catch (err) {
        console.error("Error refreshing session user:", err);
        clearSession();
      }
    }

    if (isMeError) {
      console.warn("Error validating token, clearing session");
      clearSession();
    }
  }, [isMeSuccess, isMeError, meData, clearSession, persistMeData]);

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

  const loading = authLoading || isLoginLoading || isGoogleLoginLoading || isRegisterLoading || isMeLoading;

  const value = useMemo(() => ({
    user,
    loading,
    error,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    register,
    logout,
    updateUser,
    refreshUser,
    validateToken,
    clearError,
  }), [user, loading, error, login, loginWithGoogle, register, logout, updateUser, refreshUser, validateToken, clearError]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
};

export default useAuth;
