import test from "node:test";
import assert from "node:assert/strict";
import {
  createBusinessRegistrationForm,
  createBusinessRegistrationSteps,
  toBusinessRegistrationPayload,
  validateBusinessRegistrationStep,
} from "./businessRegistration.js";

test("crea pasos independientes con el catálogo recibido", () => {
  const foodTypes = [{ id: 1, label: "Tacos" }];
  const steps = createBusinessRegistrationSteps(foodTypes);
  assert.equal(steps.length, 3);
  assert.equal(steps[0].fields.find(({ name }) => name === "foodTypeIds").options, foodTypes);
});

test("valida únicamente los campos requeridos del paso actual", () => {
  const form = createBusinessRegistrationForm();
  const [firstStep] = createBusinessRegistrationSteps([]);
  const errors = validateBusinessRegistrationStep(form, firstStep);
  assert.deepEqual(Object.keys(errors), ["businessName", "phone", "foodTypeIds", "logo"]);

  form.businessName = "Las Parotas";
  form.phone = "7221234567";
  form.foodTypeIds = [1];
  form.logo = { name: "logo.png" };
  assert.deepEqual(validateBusinessRegistrationStep(form, firstStep), {});
});

test("construye el contrato backend con ubicación y logo", () => {
  const form = {
    ...createBusinessRegistrationForm(),
    businessName: "Las Parotas",
    location: { latitude: 19.2, longitude: -99.6, address: "Toluca" },
  };
  const payload = toBusinessRegistrationPayload({ form, userId: 7, logoUrl: "logo.png" });
  assert.equal(payload.id, 7);
  assert.equal(payload.logo_url, "logo.png");
  assert.deepEqual(payload.locale, {
    latitude: 19.2,
    longitude: -99.6,
    address: "Toluca",
  });
});
