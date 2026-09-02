import assert from "node:assert/strict";
import test from "node:test";
import {
  createSessionUser,
  getAuthErrorMessage,
  isValidSessionUser,
  prepareRegisterPayload,
  refreshSessionUser,
} from "./sessionModel.js";

test("crea y valida una sesión normalizada desde la respuesta de autenticación", () => {
  const session = createSessionUser({
    user: { user_id: 8, user_name: "Bryant", user_role: "customer" },
    token: "token-value",
  });

  assert.equal(session.id, 8);
  assert.equal(session.name, "Bryant");
  assert.equal(session.role, "customer");
  assert.equal(session.token, "token-value");
  assert.equal(isValidSessionUser(session), true);
});

test("actualiza los datos del usuario sin perder el token de la sesión", () => {
  const updated = refreshSessionUser({
    currentUser: { id: 8, name: "Bryant", role: "customer", token: "token-value" },
    userData: { id: 8, role: "owner", businesses: [{ id: 12 }] },
  });

  assert.equal(updated.token, "token-value");
  assert.equal(updated.role, "owner");
  assert.deepEqual(updated.businesses, [{ id: 12 }]);
});

test("convierte el registro al contrato del backend", () => {
  assert.deepEqual(prepareRegisterPayload({
    name: "Bryant",
    email: "user@example.com",
    password: "secret",
    isBusiness: true,
  }), {
    user_name: "Bryant",
    email: "user@example.com",
    password: "secret",
    isBusiness: true,
  });
});

test("prioriza el mensaje del backend al presentar errores", () => {
  assert.equal(
    getAuthErrorMessage({ data: { message: "Credenciales incorrectas" }, message: "Fallback" }),
    "Credenciales incorrectas",
  );
});
