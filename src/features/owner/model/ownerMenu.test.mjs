import test from "node:test";
import assert from "node:assert/strict";
import {
  canSaveMenuForm,
  filterOwnerMenu,
  getAvailableMenuCount,
  getMenuCategories,
  getModifierSummary,
  toMenuEditorForm,
} from "./ownerMenu.js";

const menu = [
  { id: 1, name: "Taco de birria", description: "Con consomé", price: 35, category: "Tacos", available: true },
  { id: 2, name: "Quesabirria", description: "Con queso", price: 75, category: "Especialidades", available: false },
  { id: 3, name: "Taco dorado", description: "Crujiente", price: 40, category: "Tacos", available: true },
];

test("filtra el menú por texto y categoría sin mutar la colección", () => {
  assert.deepEqual(filterOwnerMenu(menu, "dorado", "Tacos").map((item) => item.id), [3]);
  assert.deepEqual(filterOwnerMenu(menu, "queso", "all").map((item) => item.id), [2]);
  assert.equal(menu.length, 3);
});

test("deriva categorías y disponibilidad para la barra del catálogo", () => {
  assert.deepEqual(getMenuCategories(menu), ["Especialidades", "Tacos"]);
  assert.equal(getAvailableMenuCount(menu), 2);
});

test("crea un formulario independiente y valida nombre con precio positivo", () => {
  const form = toMenuEditorForm(menu[0]);
  form.name = "Modificado";
  assert.equal(menu[0].name, "Taco de birria");
  assert.equal(canSaveMenuForm(form), true);
  assert.equal(canSaveMenuForm({ name: "Sin precio", price: 0 }), false);
});

test("resume grupos y opciones de personalización", () => {
  const summary = getModifierSummary({ modifierGroups: [
    { choices: [{ id: 1 }, { id: 2 }] },
    { choices: [{ id: 3 }] },
  ] });
  assert.deepEqual(summary, { groups: 2, options: 3 });
});
