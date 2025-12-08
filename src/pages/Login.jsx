// src/pages/Login.jsx
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
import {
  Google,
  Facebook,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@Context/AuthContext";
import GeneralContent from "@Components/layout/GeneralContent";
import { jwtDecode } from "jwt-decode";
import { GOOGLE_CLIENT_ID } from "@Utils/enviroments";

const Login = () => {
  const navigate = useNavigate();
  const { login, register, loginWithGoogle, loginWithFacebook } = useAuth();

  const [isRegister, setIsRegister] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCustomGoogleLogin = () => {
    google.accounts.id.prompt();
  };

  useEffect(() => {
    /* global google */
    google.accounts.id.initialize({
      client_id: GOOGLE_CLIENT_ID,
      callback: handleGoogleLogin,
    });
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
      ...(isRegister ? { name: formData.name } : {} ),
    };
  
    try {
      const result = await (isRegister ? register : login)(data);
      if (result.success) {
        navigate("/explorar");
      } else {
        setError(result.error || "Error al iniciar sesión");
      }
    } catch (err) {
      setError("Error de conexión. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async (credential) => {
    const token = credential.credential;
    // Opcional: ver datos del usuario
    const user = jwtDecode(token);
    console.log("Usuario Google:", user);
    setLoading(true);
    const idToken = { idToken: token };
    console.log(idToken);
    const result = await loginWithGoogle(idToken);
    if (result.success) {
      navigate("/explorar");
    } else {
      setError("Error al conectar con Google");
    }
    setLoading(false);
  };

  const handleFacebookLogin = async () => {
    setLoading(true);
    const result = await loginWithFacebook();
    if (result.success) {
      navigate("/explorar");
    } else {
      setError("Error al conectar con Facebook");
    }
    setLoading(false);
  };

  return (
    <GeneralContent title={isRegister ? "Registro" : "Iniciar Sesión"}>
      <Box
        sx={{
          mt: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: 0,
        }}
      >
        <Paper
          sx={{
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
            {isRegister
              ? "Regístrate para realizar pedidos"
              : "Inicia sesión para continuar"}
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          {/* Botones sociales */}
          <Stack spacing={2} sx={{ mb: 3 }}>
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
            <Button
              variant="outlined"
              fullWidth
              startIcon={<Facebook />}
              onClick={handleFacebookLogin}
              disabled={loading}
              sx={{
                py: 1.2,
                borderColor: "#4267B2",
                color: "#4267B2",
                "&:hover": {
                  borderColor: "#365899",
                  bgcolor: "rgba(66, 103, 178, 0.04)",
                },
              }}
            >
              Continuar con Facebook
            </Button>
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
