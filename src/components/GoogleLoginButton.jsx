import { useEffect, useRef } from "react";
import { Box, CircularProgress, Alert, Button } from "@mui/material";
import useGoogleLogin from "@Hooks/components/useGooglelogin";
import { useAuth } from "@Context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Google } from "@mui/icons-material";

const GoogleLoginButton = ({
  onSuccess: customOnSuccess,
  theme = "outline",
  size = "large",
  text = "signin_with",
  width = 320,
}) => {
  const buttonRef = useRef(null);
  const navigate = useNavigate();
  const { login: authLogin, loginWithGoogle } = useAuth();

  /**
   * Callback cuando Google retorna el token JWT
   */
  const handleSuccess = async (credentialToken) => {
    try {
      console.log("🔑 Token JWT recibido de Google");

      const idToken = {
        idToken: credentialToken,
      };
      // Enviar el token al backend para verificación
      const response = await loginWithGoogle(idToken);

      if (!response.success) {
        throw new Error(response.message || "Error en autenticación");
      }

      console.log("✅ Login exitoso:", response.data.user);

      // Guardar usuario y token en el contexto
      authLogin(response.data.user, response.data.token);

      // Mostrar notificación
      //toast.success(`¡Bienvenido ${response.data.user.firstName}!`);

      // Callback personalizado si existe
      if (customOnSuccess) {
        customOnSuccess(response.data);
      }

      // Redirigir según el rol del usuario
      const redirectPath = getRedirectPath(response.data.user.role);
      navigate(redirectPath);
    } catch (error) {
      console.error("❌ Error en login con Google:", error);
      handleError(error);
    }
  };

  /**
   * Callback cuando hay un error
   */
  const handleError = (error) => {
    console.error("❌ Error de Google Sign-In:", error);

    let errorMessage = "Error al iniciar sesión con Google";

    if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    } else if (error.message) {
      errorMessage = error.message;
    }

    //toast.error(errorMessage);
  };

  /**
   * Obtener ruta de redirección según el rol
   */
  const getRedirectPath = (role) => {
    switch (role) {
      case "owner":
        return "/owner/dashboard";
      case "admin":
        return "/admin/dashboard";
      case "customer":
      default:
        return "/explorar";
    }
  };

  const { renderButton, isLoading, isInitialized } = useGoogleLogin(
    handleSuccess,
    handleError
  );

  /**
   * Renderizar el botón cuando el componente se monte
   */
  useEffect(() => {
    if (!isInitialized) {
      return;
    }

    // Pequeño delay para asegurar que el DOM esté listo
    const timer = setTimeout(() => {
      if (buttonRef.current) {
        renderButton("google-signin-button", {
          theme,
          size,
          text,
          width,
          shape: "rectangular",
          logo_alignment: "left",
          locale: "es",
        });
      }
    }, 100);

    return () => clearTimeout(timer);
  }, [renderButton, isInitialized, theme, size, text, width]);

  // Si no está inicializado, mostrar skeleton
  if (!isInitialized) {
    return (
      <Box
        sx={{
          width: width,
          height: size === "large" ? 48 : size === "medium" ? 40 : 32,
          backgroundColor: "grey.100",
          borderRadius: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <CircularProgress size={20} />
      </Box>
    );
  }

  return (
    <Box sx={{ position: "relative", width: width }}>
      {/* Overlay de loading */}
      {isLoading && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
            borderRadius: 1,
            zIndex: 10,
          }}
        >
          <CircularProgress size={24} />
        </Box>
      )}

      {/* Contenedor del botón de Google */}
      <Button
        id="google-signin-button"
        variant="outlined"
        fullWidth
        startIcon={<Google />}
        ref={buttonRef}
        disabled={isLoading}
        sx={{
          py: 1.2,
          borderColor: "#db4437",
          color: "#db4437",
          "&:hover": {
            borderColor: "#c23321",
            bgcolor: "rgba(219, 68, 55, 0.04)",
          },
        }}
      >
        Continuar con Google
      </Button>
    </Box>
  );
};

export default GoogleLoginButton;
