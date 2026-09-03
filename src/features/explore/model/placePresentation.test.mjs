import assert from "node:assert/strict";
import test from "node:test";
import { distanceLabel, foodTypeLabels } from "./placePresentation.js";

test("presenta tipos de comida y distancia aproximada", () => {
  assert.deepEqual(foodTypeLabels({ tags: [{ label: "Birria" }, { name: "Tacos" }] }), ["Birria", "Tacos"]);
  assert.equal(distanceLabel({ latitude: 19.4326, longitude: -99.1332 }, { latitude: 19.4326, longitude: -99.1322 }), "A 105 m");
  assert.equal(distanceLabel(null, {}), "");
});
