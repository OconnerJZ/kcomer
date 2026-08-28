import test from "node:test";
import assert from "node:assert/strict";
import { flattenCartForSharedOrder, createCheckoutDraft } from "./sharedOrder.js";

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
