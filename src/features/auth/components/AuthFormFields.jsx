import { useState } from "react";
import PropTypes from "prop-types";
import { TextField, Stack, IconButton, InputAdornment } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const AuthFormFields = ({ formData, isRegister, loading, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <Stack spacing={2}>
      {isRegister && (
        <TextField
          name="name"
          label="Nombre completo"
          value={formData.name}
          onChange={onChange}
          required
          fullWidth
          disabled={loading}
          autoComplete="name"
        />
      )}
      <TextField
        name="email"
        label="Correo electrónico"
        type="email"
        value={formData.email}
        onChange={onChange}
        required
        fullWidth
        disabled={loading}
        autoComplete="email"
      />
      <TextField
        name="password"
        label="Contraseña"
        type={showPassword ? "text" : "password"}
        value={formData.password}
        onChange={onChange}
        required
        fullWidth
        disabled={loading}
        autoComplete={isRegister ? "new-password" : "current-password"}
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                onClick={() => setShowPassword(!showPassword)}
                edge="end"
                disabled={loading}
              >
                {showPassword ? <VisibilityOff /> : <Visibility />}
              </IconButton>
            </InputAdornment>
          ),
        }}
      />
    </Stack>
  );
};

AuthFormFields.propTypes = {
  formData: PropTypes.shape({
    name: PropTypes.string,
    email: PropTypes.string.isRequired,
    password: PropTypes.string.isRequired,
  }).isRequired,
  isRegister: PropTypes.bool.isRequired,
  loading: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired,
};

export default AuthFormFields;
