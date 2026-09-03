import assert from "node:assert/strict";
import test from "node:test";
import { normalizeMenuItem } from "./menuItem.js";

test("normaliza ingredientes enviados con nombres legacy", () => {
  const item = normalizeMenuItem({
    id: 7,
    optionGroups: [{
      group_id: 3,
      title: "Ingredientes",
      min_select: 0,
      max_select: 0,
      options: [{ choice_id: 11, option_name: "Cebolla", is_default: 1 }],
    }],
  });

  assert.deepEqual(item.modifierGroups, [{
    id: 3,
    title: "Ingredientes",
    minSelect: 0,
    maxSelect: 0,
    selectionType: "multiple",
    required: false,
    choices: [{
      id: 11,
      name: "Cebolla",
      priceExtra: 0,
      defaultSelected: true,
    }],
  }]);
});
