import { Box } from "@mui/material";
import { isMobile } from "@Utils/commons";
import GeneralContent from "@Components/layout/GeneralContent";
import useLogin from "@Features/auth/hooks/useLogin";
import LoginForm from "@Features/auth/components/LoginForm";

const Login = () => {
  const {
    isRegister,
    isRegisterBusiness,
    error,
    loading,
    pageTitle,
    titleRegister,
    handleSubmit,
    handleToggleMode,
    handleClearError,
  } = useLogin();

  return (
    <GeneralContent title={pageTitle}>
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          px: 2,
          py: isMobile() ? 2 : 4,
          minHeight: "calc(100vh - 200px)",
        }}
      >
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
    </GeneralContent>
  );
};

export default Login;
