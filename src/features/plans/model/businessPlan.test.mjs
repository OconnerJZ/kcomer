import test from "node:test";
import assert from "node:assert/strict";
import { availableFeatures, formatPlanLimit, limitProgress, upcomingFeatures } from "./businessPlan.js";

test("presenta límites no configurados sin fingir una restricción", () => {
  assert.equal(formatPlanLimit({ limit: null, used: 4 }), "Sin límite configurado");
  assert.equal(limitProgress({ limit: null, used: 4 }), null);
  assert.equal(limitProgress({ limit: 10, used: 4 }), 40);
});

test("separa funciones disponibles de las futuras", () => {
  const features = [{ key: "a", included: true, status: "available" }, { key: "b", included: false, status: "coming_soon" }];
  assert.deepEqual(availableFeatures(features).map((item) => item.key), ["a"]);
  assert.deepEqual(upcomingFeatures(features).map((item) => item.key), ["b"]);
});
