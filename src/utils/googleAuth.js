// src/utils/googleAuth.js
// Inicializa Google Identity Services (GIS) y renderiza el botón nativo.
// El backend valida un id_token (verifyIdToken), y el `credential` de GIS es
// justamente ese id_token, por eso usamos GIS (no useGoogleLogin, que da
// access_token). Se renderiza en local Y producción para máxima confiabilidad
// (prompt/One Tap el navegador lo puede suprimir en silencio).

export const initializeGoogleSignIn = (clientId, callback) => {
  if (!window.google?.accounts?.id) {
    console.warn("Google Sign-In SDK no cargado");
    return;
  }

  google.accounts.id.initialize({
    client_id: clientId,
    callback,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  renderGoogleButton();
};

// Renderiza el botón oficial dentro de #google-btn si el contenedor existe.
// Idempotente: limpia antes de volver a pintar.
export const renderGoogleButton = (containerId = "google-btn") => {
  if (!window.google?.accounts?.id) return;

  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = "";
  google.accounts.id.renderButton(container, {
    theme: "outline",
    size: "large",
    text: "continue_with",
    shape: "pill",
    logo_alignment: "left",
    width: 320,
  });
};

// Opcional: disparar One Tap manualmente si se quisiera.
export const promptGoogleSignIn = () => {
  if (window.google?.accounts?.id) {
    google.accounts.id.prompt();
  }
};