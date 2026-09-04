import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useLogin from "@Features/auth/hooks/useLogin";
import LoginForm from "@Features/auth/components/LoginForm";
import Bg from "@Assets/images/qscome-bg-6.png";
import LogoClassic from "/pwa-512x512.png";

const Login = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const {
    isRegister,
    isRegisterBusiness,
    error,
    loading,
    titleRegister,
    handleSubmit,
    handleToggleMode,
    handleClearError,
  } = useLogin();

  return (
    <Box
      sx={{
        minHeight: "100dvh",
        position: "relative",
        display: "grid",
        placeItems: "center",
        px: { xs: 2, sm: 3 },
        py: 3,
        overflow: "hidden",
        backgroundImage: `linear-gradient(rgba(34,31,28,.68), rgba(34,31,28,.68)), url(${Bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ position: "fixed", inset: 0, backdropFilter: "blur(1.5px)", pointerEvents: "none" }} />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: { xs: 500, md: 980, lg: 1080 },
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0,1fr) minmax(360px,420px)" },
          alignItems: "center",
            gap: { xs: 2, md: 5 },
        }}
      >
        {isDesktop && (
          <Stack spacing={2.25} sx={{ color: "common.white", maxWidth: 480 }}>
            <Box component="img" src={LogoClassic} alt="Kcomer" sx={{ width: 64, height: 64, borderRadius: "8px", boxShadow: "0 2px 8px rgba(0,0,0,.14)" }} />
            <Typography variant="overline" sx={{ color: "#E39A93", letterSpacing: ".14em", fontWeight: 600 }}>
              Kcomer
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 600, lineHeight: 1.25, letterSpacing: "-.015em", maxWidth: 420 }}>
              Tu próxima comida empieza aquí.
            </Typography>
            <Typography variant="body1" sx={{ opacity: .78, maxWidth: 430, lineHeight: 1.65 }}>
              Descubre negocios, ordena fácil y mantén todo tu historial en un solo lugar.
            </Typography>
          </Stack>
        )}

        <Box
          sx={{
            width: "100%",
            border: "1px solid rgba(56,50,44,.16)",
            borderRadius: "8px",
            bgcolor: "#FEFDFB",
            boxShadow: "0 6px 18px rgba(27,24,21,.14)",
            overflow: "hidden",
          }}
        >
          {!isDesktop && (
            <Stack alignItems="center" spacing={1} sx={{ pt: 3, px: 3 }}>
              <Box component="img" src={LogoClassic} alt="Kcomer" sx={{ width: 58, height: 58, borderRadius: "8px" }} />
              <Typography variant="subtitle1" fontWeight={600} color="primary.dark">Kcomer</Typography>
            </Stack>
          )}
          <Box sx={{ p: { xs: 2, sm: 3, md: 3.15 } }}>
            <LoginForm
              isRegister={isRegister}
              isRegisterBusiness={isRegisterBusiness}
              titleRegister={titleRegister}
              error={error}
              loading={loading}
              onSubmit={handleSubmit}
              onToggleMode={handleToggleMode}
              onClearError={handleClearError}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Login;
