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

export const promptGoogleSignIn = () => {
  if (window.google?.accounts?.id) {
    google.accounts.id.prompt();
  }
};
