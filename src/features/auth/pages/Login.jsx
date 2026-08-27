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
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        px: { xs: 1.5, sm: 3, lg: 5 },
        py: { xs: 1.5, sm: 3 },
        overflowX: "hidden",
        overflowY: "auto",
        backgroundImage: `linear-gradient(115deg, rgba(18,18,20,.84), rgba(18,18,20,.54) 48%, rgba(255,75,69,.20)), url(${Bg})`,
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
          gap: { xs: 2, md: 4, lg: 7 },
          my: "auto",
        }}
      >
        {isDesktop && (
          <Stack spacing={{ md: 1.75, lg: 2.25 }} sx={{ color: "common.white", maxWidth: 500, minWidth: 0 }}>
            <Box component="img" src={LogoClassic} alt="Kcomer" sx={{ width: { md: 60, lg: 72 }, height: { md: 60, lg: 72 }, borderRadius: 3, boxShadow: "0 18px 45px rgba(0,0,0,.2)" }} />
            <Typography variant="overline" sx={{ letterSpacing: ".18em", opacity: .72, fontWeight: 700 }}>
              Kcomer
            </Typography>
            <Typography
              sx={{
                fontWeight: 900,
                lineHeight: 1.02,
                letterSpacing: "-.04em",
                fontSize: { md: "clamp(2.35rem,4.5vw,3.65rem)", lg: "3.75rem" },
                maxWidth: 500,
              }}
            >
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
            maxHeight: { xs: "calc(100dvh - 24px)", sm: "calc(100dvh - 48px)" },
            overflowY: "auto",
            overscrollBehavior: "contain",
            border: "1px solid rgba(255,255,255,.58)",
            borderRadius: { xs: 3, sm: 4 },
            bgcolor: "rgba(255,255,255,.92)",
            backdropFilter: "blur(22px)",
            boxShadow: "0 28px 80px rgba(0,0,0,.24)",
            scrollbarWidth: "thin",
          }}
        >
          {!isDesktop && (
            <Stack alignItems="center" spacing={0.6} sx={{ pt: { xs: 2, sm: 2.5 }, px: 3 }}>
              <Box component="img" src={LogoClassic} alt="Kcomer" sx={{ width: { xs: 46, sm: 56 }, height: { xs: 46, sm: 56 }, borderRadius: 2.5 }} />
              <Typography variant="subtitle1" fontWeight={900}>Kcomer</Typography>
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
