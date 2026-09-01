import test from "node:test";
import assert from "node:assert/strict";
import {
  filterOrdersByOperation,
  getOperationalCounts,
  getProductionOrders,
} from "./ownerOrders.js";

const now = new Date("2026-09-01T12:00:00.000Z").getTime();
const order = (id, status, minutesOld) => ({
  id,
  status,
  createdAt: new Date(now - (minutesOld * 60000)).toISOString(),
});

test("deriva los contadores operativos usando un mismo instante", () => {
  const orders = [
    order(1, "pending", 2),
    order(2, "pending", 15),
    order(3, "accepted", 4),
    order(4, "preparing", 30),
    order(5, "ready", 5),
  ];

  assert.deepEqual(getOperationalCounts(orders, now), {
    new: 1,
    preparing: 2,
    ready: 1,
    overdue: 2,
  });
});

test("combina filtros operativos sin mutar las órdenes", () => {
  const orders = [order(1, "accepted", 4), order(2, "preparing", 8), order(3, "ready", 3)];
  assert.deepEqual(filterOrdersByOperation(orders, "preparing", now).map(({ id }) => id), [1, 2]);
  assert.deepEqual(getProductionOrders(orders).map(({ id }) => id), [1, 2, 3]);
  assert.equal(orders.length, 3);
});
