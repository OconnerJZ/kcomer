import { useEffect, useState } from "react";
import {
  Box,
  Paper,
  TextField,
  Button,
  Typography,
  Divider,
  Stack,
  IconButton,
  InputAdornment,
  Alert,
} from "@mui/material";
import { Google, Visibility, VisibilityOff } from "@mui/icons-material";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "@Context/AuthContext";
import GeneralContent from "@Components/layout/GeneralContent";
import { GOOGLE_CLIENT_ID } from "@Utils/enviroments";
import { isMobile } from "@Utils/commons";

const TITLE_REGISTER_CLIENT = "Regístrate para realizar pedidos";
const TITLE_REGISTER_BUSINESS = "Regístrate para dar de alta tu negocio";

const Login = () => {
  const navigate = useNavigate();
  const { from } = useParams();
  const pathLogin =
    from === undefined || from === "" ? "/explorar" : `/${from}`;
  const { login, register, loginWithGoogle } = useAuth();
  const isLocalhost =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";
  const [isRegister, setIsRegister] = useState(false);
  const [isRegisterBusiness, setIsRegisterBusiness] = useState(false);
  const [titleRegister, setTitleRegister] = useState(TITLE_REGISTER_CLIENT);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomGoogleLogin = () => {
    if (!isLocalhost) {
      google.accounts.id.prompt();
    }
  };

  useEffect(() => {
    if (from === "registro") {
      setTitleRegister(TITLE_REGISTER_BUSINESS);
      setIsRegister(true);
      setIsRegisterBusiness(true);
    } else {
      setTitleRegister(TITLE_REGISTER_CLIENT);
      setIsRegister(false);
      setIsRegisterBusiness(false);
    }
  }, []);
  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
      auto_select: false,
      cancel_on_tap_outside: true,
    });
    if (isLocalhost) {
      const container = document.getElementById("google-btn");

      if (container) {
        container.innerHTML = "";
        google.accounts.id.renderButton(container, {
          theme: "outline",
          size: "medium",
          text: "continue_with",
          shape: "pill",
          logo_alignment: "left",
        });
      }
    }
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const data = {
      email: formData.email,
      password: formData.password,
      ...(isRegister ? { name: formData.name } : {}),
      ...(isRegisterBusiness ? { isBusiness: true } : {}),
    };

    try {
      const result = await (isRegister ? register : login)(data);
      if (result.success) {
        const path = pathLogin;
        navigate(path);
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo: " + err);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    const token = credential.credential;
    setLoading(true);
    const idToken = {
      idToken: token,
      ...(isRegisterBusiness ? { isBusiness: true } : {}),
    };
    const result = await loginWithGoogle(idToken);
    const path = pathLogin;
    if (result.success) {
      navigate(path);
    } else {
      setError("Error al conectar con Google");
    }
    setLoading(false);
  };

  return (
    <GeneralContent title={isRegister ? "Registro" : "Iniciar Sesión"}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center", // centra verticalmente
          justifyContent: "center", // centra horizontalmente
          px: 2,
          py: 0,
        }}
      >
        <Paper
          sx={{
            mt: isMobile() ? 2 : 10,
            maxWidth: 450,
            width: "100%",
            p: 4,
            borderRadius: 3,
          }}
          elevation={6}
        >
          <Typography
            variant="h4"
            sx={{ mb: 1, fontWeight: 700, textAlign: "center" }}
          >
            {isRegister ? "Crear Cuenta" : "Bienvenido"}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ mb: 3, textAlign: "center" }}
          >
            {isRegister ? titleRegister : "Inicia sesión para continuar"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <Stack spacing={2} sx={{ mb: 3 }}>
            {isLocalhost ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                }}
              >
                <Box
                  id="google-btn"
                  sx={{
                    maxWidth: "100%",
                  }}
                />
              </Box>
            ) : (
              <Button
                variant="outlined"
                fullWidth
                startIcon={<Google />}
                onClick={handleCustomGoogleLogin}
                disabled={loading}
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
            )}
          </Stack>

          <Divider sx={{ my: 3 }}>
            <Typography variant="body2" color="text.secondary">
              O con email
            </Typography>
          </Divider>

          {/* Formulario */}
          <form onSubmit={handleSubmit}>
            <Stack spacing={2}>
              {isRegister && (
                <TextField
                  name="name"
                  label="Nombre completo"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  fullWidth
                />
              )}

              <TextField
                name="email"
                label="Correo electrónico"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                fullWidth
              />

              <TextField
                name="password"
                label="Contraseña"
                type={showPassword ? "text" : "password"}
                value={formData.password}
                onChange={handleChange}
                required
                fullWidth
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                variant="contained"
                fullWidth
                disabled={loading}
                sx={{ py: 1.5, mt: 2 }}
              >
                {loading
                  ? "Cargando..."
                  : isRegister
                  ? "Crear Cuenta"
                  : "Iniciar Sesión"}
              </Button>
            </Stack>
          </form>

          <Box sx={{ mt: 3, textAlign: "center" }}>
            <Button
              variant="text"
              onClick={() => setIsRegister(!isRegister)}
              sx={{ textTransform: "none" }}
            >
              {isRegister
                ? "¿Ya tienes cuenta? Inicia sesión"
                : "¿No tienes cuenta? Regístrate"}
            </Button>
          </Box>
        </Paper>
      </Box>
    </GeneralContent>
  );
};

export default Login;
