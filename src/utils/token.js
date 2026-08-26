// src/utils/token.js
// Utilidades de token JWT (solo lectura). El backend emite un JWT de larga
// duración SIN endpoint de refresh, así que aquí no renovamos: solo detectamos
// expiración para cerrar sesión de forma proactiva.

import { jwtDecode } from "jwt-decode";

// Devuelve el `exp` (segundos epoch) o null si no se puede leer.
export const getTokenExp = (token) => {
  if (!token) return null;
  try {
    return jwtDecode(token)?.exp ?? null;
  } catch {
    return null;
  }
};

// ¿El token está expirado (o es ilegible)? skewSeconds da un margen para evitar
// carreras justo en el límite. Un token sin `exp` legible se trata como inválido.
export const isTokenExpired = (token, skewSeconds = 30) => {
  const exp = getTokenExp(token);
  if (!exp) return true;
  return Date.now() >= (exp - skewSeconds) * 1000;
};