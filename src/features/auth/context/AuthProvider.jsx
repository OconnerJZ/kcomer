import { useMemo } from "react";
import PropTypes from "prop-types";
import useAuthActions from "../hooks/useAuthActions";
import useAuthSession from "../hooks/useAuthSession";
import AuthContext from "./authContext";

export const AuthProvider = ({ children }) => {
  const session = useAuthSession();
  const actions = useAuthActions({
    completeAuthentication: session.completeAuthentication,
    setAuthError: session.setAuthError,
  });
  const loading = session.loading || actions.loading;
  const value = useMemo(() => ({
    user: session.user,
    loading,
    error: session.error,
    isAuthenticated: Boolean(session.user),
    login: actions.login,
    loginWithGoogle: actions.loginWithGoogle,
    register: actions.register,
    logout: session.logout,
    updateUser: session.updateUser,
    refreshUser: session.refreshUser,
    validateToken: session.validateToken,
    clearError: session.clearError,
  }), [
    actions.login,
    actions.loginWithGoogle,
    actions.register,
    loading,
    session.clearError,
    session.error,
    session.logout,
    session.refreshUser,
    session.updateUser,
    session.user,
    session.validateToken,
  ]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default AuthProvider;
