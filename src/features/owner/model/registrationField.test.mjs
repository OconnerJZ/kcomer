import test from "node:test";
import assert from "node:assert/strict";
import {
  acceptsRegistrationFieldValue,
  getRegistrationOptionLabel,
  selectRegistrationOptions,
} from "./registrationField.js";

test("aplica la validación configurada sin bloquear campos sin regla", () => {
  assert.equal(acceptsRegistrationFieldValue("Las Parotas 2", "alphanumeric"), true);
  assert.equal(acceptsRegistrationFieldValue("Las Parotas!", "alphanumeric"), false);
  assert.equal(acceptsRegistrationFieldValue("cualquier valor", undefined), true);
});

test("resuelve opciones simples y múltiples por id", () => {
  const options = [
    { id: 1, label: "Tacos" },
    { id: 2, label: "Hamburguesas" },
  ];
  assert.equal(selectRegistrationOptions(options, 2).label, "Hamburguesas");
  assert.deepEqual(selectRegistrationOptions(options, [1], true), [options[0]]);
  assert.equal(getRegistrationOptionLabel(options[0]), "Tacos");
});
