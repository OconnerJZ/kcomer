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
import { authAPI, handleApiError } from "@Api";

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
};

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const tokenRefreshInterval = useRef(null);
  const isValidatingToken = useRef(false);

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
    // Prevent concurrent validation requests
    if (isValidatingToken.current) {
      return;
    }

    isValidatingToken.current = true;

    try {
      const response = await authAPI.getMe();

      if (response.data.success) {
        const currentUser = storage.load();

        if (currentUser && currentUser.token) {
          const updatedUser = {
            ...response.data.data,
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
    } finally {
      isValidatingToken.current = false;
    }
  }, [saveSession, clearSession]);

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
    [saveSession, startTokenRefresh]
  );

  const authRequest = useCallback(
    async (requestFn, errorMessage = "Error de autenticación") => {
      setError(null);

      try {
        const response = await requestFn();

        if (!response?.data?.success) {
          throw new Error(response?.data?.message || errorMessage);
        }

        return handleAuthSuccess(response.data.data);
      } catch (err) {
        const errorData = handleApiError(err);
        setError(errorData.message);
        return { success: false, error: errorData.message };
      }
    },
    [handleAuthSuccess]
  );

  const login = useCallback(
    async (credentials) => {
      if (!credentials?.email || !credentials?.password) {
        return {
          success: false,
          error: "Email y contraseña son requeridos",
        };
      }

      return authRequest(
        () => authAPI.login(credentials),
        "Error al iniciar sesión"
      );
    },
    [authRequest]
  );

  const loginWithGoogle = useCallback(
    async (idToken) => {
      if (!idToken) {
        return { success: false, error: "Token de Google requerido" };
      }

      return authRequest(
        () => authAPI.loginGoogle(idToken),
        "Error al iniciar sesión con Google"
      );
    },
    [authRequest]
  );

  const register = useCallback(
    async (userData) => {
      try {
        const payload = authUtils.prepareRegisterPayload(userData);
        return authRequest(
          () => authAPI.register(payload),
          "Error al registrar usuario"
        );
      } catch (err) {
        return { success: false, error: err.message };
      }
    },
    [authRequest]
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
      const response = await authAPI.getMe();

      if (!response?.data?.success) {
        throw new Error("No se pudo actualizar el usuario");
      }

      const currentUser = storage.load();

      if (!currentUser || !currentUser.token) {
        throw new Error("Sesión no válida");
      }

      const updatedUser = {
        ...currentUser,
        ...response.data.data,
        token: currentUser.token,
        lastUpdated: new Date().toISOString(),
      };

      if (storage.save(updatedUser)) {
        setUser(updatedUser);
        return { success: true, user: updatedUser };
      }

      throw new Error("No se pudo guardar la actualización");
    } catch (err) {
      const errorData = handleApiError(err);
      setError(errorData.message);
      return { success: false, error: errorData.message };
    }
  }, []);

  const refreshUser = useCallback(() => {
    return updateUser();
  }, [updateUser]);

  // ============================================================================
  // INITIALIZATION
  // ============================================================================

  useEffect(() => {
    const initializeAuth = async () => {
      setLoading(true);

      const savedUser = storage.load();

      if (!savedUser) {
        setLoading(false);
        return;
      }

      if (!authUtils.validateUserData(savedUser)) {
        console.warn("Invalid user data in storage");
        clearSession();
        setLoading(false);
        return;
      }

      setUser(savedUser);

      // Validate token in background
      const result = await validateToken();

      if (result?.success) {
        startTokenRefresh();
      }

      setLoading(false);
    };

    initializeAuth();

    // Cleanup on unmount
    return () => {
      if (tokenRefreshInterval.current) {
        clearInterval(tokenRefreshInterval.current);
      }
    };
  }, [validateToken, startTokenRefresh, clearSession]);

  // ============================================================================
  // CONTEXT VALUE
  // ============================================================================

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
      error
    ]
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