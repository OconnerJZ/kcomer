// src/hooks/useGoogleLogin.js
import { useState, useEffect, useCallback } from 'react';

/**
 * Hook para manejar Google Sign-In usando Google Identity Services
 * @param {Function} onSuccess - Callback cuando el login es exitoso
 * @param {Function} onError - Callback cuando hay un error
 */
const useGoogleLogin = (onSuccess, onError) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    // Función para inicializar Google Identity Services
    const initializeGoogleSignIn = () => {
      if (!window.google) {
        console.warn('⚠️ Google Identity Services no está cargado aún');
        
        // Reintentar cada 500ms hasta que se cargue
        const retryInterval = setInterval(() => {
          if (window.google) {
            clearInterval(retryInterval);
            initializeGoogleSignIn();
          }
        }, 500);

        // Timeout después de 10 segundos
        setTimeout(() => {
          clearInterval(retryInterval);
          if (!window.google) {
            console.error('❌ Google Identity Services no se pudo cargar');
            onError?.(new Error('Google Sign-In no disponible'));
          }
        }, 10000);

        return;
      }

      try {
        const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

        if (!clientId) {
          console.error('❌ VITE_GOOGLE_CLIENT_ID no está configurado');
          onError?.(new Error('Configuración de Google incompleta'));
          return;
        }

        // Inicializar Google Identity Services
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: handleCredentialResponse,
          auto_select: false, // No auto-seleccionar la cuenta
          cancel_on_tap_outside: true, // Cerrar si se toca fuera
          itp_support: true, // Soporte para Safari
        });

        setIsInitialized(true);
        console.log('✅ Google Sign-In inicializado correctamente');

      } catch (error) {
        console.error('❌ Error inicializando Google Sign-In:', error);
        onError?.(error);
      }
    };

    initializeGoogleSignIn();

    // Cleanup al desmontar
    return () => {
      if (window.google) {
        window.google.accounts.id.cancel();
      }
    };
  }, [onError]);

  /**
   * Callback cuando Google retorna las credenciales
   */
  const handleCredentialResponse = useCallback(async (response) => {
    try {
      setIsLoading(true);
      console.log('📝 Credencial recibida de Google');

      if (!response.credential) {
        throw new Error('No se recibió credencial de Google');
      }

      // Llamar al callback de éxito con el token JWT de Google
      if (onSuccess) {
        await onSuccess(response.credential);
      }

    } catch (error) {
      console.error('❌ Error procesando credencial:', error);
      if (onError) {
        onError(error);
      }
    } finally {
      setIsLoading(false);
    }
  }, [onSuccess, onError]);

  /**
   * Mostrar el popup de Google One Tap
   */
  const login = useCallback(() => {
    if (!window.google || !isInitialized) {
      console.error('❌ Google Sign-In no está inicializado');
      onError?.(new Error('Google Sign-In no disponible'));
      return;
    }

    try {
      // Mostrar el popup de One Tap
      window.google.accounts.id.prompt((notification) => {
        if (notification.isNotDisplayed()) {
          console.log('⚠️ One Tap no se mostró:', notification.getNotDisplayedReason());
          
          // Razones comunes:
          // - 'browser_not_supported': Navegador no soportado
          // - 'opt_out_or_no_session': Usuario cerró sesión o bloqueó
          // - 'user_cancel': Usuario canceló
        }
        
        if (notification.isSkippedMoment()) {
          console.log('⚠️ One Tap omitido:', notification.getSkippedReason());
        }
      });
    } catch (error) {
      console.error('❌ Error mostrando popup:', error);
      onError?.(error);
    }
  }, [isInitialized, onError]);

  /**
   * Renderizar el botón estándar de Google
   * @param {string} elementId - ID del elemento donde renderizar
   * @param {object} options - Opciones de personalización
   */
  const renderButton = useCallback((elementId, options = {}) => {
    if (!window.google || !isInitialized) {
      console.error('❌ Google Sign-In no está inicializado');
      return;
    }

    const element = document.getElementById(elementId);
    
    if (!element) {
      console.error(`❌ Elemento con id "${elementId}" no encontrado`);
      return;
    }

    try {
      window.google.accounts.id.renderButton(
        element,
        {
          theme: options.theme || 'outline', // 'outline', 'filled_blue', 'filled_black'
          size: options.size || 'large', // 'large', 'medium', 'small'
          text: options.text || 'signin_with', // 'signin_with', 'signup_with', 'continue_with', 'signin'
          shape: options.shape || 'rectangular', // 'rectangular', 'pill', 'circle', 'square'
          logo_alignment: options.logoAlignment || 'left', // 'left', 'center'
          width: options.width || 250,
          locale: options.locale || 'es' // Idioma español
        }
      );

      console.log('✅ Botón de Google renderizado');
    } catch (error) {
      console.error('❌ Error renderizando botón:', error);
      onError?.(error);
    }
  }, [isInitialized, onError]);

  /**
   * Cerrar sesión de Google (deshabilitar auto-select)
   */
  const logout = useCallback(() => {
    if (window.google) {
      window.google.accounts.id.disableAutoSelect();
      console.log('✅ Auto-select de Google deshabilitado');
    }
  }, []);

  return {
    login,
    renderButton,
    logout,
    isLoading,
    isInitialized
  };
};

export default useGoogleLogin;