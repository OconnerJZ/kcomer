import test from "node:test";
import assert from "node:assert/strict";
import {
  createCheckoutDraft,
  createSharedOrderItemOperation,
  findOwnSharedOrderItem,
  flattenCartForSharedOrder,
  toSharedOrderItemConfiguration,
} from "./sharedOrder.js";

test("conserva negocios y modificadores al importar un carrito", () => {
  const items = flattenCartForSharedOrder({ 7: { items: { a: { id: 12, quantity: 2, modifiers: [{ choiceId: 3, state: "removed" }] } } }, 9: { items: { b: { id: 15, quantity: 1 } } } });
  assert.deepEqual(items.map((item) => item.businessId), [7, 9]);
  assert.deepEqual(items[0].modifiers, [{ choiceId: 3, state: "removed" }]);
});

test("crea una configuración independiente por negocio", () => {
  const draft = createCheckoutDraft([{ id: 4, paymentMethods: [{ method: "transfer", active: true }] }, { id: 8, paymentMethods: [{ method: "cash", active: true }] }], { name: "Ana" });
  assert.equal(draft[4].paymentMethod, "transfer");
  assert.equal(draft[8].paymentMethod, "cash");
});

test("encuentra únicamente el producto propio del negocio", () => {
  const session = {
    items: [
      { id: 1, mine: false, businessId: 7, menuId: 12 },
      { id: 2, mine: true, businessId: 7, menuId: 12, unitPrice: 80 },
    ],
  };
  assert.equal(findOwnSharedOrderItem(session, 7, 12).id, 2);
  assert.equal(findOwnSharedOrderItem(session, 8, 12), null);
});

test("deriva operaciones para agregar, actualizar y eliminar", () => {
  const baseSession = { id: 4, version: 9, items: [] };
  const payload = { itemId: 12, item: { quantity: 2, note: "Sin cebolla", modifiers: [] } };
  const add = createSharedOrderItemOperation({ session: baseSession, businessId: 7, payload });
  assert.equal(add.type, "add");
  assert.deepEqual(add.args, {
    id: 4,
    expectedVersion: 9,
    businessId: 7,
    menuId: 12,
    quantity: 2,
    note: "Sin cebolla",
    modifiers: [],
  });

  const session = {
    ...baseSession,
    items: [{ id: 33, mine: true, businessId: 7, menuId: 12 }],
  };
  assert.equal(createSharedOrderItemOperation({ session, businessId: 7, payload }).type, "update");
  assert.equal(createSharedOrderItemOperation({
    session,
    businessId: 7,
    payload: { ...payload, item: { ...payload.item, quantity: 0 } },
  }).type, "delete");
});

test("construye la configuración inicial de un producto compartido", () => {
  assert.deepEqual(toSharedOrderItemConfiguration({
    modifiers: [{ choiceId: 2 }],
    note: "Aparte",
    unitPrice: 95,
    version: 3,
  }, { price: 80 }), {
    modifiers: [{ choiceId: 2 }],
    note: "Aparte",
    price: 95,
    basePrice: 80,
    version: 3,
  });
});
