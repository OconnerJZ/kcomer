const isLocalhost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

export const initializeGoogleSignIn = (clientId, callback) => {
  if (!window.google) {
    console.warn("Google Sign-In SDK not loaded");
    return;
  }

  google.accounts.id.initialize({
    client_id: clientId,
    callback,
    auto_select: false,
    cancel_on_tap_outside: true,
  });

  if (isLocalhost) {
    const container = document.getElementById("google-btn");
    if (container) {
      container.innerHTML = "";
      google.accounts.id.renderButton(container, {
        theme: "outline",
        size: "large",
        text: "continue_with",
        shape: "pill",
        logo_alignment: "left",
        width: 300,
      });
    }
  }
};
