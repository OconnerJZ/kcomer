import {
  createContext,
  useContext,
  useState,
  useEffect,
  useMemo,
  useCallback,
  useRef,
} from "react";
import PropTypes from "prop-types";
import { useGoogleLogin } from "@react-oauth/google";
import {
  useLoginMutation,
  useRegisterMutation,
  useGetMeQuery,
  useLoginGoogleMutation,
} from "@Api/auth.api";

// ============================================================================
// CONSTANTS
// ============================================================================

const AuthContext = createContext();
const STORAGE_KEY = "qscome_user";
const TOKEN_REFRESH_INTERVAL = 15 * 60 * 1000; // 15 minutes

// ============================================================================
// STORAGE UTILITIES
// ============================================================================

const storage = {
  save: (userData) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(userData));
      return true;
    } catch (error) {
      console.error("Error saving user data:", error);
      return false;
    }
  },

  load: () => {
    try {
      const data = localStorage.getItem(STORAGE_KEY);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("Error loading user data:", error);
      return null;
    }
  },

  clear: () => {
    try {
      localStorage.removeItem(STORAGE_KEY);
      return true;
    } catch (error) {
      console.error("Error clearing user data:", error);
      return false;
    }
  },
};

// ============================================================================
// AUTH UTILITIES
// ============================================================================

const authUtils = {
  createUserData: (authResponse) => {
    if (!authResponse?.user || !authResponse?.token) {
      throw new Error("Datos de autenticación incompletos");
    }

    return {
      ...authResponse.user,
      token: authResponse.token,
      lastUpdated: new Date().toISOString(),
    };
  },

  validateUserData: (userData) => {
    return userData && userData.token && userData.id;
  },

  prepareRegisterPayload: (userData) => {
    if (!userData.name || !userData.email || !userData.password) {
      throw new Error("Datos de registro incompletos");
    }

    return {
      user_name: userData.name,
      email: userData.email,
      password: userData.password,
    };
  },

  handleApiError: (error) => {
    if (error?.data?.message) {
      return { message: error.data.message };
    }
    if (error?.message) {
      return { message: error.message };
    }
    return { message: "Error desconocido" };
  },
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [error, setError] = useState(null);
  const [shouldFetchMe, setShouldFetchMe] = useState(false);

  const tokenRefreshInterval = useRef(null);

  // ============================================================================
  // RTK QUERY HOOKS
  // ============================================================================

  const [loginMutation, { isLoading: isLoginLoading }] = useLoginMutation();
  const [loginGoogleMutation, { isLoading: isGoogleLoginLoading }] =
    useLoginGoogleMutation();
  const [registerMutation, { isLoading: isRegisterLoading }] =
    useRegisterMutation();

  // Solo ejecuta getMe cuando hay un token guardado
  const {
    data: meData,
    isLoading: isMeLoading,
    isSuccess: isMeSuccess,
    isError: isMeError,
    refetch: refetchMe,
  } = useGetMeQuery(undefined, {
    skip: !shouldFetchMe, // Solo ejecuta si hay token
  });

  // ============================================================================
  // SESSION MANAGEMENT
  // ============================================================================

  const saveSession = useCallback((userData) => {
    try {
      const validatedUser = authUtils.createUserData({
        user: userData,
        token: userData.token,
      });

      if (storage.save(validatedUser)) {
        setUser(validatedUser);
        setError(null);
        setShouldFetchMe(true); // Habilita el fetch de /me
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error saving session:", err);
      setError(err.message);
      return false;
    }
  }, []);

  const clearSession = useCallback(() => {
    storage.clear();
    setUser(null);
    setError(null);
    setShouldFetchMe(false); // Deshabilita el fetch de /me

    // Clear token refresh interval
    if (tokenRefreshInterval.current) {
      clearInterval(tokenRefreshInterval.current);
      tokenRefreshInterval.current = null;
    }
  }, []);

  // ============================================================================
  // TOKEN VALIDATION & REFRESH
  // ============================================================================

  const validateToken = useCallback(async () => {
    try {
      const result = await refetchMe();

      if (result.data) {
        const currentUser = storage.load();

        if (currentUser && currentUser.token) {
          const updatedUser = {
            ...result.data,
            token: currentUser.token,
            lastUpdated: new Date().toISOString(),
          };

          saveSession(updatedUser);
          return { success: true };
        }
      } else {
        throw new Error("Token validation failed");
      }
    } catch (err) {
      console.error("Token validation error:", err);
      clearSession();
      return { success: false, error: err.message };
    }
  }, [refetchMe, saveSession, clearSession]);

  const startTokenRefresh = useCallback(() => {
    // Clear any existing interval
    if (tokenRefreshInterval.current) {
      clearInterval(tokenRefreshInterval.current);
    }

    // Set up new interval
    tokenRefreshInterval.current = setInterval(() => {
      validateToken();
    }, TOKEN_REFRESH_INTERVAL);
  }, [validateToken]);

  // ============================================================================
  // AUTHENTICATION OPERATIONS
  // ============================================================================

  const handleAuthSuccess = useCallback(
    (authData) => {
      try {
        const userData = authUtils.createUserData(authData);

        if (saveSession(userData)) {
          startTokenRefresh();
          return { success: true, user: userData };
        }

        throw new Error("No se pudo guardar la sesión");
      } catch (err) {
        console.error("Auth success handler error:", err);
        return { success: false, error: err.message };
      }
    },
    [saveSession, startTokenRefresh],
  );

  const login = useCallback(
    async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return {
          success: false,
          error: "Email y contraseña son requeridos",
        };
      }

      setError(null);

      try {
        const response = await loginMutation(credentials).unwrap();
        return handleAuthSuccess(response);
      } catch (err) {
        const errorData = authUtils.handleApiError(err);
        setError(errorData.message);
        return { success: false, error: errorData.message };
      }
    },
    [loginMutation, handleAuthSuccess],
  );

  const loginWithGoogle = useCallback(
    async (payload) => {
      if (!payload?.idToken) {
        return { success: false, error: "Token de Google requerido" };
      }
      setError(null);
      try {
        const response = await loginGoogleMutation(payload).unwrap();
        return handleAuthSuccess(response);
      } catch (err) {
        const errorData = authUtils.handleApiError(err);
        setError(errorData.message);
        return { success: false, error: errorData.message };
      }
    },
    [loginGoogleMutation, handleAuthSuccess],
  );

  const register = useCallback(
    async (userData) => {
      setError(null);

      try {
        const payload = authUtils.prepareRegisterPayload(userData);
        const response = await registerMutation(payload).unwrap();
        return handleAuthSuccess(response);
      } catch (err) {
        const errorData = authUtils.handleApiError(err);
        setError(errorData.message);
        return { success: false, error: errorData.message };
      }
    },
    [registerMutation, handleAuthSuccess],
  );

  const logout = useCallback(() => {
    clearSession();
    return { success: true };
  }, [clearSession]);

  // ============================================================================
  // USER OPERATIONS
  // ============================================================================

  const updateUser = useCallback(async () => {
    setError(null);

    try {
      const result = await refetchMe();

      if (!result.data) {
        throw new Error("No se pudo actualizar el usuario");
      }

      const currentUser = storage.load();

      if (!currentUser || !currentUser.token) {
        throw new Error("Sesión no válida");
      }

      const updatedUser = {
        ...currentUser,
        ...result.data,
        token: currentUser.token,
        lastUpdated: new Date().toISOString(),
      };

      if (storage.save(updatedUser)) {
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }

      throw new Error("No se pudo guardar la actualización");
    } catch (err) {
      const errorData = authUtils.handleApiError(err);
      setError(errorData.message);
      return { success: false, error: errorData.message };
    }
  }, [refetchMe]);

  const refreshUser = useCallback(() => {
    return updateUser();
  }, [updateUser]);

  // ============================================================================
  // GOOGLE LOGIN HOOK
  // ============================================================================

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      await loginWithGoogle(tokenResponse.access_token);
    },
    onError: (error) => {
      console.error("Google login error:", error);
      setError("Error al iniciar sesión con Google");
    },
  });

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Efecto para sincronizar meData con el usuario local
  useEffect(() => {
    if (isMeSuccess && meData) {
      const currentUser = storage.load();
      if (currentUser && currentUser.token) {
        const updatedUser = {
          ...meData,
          token: currentUser.token,
          lastUpdated: new Date().toISOString(),
        };
        storage.save(updatedUser);
        setUser(updatedUser);
      }
    }

    if (isMeError) {
      console.warn("Error validating token, clearing session");
      clearSession();
    }
  }, [isMeSuccess, isMeError, meData, clearSession]);

  // Efecto de inicialización
  useEffect(() => {
    const initializeAuth = async () => {
      setAuthLoading(true);

      const savedUser = storage.load();

      if (!savedUser) {
        setAuthLoading(false);
        return;
      }

      if (!authUtils.validateUserData(savedUser)) {
        console.warn("Invalid user data in storage");
        clearSession();
        setAuthLoading(false);
        return;
      }

      setUser(savedUser);
      setShouldFetchMe(true); // Habilita el fetch para validar el token

      // Iniciar refresh de token
      startTokenRefresh();

      setAuthLoading(false);
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
    };
  }, [clearSession, startTokenRefresh]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

  const loading =
    authLoading ||
    isLoginLoading ||
    isGoogleLoginLoading ||
    isRegisterLoading ||
    isMeLoading;

  const value = useMemo(
    () => ({
      // State
      user,
      loading,
      error,
      isAuthenticated: !!user,

      // Auth Actions
      login,
      loginWithGoogle,
      googleLogin, // Hook de Google Login
      register,
      logout,

      // User Actions
      updateUser,
      refreshUser,
      validateToken,

      // Utils
      clearError: () => setError(null),
    }),
    [
      user,
      loading,
      error,
      login,
      loginWithGoogle,
      googleLogin,
      register,
      logout,
      updateUser,
      refreshUser,
      validateToken,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
};

export default useAuth;
