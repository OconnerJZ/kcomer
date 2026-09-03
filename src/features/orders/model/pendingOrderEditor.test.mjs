import assert from "node:assert/strict";
import test from "node:test";
import {
  addPendingOrderMenuItem,
  calculatePendingOrderTotal,
  changePendingOrderItemQuantity,
  createPendingOrderDraft,
  customizePendingOrderItem,
  enrichPendingOrderDraft,
  getAvailablePendingOrderMenu,
  removePendingOrderItem,
  toPendingOrderUpdatePayload,
} from "./pendingOrderEditor.js";

const orderItems = [{
  id: "3",
  name: "Hamburguesa",
  price: 110,
  quantity: 2,
  note: "Sin salsa",
  modifiers: [{ choiceId: "8", name: "Queso", priceExtra: 10 }],
}];

const menu = [
  { id: 3, name: "Hamburguesa actual", price: 100, modifierGroups: [{ id: 1 }] },
  { id: 4, name: "Papas", price: 45, modifierGroups: [] },
];

test("crea el borrador y lo enriquece con el menú sin perder cambios de la orden", () => {
  const draft = createPendingOrderDraft(orderItems);
  const enriched = enrichPendingOrderDraft(draft, menu);

  assert.equal(enriched[0].name, "Hamburguesa actual");
  assert.equal(enriched[0].price, 110);
  assert.equal(enriched[0].basePrice, 100);
  assert.deepEqual(enriched[0].modifierGroups, [{ id: 1 }]);
});

test("actualiza cantidades y elimina productos al llegar a cero", () => {
  const draft = createPendingOrderDraft(orderItems);

  assert.equal(changePendingOrderItemQuantity(draft, 3, 1)[0].quantity, 3);
  assert.deepEqual(changePendingOrderItemQuantity(draft, 3, -2), []);
  assert.deepEqual(removePendingOrderItem(draft, 3), []);
});

test("agrega, personaliza y filtra productos disponibles", () => {
  const draft = createPendingOrderDraft(orderItems);
  const withPapas = addPendingOrderMenuItem(draft, menu[1]);
  const customized = customizePendingOrderItem(withPapas, 4, {
    note: "Crujientes",
    price: 50,
  });

  assert.equal(customized[1].quantity, 1);
  assert.equal(customized[1].note, "Crujientes");
  assert.equal(calculatePendingOrderTotal(customized), 270);
  assert.deepEqual(getAvailablePendingOrderMenu(menu, draft).map(({ id }) => id), [4]);
});

test("construye únicamente el contrato aceptado por la actualización", () => {
  const payload = toPendingOrderUpdatePayload(createPendingOrderDraft(orderItems));

  assert.deepEqual(payload, [{
    id: 3,
    quantity: 2,
    note: "Sin salsa",
    modifiers: [{ choiceId: 8, state: "selected" }],
  }]);
});
