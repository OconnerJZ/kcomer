import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";

// Botón oficial de Google (GIS) en local y producción. GIS lo pinta dentro de
// #google-btn (lo hace initializeGoogleSignIn desde useLogin). Reservamos alto
// para que no salte la maquetación mientras el SDK lo renderiza, y lo
// centramos para mantener la estética del formulario.
const GoogleSignInButton = ({ loading }) => {
  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          minHeight: 44, // evita el salto de layout hasta que GIS pinta el botón
          opacity: loading ? 0.6 : 1,
          pointerEvents: loading ? "none" : "auto",
          transition: "opacity 0.2s ease",
        }}
      >
        <Box id="google-btn" />
      </Box>
    </Stack>
  );
};

GoogleSignInButton.propTypes = {
  loading: PropTypes.bool,
};

GoogleSignInButton.defaultProps = {
  loading: false,
};

export default GoogleSignInButton;