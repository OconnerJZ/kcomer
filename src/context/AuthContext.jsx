// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { authAPI, handleApiError } from '@Services/apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('qscome_user');
    if (savedUser) {
      try {
        const userData = JSON.parse(savedUser);
        setUser(userData);
        // Opcionalmente validar el token con el backend
        validateToken(userData.token);
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('qscome_user');
      }
    }
    setLoading(false);
  }, []);

  const validateToken = async (token) => {
    try {
      const response = await authAPI.getMe();
      if (response.data.success) {
        // Token válido, actualizar datos del usuario
        const userData = {
          ...response.data.data,
          token
        };
        setUser(userData);
        localStorage.setItem('qscome_user', JSON.stringify(userData));
      }
    } catch (error) {
      // Token inválido, limpiar sesión
      console.error('Token validation failed:', error);
      logout();
    }
  };

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      
      if (response.data.success) {
        const userData = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        
        localStorage.setItem('qscome_user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Login error:', error);
      return handleApiError(error);
    }
  };

  const loginWithGoogle = async () => {
    try {
      const response = await authAPI.loginGoogle();
      
      if (response.data.success) {
        const userData = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        
        localStorage.setItem('qscome_user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Google login error:', error);
      return handleApiError(error);
    }
  };

  const loginWithFacebook = async () => {
    try {
      const response = await authAPI.loginFacebook();
      
      if (response.data.success) {
        const userData = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        
        localStorage.setItem('qscome_user', JSON.stringify(userData));
        setUser(userData);
        
        return { success: true, user: userData };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Facebook login error:', error);
      return handleApiError(error);
    }
  };

  const register = async (userData) => {
    try {
      const response = await authAPI.register({
        user_name: userData.name,
        email: userData.email,
        password: userData.password,
        phone: userData.phone
      });

      if (response.data.success) {
        const newUserData = {
          ...response.data.data.user,
          token: response.data.data.token
        };
        
        localStorage.setItem('qscome_user', JSON.stringify(newUserData));
        setUser(newUserData);
        
        return { success: true, user: newUserData };
      } else {
        return { success: false, error: response.data.message };
      }
    } catch (error) {
      console.error('Register error:', error);
      return handleApiError(error);
    }
  };

  const logout = () => {
    localStorage.removeItem('qscome_user');
    setUser(null);
  };

  const updateUser = async (updates) => {
    try {
      const response = await authAPI.getMe();
      
      if (response.data.success) {
        const updatedUser = {
          ...user,
          ...response.data.data
        };
        
        localStorage.setItem('qscome_user', JSON.stringify(updatedUser));
        setUser(updatedUser);
        
        return { success: true };
      }
    } catch (error) {
      console.error('Update user error:', error);
      return handleApiError(error);
    }
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    loginWithGoogle,
    loginWithFacebook,
    register,
    logout,
    updateUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export default useAuth;