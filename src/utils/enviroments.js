const getEnvVar = (key, defaultValue = '') => {
  const value = import.meta.env[key];
  if (!value && process.env.NODE_ENV === 'development') {
    console.warn(`⚠️ Variable de entorno ${key} no definida`);
  }
  return value || defaultValue;
};

export const API_KEY_MAPS = getEnvVar('VITE_REACT_API_KEY_MAPS');
export const API_URL_SERVER = getEnvVar(
  'VITE_API_URL', 
  'http://localhost:3000'
);
export const GOOGLE_CLIENT_ID = getEnvVar('VITE_GOOGLE_CLIENT_ID');

// Validar variables críticas
if (!GOOGLE_CLIENT_ID) {
  console.error('❌ GOOGLE_CLIENT_ID es requerido para login con Google');
}