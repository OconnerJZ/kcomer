import test from "node:test";
import assert from "node:assert/strict";
import {
  patchKitchenItem,
  patchOrderStatus,
  patchTransferPayment,
  upsertOrder,
} from "./orderCache.js";

test("inserta una orden realtime sin duplicarla al recibir una actualización", () => {
  const response = { data: [{ id: 1, status: "pending" }] };
  upsertOrder(response, { id: 2, status: "pending" }, { prepend: true });
  upsertOrder(response, { id: 2, status: "accepted", version: 2 });

  assert.deepEqual(response.data.map((order) => order.id), [2, 1]);
  assert.equal(response.data[0].status, "accepted");
  assert.equal(response.data[0].version, 2);
});

test("aplica estado, cocina y pago sobre la misma caché de órdenes", () => {
  const response = { data: [{
    id: 7,
    status: "accepted",
    statusHistory: [],
    items: [{ detailId: 10, quantity: 2, kitchenStatus: "pending" }],
  }] };

  assert.equal(patchOrderStatus(response, { orderId: 7, status: "preparing", timestamp: "2026-09-01T09:00:00.000Z" }), true);
  assert.equal(patchKitchenItem(response, { orderId: 7, detailId: 10, status: "ready" }), true);
  assert.equal(patchTransferPayment(response, { orderId: 7, transferPayment: { status: "submitted" } }), true);

  assert.equal(response.data[0].status, "preparing");
  assert.deepEqual(response.data[0].kitchenProgress, { ready: 2, total: 2 });
  assert.equal(response.data[0].transferPayment.status, "submitted");
  assert.equal(response.data[0].statusHistory.length, 1);
});

test("ignora eventos que no pertenecen a una orden cargada", () => {
  const response = { data: [] };
  assert.equal(patchOrderStatus(response, { orderId: 99, status: "ready" }), false);
  assert.equal(patchKitchenItem(response, { orderId: 99, detailId: 1, status: "ready" }), false);
  assert.equal(patchTransferPayment(response, { orderId: 99, transferPayment: {} }), false);
});
