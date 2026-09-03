import assert from "node:assert/strict";
import test from "node:test";
import {
  createCustomizationItem,
  createMenuItemCartPayload,
  createMenuItemConfiguration,
  getIncludedIngredients,
  getMenuItemDisplayPrice,
  getMenuItemModifierSummary,
} from "./menuItemSelection.js";

const menuItem = {
  id: 12,
  name: "Hamburguesa",
  price: 100,
  basePrice: 100,
  modifierGroups: [{
    choices: [
      { id: 1, name: "Cebolla", defaultSelected: true, priceExtra: 0 },
      { id: 2, name: "Queso", defaultSelected: false, priceExtra: 15 },
    ],
  }],
};

test("crea una configuración inicial sin compartir referencias mutables", () => {
  const configuration = createMenuItemConfiguration(menuItem);

  assert.deepEqual(configuration, {
    modifiers: [],
    modifierSummary: [],
    note: "",
    price: 100,
    basePrice: 100,
  });
});

test("construye el payload del carrito con la configuración elegida", () => {
  const configuration = {
    modifiers: [{ choiceId: 2, state: "selected" }],
    modifierSummary: [{ name: "Queso", state: "selected", priceExtra: 15 }],
    note: "Sin salsa",
    price: 115,
    basePrice: 100,
  };

  const payload = createMenuItemCartPayload({
    menuItem,
    businessId: 4,
    businessName: "La cocina",
    paymentMethods: [{ id: 1 }],
    quantity: 2,
    configuration,
  });

  assert.equal(payload.itemId, 12);
  assert.equal(payload.businessId, 4);
  assert.equal(payload.item.quantity, 2);
  assert.equal(payload.item.price, 115);
  assert.equal(payload.item.note, "Sin salsa");
  assert.deepEqual(payload.item.modifiers, configuration.modifiers);
});

test("deriva ingredientes, resumen y precio para presentar la selección", () => {
  const configuration = {
    price: 115,
    modifierSummary: [
      { name: "Cebolla", state: "removed", priceExtra: 0 },
      { name: "Queso", state: "selected", priceExtra: 15 },
      { name: "Tomate", state: "selected", priceExtra: 0 },
    ],
  };

  assert.deepEqual(getIncludedIngredients(menuItem).map(({ name }) => name), ["Cebolla"]);
  assert.deepEqual(getMenuItemModifierSummary(configuration), {
    removed: [configuration.modifierSummary[0]],
    selectedExtras: [configuration.modifierSummary[1]],
  });
  assert.equal(getMenuItemDisplayPrice({ menuItem, configuration, quantity: 0 }), 100);
  assert.equal(getMenuItemDisplayPrice({ menuItem, configuration, quantity: 1 }), 115);
  assert.equal(createCustomizationItem(menuItem, configuration).price, 100);
});
