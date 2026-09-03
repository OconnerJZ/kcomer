import test from "node:test";
import assert from "node:assert/strict";
import {
  createGroupFromTemplate,
  modifierGroupsChanged,
  setDefaultModifierChoice,
  updateModifierGroup,
  validateModifierGroups,
} from "./menuModifiers.js";

test("la plantilla de selección única conserva una sola opción predeterminada", () => {
  const group = createGroupFromTemplate("single");
  const updated = setDefaultModifierChoice([group], 0, 1, true);
  assert.deepEqual(updated[0].choices.map((choice) => choice.defaultSelected), [false, true]);
  assert.equal(validateModifierGroups(updated), "");
});

test("convertir un grupo a selección única ajusta mínimo y defaults", () => {
  const group = createGroupFromTemplate("ingredients");
  group.minSelect = 3;
  const updated = updateModifierGroup([group], 0, "maxSelect", 1);
  assert.equal(updated[0].minSelect, 1);
  assert.equal(updated[0].choices.filter((choice) => choice.defaultSelected).length, 1);
});

test("detecta límites inválidos y cambios contra la línea base", () => {
  const group = createGroupFromTemplate("extras");
  group.maxSelect = 5;
  assert.match(validateModifierGroups([group]), /máximo supera/);
  assert.equal(modifierGroupsChanged([group], [group]), false);
  assert.equal(modifierGroupsChanged([group], []), true);
});

test("rechaza un mínimo mayor que las opciones aunque no exista máximo", () => {
  const group = createGroupFromTemplate("ingredients");
  group.minSelect = 4;
  assert.match(validateModifierGroups([group]), /mínimo supera/);
});
