import PropTypes from "prop-types";
import { Box, Stack } from "@mui/material";

const GoogleSignInButton = ({ loading }) => (
  <Stack spacing={2} sx={{ mb: 3 }}>
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        minHeight: 44,
        opacity: loading ? 0.6 : 1,
        pointerEvents: loading ? "none" : "auto",
        transition: "opacity 0.2s ease",
      }}
    >
      <Box id="google-btn" />
    </Box>
  </Stack>
);

GoogleSignInButton.propTypes = { loading: PropTypes.bool };
GoogleSignInButton.defaultProps = { loading: false };

export default GoogleSignInButton;
