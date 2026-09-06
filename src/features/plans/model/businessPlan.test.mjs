import test from "node:test";
import assert from "node:assert/strict";
import {
  availableFeatures,
  buildPlanValueMatrix,
  formatPlanLimit,
  limitProgress,
  upcomingFeatures,
} from "./businessPlan.js";

test("presenta límites no configurados sin fingir una restricción", () => {
  assert.equal(formatPlanLimit({ limit: null, used: 4 }), "Sin límite configurado");
  assert.equal(limitProgress({ limit: null, used: 4 }), null);
  assert.equal(limitProgress({ limit: 10, used: 4 }), 40);
});

test("separa funciones disponibles de próximas incluidas", () => {
  const features = [
    { key: "a", included: true, status: "available" },
    { key: "b", included: true, status: "coming_soon" },
    { key: "c", included: false, status: "coming_soon" },
  ];
  assert.deepEqual(availableFeatures(features).map((item) => item.key), ["a"]);
  assert.deepEqual(upcomingFeatures(features).map((item) => item.key), ["b"]);
});

test("construye una matriz comercial común entre planes", () => {
  const catalog = [
    {
      code: "free",
      features: [
        { key: "core", included: true, status: "available", commercialModel: "core" },
        { key: "reputation.insights", label: "Reputation", included: false, status: "coming_soon", commercialModel: "plan", category: "reputation" },
      ],
    },
    {
      code: "level_1",
      features: [
        { key: "core", included: true, status: "available", commercialModel: "core" },
        { key: "reputation.insights", label: "Reputation", included: true, status: "coming_soon", commercialModel: "plan", category: "reputation" },
      ],
    },
  ];

  const matrix = buildPlanValueMatrix(catalog);
  assert.equal(matrix.length, 1);
  assert.equal(matrix[0].key, "reputation.insights");
  assert.deepEqual(matrix[0].plans, { free: false, level_1: true });
});
