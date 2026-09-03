import assert from "node:assert/strict";
import test from "node:test";
import {
  buildInitialSelection,
  createCustomizationConfiguration,
  resolveCustomizationSelection,
  toggleChoiceSelection,
  validateCustomizationSelection,
} from "./productCustomization.js";

const groups = [
  {
    id: 1,
    title: "Proteína",
    selectionType: "single",
    minSelect: 1,
    maxSelect: 1,
    choices: [
      { id: 10, name: "Carne", defaultSelected: true, priceExtra: 0 },
      { id: 11, name: "Pollo", defaultSelected: false, priceExtra: 5 },
    ],
  },
  {
    id: 2,
    title: "Ingredientes",
    minSelect: 0,
    maxSelect: 2,
    choices: [
      { id: 20, name: "Cebolla", defaultSelected: true, priceExtra: 0 },
      { id: 21, name: "Queso", defaultSelected: false, priceExtra: 12.5 },
    ],
  },
];

test("combina defaults con los modificadores previamente guardados", () => {
  const selected = buildInitialSelection(groups, [
    { choiceId: 20, state: "removed" },
    { choiceId: 21, state: "selected" },
  ]);

  assert.deepEqual([...selected.keys()], [10, 21]);
});

test("una selección única reemplaza la opción anterior sin mutar el mapa", () => {
  const current = buildInitialSelection(groups);
  const next = toggleChoiceSelection(current, groups[0], groups[0].choices[1]);

  assert.equal(current.has(10), true);
  assert.equal(next.has(10), false);
  assert.equal(next.has(11), true);
});

test("resuelve removidos, extras y el precio final", () => {
  let selected = buildInitialSelection(groups);
  selected = toggleChoiceSelection(selected, groups[1], groups[1].choices[0]);
  selected = toggleChoiceSelection(selected, groups[1], groups[1].choices[1]);
  const preview = resolveCustomizationSelection(groups, selected);
  const configuration = createCustomizationConfiguration({
    item: { price: 100 },
    preview,
    note: "  Salsa aparte  ",
  });

  assert.deepEqual(preview.modifiers, [
    { choiceId: 10, state: "selected" },
    { choiceId: 20, state: "removed" },
    { choiceId: 21, state: "selected" },
  ]);
  assert.equal(configuration.price, 112.5);
  assert.equal(configuration.basePrice, 100);
  assert.equal(configuration.note, "Salsa aparte");
});

test("informa la primera regla de selección incumplida", () => {
  const emptySelection = new Map();
  assert.equal(
    validateCustomizationSelection(groups, emptySelection),
    "Proteína: selecciona al menos 1",
  );
  assert.equal(validateCustomizationSelection(groups, buildInitialSelection(groups)), "");
});
