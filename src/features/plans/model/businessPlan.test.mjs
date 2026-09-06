import test from "node:test";
import assert from "node:assert/strict";
import {
  availableFeatures,
  buildPlanValueMatrix,
  formatPlanLimit,
  limitProgress,
  limitUsageState,
  upcomingFeatures,
} from "./businessPlan.js";

test("presenta límites configurados y progreso", () => {
  assert.equal(formatPlanLimit({ limit: 75, used: 4 }), "4 de 75");
  assert.equal(limitProgress({ limit: null, used: 4 }), null);
  assert.equal(limitProgress({ limit: 10, used: 4 }), 40);
});

test("separa funciones disponibles de las futuras", () => {
  const features = [{ key: "a", included: true, status: "available" }, { key: "b", included: true, status: "coming_soon" }];
  assert.deepEqual(availableFeatures(features).map((item) => item.key), ["a"]);
  assert.deepEqual(upcomingFeatures(features).map((item) => item.key), ["b"]);
});

test("clasifica uso de límites en 80, 90 y 100 por ciento", () => {
  assert.equal(limitUsageState({ limit: 10, used: 7 }).level, "normal");
  assert.equal(limitUsageState({ limit: 10, used: 8 }).level, "notice");
  assert.equal(limitUsageState({ limit: 10, used: 9 }).level, "warning");
  assert.equal(limitUsageState({ limit: 10, used: 10 }).level, "blocked");
  assert.equal(limitUsageState({ limit: 10, used: 12 }).level, "blocked");
});

test("construye la matriz comercial por plan", () => {
  const matrix = buildPlanValueMatrix([
    { code: "free", features: [{ key: "x", label: "X", included: false, status: "coming_soon", category: "growth", commercialModel: "plan" }] },
    { code: "level_1", features: [{ key: "x", label: "X", included: true, status: "coming_soon", category: "growth", commercialModel: "plan" }] },
  ]);
  assert.equal(matrix.length, 1);
  assert.deepEqual(matrix[0].plans, { free: false, level_1: true });
});
