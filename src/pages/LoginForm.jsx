// src/components/auth/LoginForm.jsx
import { useState } from "react";
import PropTypes from "prop-types";
import {
  Paper,
  Typography,
  Alert,
  Stack,
  Divider,
  Box,
  Button,
} from "@mui/material";
import GoogleSignInButton from "./GoogleSignInButton";
import AuthFormFields from "./AuthFormFields";

const TITLES = {
  LOGIN: "Inicia sesión para continuar",
};

const LoginForm = ({
  isRegister,
  isRegisterBusiness,
  titleRegister,
  error,
  loading,
  onSubmit,
  onToggleMode,
  onClearError,
}) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    onClearError();
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validaciones
    if (!formData.email || !formData.password) {
      return;
    }

    if (isRegister && !formData.name) {
      return;
    }

    onSubmit(formData);
  };

  const headerTitle = isRegister ? "Crear Cuenta" : "Bienvenido";
  const headerSubtitle = isRegister ? titleRegister : TITLES.LOGIN;
  const submitButtonText = isRegister ? "Crear Cuenta" : "Iniciar Sesión";
  const toggleText = isRegister
    ? "¿Ya tienes cuenta? Inicia sesión"
    : "¿No tienes cuenta? Regístrate";

  return (
    <Paper
      sx={{
        maxWidth: 450,
        width: "100%",
        p: 4,
        borderRadius: 3,
      }}
      elevation={6}
    >
      {/* Header */}
      <Typography
        variant="h4"
        sx={{ mb: 1, fontWeight: 700, textAlign: "center" }}
      >
        {headerTitle}
      </Typography>

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mb: 3, textAlign: "center" }}
      >
        {headerSubtitle}
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 2 }} onClose={onClearError}>
          {error}
        </Alert>
      )}

      {/* Google Sign-In */}
      <GoogleSignInButton loading={loading} />

      <Divider sx={{ my: 3 }}>
        <Typography variant="body2" color="text.secondary">
          O con email
        </Typography>
      </Divider>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <AuthFormFields
          formData={formData}
          isRegister={isRegister}
          loading={loading}
          onChange={handleChange}
        />

        <Button
          type="submit"
          variant="contained"
          fullWidth
          disabled={loading}
          sx={{
            py: 1.5,
            mt: 2,
            bgcolor: "#ff4b45",
            "&:hover": {
              bgcolor: "#e63946",
            },
          }}
        >
          {loading ? "Cargando..." : submitButtonText}
        </Button>
      </form>

      {/* Toggle Login/Register */}
      <Box sx={{ mt: 3, textAlign: "center" }}>
        <Button
          variant="text"
          onClick={onToggleMode}
          disabled={loading}
          sx={{ textTransform: "none" }}
        >
          {toggleText}
        </Button>
      </Box>
    </Paper>
  );
};

LoginForm.propTypes = {
  isRegister: PropTypes.bool.isRequired,
  isRegisterBusiness: PropTypes.bool.isRequired,
  titleRegister: PropTypes.string.isRequired,
  error: PropTypes.string,
  loading: PropTypes.bool.isRequired,
  onSubmit: PropTypes.func.isRequired,
  onToggleMode: PropTypes.func.isRequired,
  onClearError: PropTypes.func.isRequired,
};

export default LoginForm;
