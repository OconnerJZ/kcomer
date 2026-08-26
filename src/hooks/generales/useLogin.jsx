import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from "@Context/AuthContext";
import { GOOGLE_CLIENT_ID } from "@Utils/enviroments";
import { initializeGoogleSignIn } from "@Utils/googleAuth";

// ============================================================================
// CONSTANTS
// ============================================================================

const TITLES = {
  REGISTER_CLIENT: "Regístrate para realizar pedidos",
  REGISTER_BUSINESS: "Regístrate para dar de alta tu negocio",
  LOGIN: "Inicia sesión para continuar",
};

const getInitialFormData = () => ({
  name: "",
  email: "",
  password: "",
});

// ============================================================================
// HOOK
// ============================================================================

const useLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { from } = useParams();

  const {
    login,
    register,
    loginWithGoogle,
    loading: authLoading,
    error: authError,
  } = useAuth();

  // ============================================================================
  // STATE
  // ============================================================================

  const [isRegister, setIsRegister] = useState(false);
  const [isRegisterBusiness, setIsRegisterBusiness] = useState(false);
  const [formData, setFormData] = useState(getInitialFormData());
  const [localError, setLocalError] = useState("");

  // ============================================================================
  // COMPUTED VALUES
  // ============================================================================

  const redirectPath =
    from && from !== "" ? `/${from}` : location.state?.from || "/explorar";

  const titleRegister = isRegisterBusiness
    ? TITLES.REGISTER_BUSINESS
    : TITLES.REGISTER_CLIENT;

  const pageTitle = isRegister ? "Registro" : "Iniciar Sesión";
  const displayError = authError || localError;

  // ============================================================================
  // EFFECTS
  // ============================================================================

  // Detectar tipo de registro
  useEffect(() => {
    const isBusinessRegistration = from === "registro";
    setIsRegister(isBusinessRegistration);
    setIsRegisterBusiness(isBusinessRegistration);
  }, [from]);

  // Inicialización de Google Sign-In: ver más abajo (usa un ref para no
  // capturar una versión vieja del callback / stale closure).

  // ============================================================================
  // HANDLERS
  // ============================================================================

  const handleGoogleLoginCallback = useCallback(
    async (credential) => {
      setLocalError("");

      try {
        const result = await loginWithGoogle({
          idToken: credential.credential,
          ...(isRegisterBusiness && { isBusiness: true }),
        });

        if (result.success) {
          navigate(redirectPath, { replace: true });
        } else {
          setLocalError(result.error || "Error al conectar con Google");
        }
      } catch (err) {
        console.error("Google login error:", err);
        setLocalError("Error al conectar con Google");
      }
    },
    [loginWithGoogle, isRegisterBusiness, navigate, redirectPath],
  );

  // Ref siempre con la última versión del callback: así el wrapper que registra
  // GIS es estable (init una sola vez) pero ejecuta el callback más reciente,
  // evitando el stale closure con isRegisterBusiness / redirectPath.
  const googleCallbackRef = useRef(handleGoogleLoginCallback);
  useEffect(() => {
    googleCallbackRef.current = handleGoogleLoginCallback;
  }, [handleGoogleLoginCallback]);

  // Inicializar Google Sign-In una sola vez con un wrapper estable.
  useEffect(() => {
    initializeGoogleSignIn(GOOGLE_CLIENT_ID, (credential) =>
      googleCallbackRef.current(credential),
    );
  }, []);

  const handleSubmit = useCallback(
    async (credentials) => {
      setLocalError("");

      // Validaciones
      if (!credentials.email || !credentials.password) {
        setLocalError("Por favor completa todos los campos");
        return { success: false };
      }

      if (isRegister && !credentials.name) {
        setLocalError("El nombre es requerido");
        return { success: false };
      }

      try {
        const payload = {
          ...credentials,
          ...(isRegisterBusiness && { isBusiness: true }),
        };

        const result = isRegister
          ? await register(payload)
          : await login(payload);

        if (result.success) {
          setFormData(getInitialFormData());
          navigate(redirectPath, { replace: true });
          return { success: true };
        } else {
          setLocalError(result.error || "Error en la autenticación");
          return { success: false, error: result.error };
        }
      } catch (err) {
        console.error("Auth error:", err);
        setLocalError("Error de conexión. Intenta de nuevo");
        return { success: false, error: "Error de conexión" };
      }
    },
    [isRegister, isRegisterBusiness, register, login, navigate, redirectPath],
  );

  const handleToggleMode = useCallback(() => {
    setIsRegister(!isRegister);
    setLocalError("");
    setFormData(getInitialFormData());
  }, [isRegister]);

  const handleClearError = useCallback(() => {
    setLocalError("");
  }, []);

  const handleFormChange = useCallback((field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    setLocalError("");
  }, []);

  // ============================================================================
  // RETURN
  // ============================================================================

  return {
    // State
    isRegister,
    isRegisterBusiness,
    formData,
    error: displayError,
    loading: authLoading,

    // Computed
    pageTitle,
    titleRegister,
    redirectPath,

    // Handlers
    handleSubmit,
    handleToggleMode,
    handleClearError,
    handleFormChange,

    // Utils
    TITLES,
  };
};

export default useLogin;