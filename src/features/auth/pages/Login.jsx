import { Box, Stack, Typography, useMediaQuery, useTheme } from "@mui/material";
import useLogin from "@Features/auth/hooks/useLogin";
import LoginForm from "@Features/auth/components/LoginForm";
import Bg from "@Assets/images/qscome-bg-6.png";
import LogoClassic from "/pwa-512x512.png";

const Login = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
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
        backgroundImage: `linear-gradient(115deg, rgba(18,18,20,.82), rgba(18,18,20,.52) 48%, rgba(49,94,251,.18)), url(${Bg})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box sx={{ position: "absolute", inset: 0, backdropFilter: "blur(1.5px)" }} />

      <Box
        sx={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 1040,
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "minmax(0, 1fr) 430px" },
          alignItems: "center",
          gap: { xs: 2, md: 7 },
        }}
      >
        {!isMobile && (
          <Stack spacing={2.25} sx={{ color: "common.white", maxWidth: 480 }}>
            <Box component="img" src={LogoClassic} alt="Kcomer" sx={{ width: 72, height: 72, borderRadius: "10px", boxShadow: "0 18px 45px rgba(0,0,0,.2)" }} />
            <Typography variant="overline" sx={{ letterSpacing: ".18em", opacity: .72, fontWeight: 700 }}>
              Kcomer
            </Typography>
            <Typography variant="h2" sx={{ fontWeight: 900, lineHeight: 1.02, letterSpacing: "-.04em", maxWidth: 460 }}>
              Tu próxima comida empieza aquí.
            </Typography>
            <Typography variant="body1" sx={{ opacity: .78, maxWidth: 430, lineHeight: 1.7 }}>
              Descubre negocios, ordena fácil y mantén todo tu historial en un solo lugar.
            </Typography>
          </Stack>
        )}

        <Box
          sx={{
            width: "100%",
            border: "1px solid rgba(255,255,255,.58)",
            borderRadius: "10px",
            bgcolor: "rgba(255,255,255,.90)",
            backdropFilter: "blur(22px)",
            boxShadow: "0 28px 80px rgba(0,0,0,.24)",
            overflow: "hidden",
          }}
        >
          {isMobile && (
            <Stack alignItems="center" spacing={1} sx={{ pt: 3, px: 3 }}>
              <Box component="img" src={LogoClassic} alt="Kcomer" sx={{ width: 58, height: 58, borderRadius: "10px" }} />
              <Typography variant="subtitle1" fontWeight={900}>Kcomer</Typography>
            </Stack>
          )}
          <Box sx={{ p: { xs: 2.25, sm: 3.25 } }}>
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
