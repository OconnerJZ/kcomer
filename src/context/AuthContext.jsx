// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Verificar si hay sesión guardada
    const savedUser = localStorage.getItem('qscome_user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch (error) {
        console.error('Error parsing user data:', error);
        localStorage.removeItem('qscome_user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (credentials) => {
    try {
      // Aquí irá tu lógica de login con backend
      // Por ahora, simulamos una respuesta
      const userData = {
        id: Date.now(),
        email: credentials.email,
        name: credentials.name || credentials.email.split('@')[0],
        provider: credentials.provider || 'email',
        avatar: credentials.avatar || null,
        role: 'customer', // 'customer' | 'business' | 'admin'
      };

      localStorage.setItem('qscome_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithGoogle = async () => {
    try {
      // Aquí implementarás la autenticación con Google
      // https://developers.google.com/identity/gsi/web/guides/overview
      console.log('Login with Google - To implement');
      
      // Simulación
      const userData = {
        id: 'google_' + Date.now(),
        email: 'usuario@gmail.com',
        name: 'Usuario Google',
        provider: 'google',
        avatar: 'https://via.placeholder.com/100',
        role: 'customer',
      };

      localStorage.setItem('qscome_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const loginWithFacebook = async () => {
    try {
      // Aquí implementarás la autenticación con Facebook
      // https://developers.facebook.com/docs/facebook-login/web
      console.log('Login with Facebook - To implement');
      
      // Simulación
      const userData = {
        id: 'fb_' + Date.now(),
        email: 'usuario@facebook.com',
        name: 'Usuario Facebook',
        provider: 'facebook',
        avatar: 'https://via.placeholder.com/100',
        role: 'customer',
      };

      localStorage.setItem('qscome_user', JSON.stringify(userData));
      setUser(userData);
      return { success: true, user: userData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const register = async (userData) => {
    try {
      // Aquí irá tu lógica de registro con backend
      const newUser = {
        id: Date.now(),
        email: userData.email,
        name: userData.name,
        provider: 'email',
        avatar: null,
        role: 'customer',
      };

      localStorage.setItem('qscome_user', JSON.stringify(newUser));
      setUser(newUser);
      return { success: true, user: newUser };
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('qscome_user');
    setUser(null);
  };

  const updateUser = (updates) => {
    const updatedUser = { ...user, ...updates };
    localStorage.setItem('qscome_user', JSON.stringify(updatedUser));
    setUser(updatedUser);
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