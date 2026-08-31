import assert from "node:assert/strict";
import test from "node:test";
import { normalizeCatalogOption } from "./catalogOption.js";

test("normaliza el contrato de food-types con nombre visible", () => {
  assert.deepEqual(normalizeCatalogOption({ food_type_id: 4, type_name: "Birria" }), {
    id: 4,
    label: "Birria",
    name: "Birria",
  });
});
