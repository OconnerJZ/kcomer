import PropTypes from "prop-types";
import { Box, Button, Stack } from "@mui/material";
import { Google } from "@mui/icons-material";

const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const GoogleSignInButton = ({ loading }) => {
  const handleCustomGoogleLogin = () => {
    if (!isLocalhost && window.google) {
      google.accounts.id.prompt();
    }
  };

  return (
    <Stack spacing={2} sx={{ mb: 3 }}>
      {isLocalhost ? (
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
          }}
        >
          <Box id="google-btn" />
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
  );
};

GoogleSignInButton.propTypes = {
  loading: PropTypes.bool.isRequired,
};

export default GoogleSignInButton;
