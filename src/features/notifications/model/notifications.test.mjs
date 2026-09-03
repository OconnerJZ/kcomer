import assert from "node:assert/strict";
import test from "node:test";
import {
  MAX_NOTIFICATIONS,
  createOrderNotification,
  notificationReducer,
  selectUnreadByBusiness,
  selectUnreadNotifications,
} from "./notifications.js";

const now = new Date("2026-09-02T18:00:00.000Z");

test("normaliza una orden como notificacion reproducible", () => {
  assert.deepEqual(
    createOrderNotification(
      {
        id: 12,
        business_id: 4,
        business_name: "Las Parotas",
        customer_name: "Patsy",
      },
      now,
    ),
    {
      id: "4:12:1788372000000",
      type: "order:new",
      businessId: 4,
      orderId: 12,
      businessName: "Las Parotas",
      title: "Nueva orden · Las Parotas",
      message: "Patsy acaba de realizar un pedido.",
      createdAt: "2026-09-02T18:00:00.000Z",
      read: false,
    },
  );
});

test("mantiene primero lo reciente y limita el historial", () => {
  const notifications = Array.from({ length: MAX_NOTIFICATIONS }, (_, index) => ({
    id: String(index),
    read: false,
  }));
  const added = { id: "new", read: false };

  const next = notificationReducer(notifications, {
    type: "notification/added",
    payload: added,
  });

  assert.equal(next.length, MAX_NOTIFICATIONS);
  assert.strictEqual(next[0], added);
  assert.equal(next.at(-1).id, "98");
});

test("marca una notificacion o todas las de un negocio sin mutar el estado", () => {
  const notifications = [
    { id: "a", businessId: 4, read: false },
    { id: "b", businessId: "4", read: false },
    { id: "c", businessId: 7, read: false },
  ];
  const oneRead = notificationReducer(notifications, {
    type: "notification/read",
    payload: "a",
  });
  const businessRead = notificationReducer(notifications, {
    type: "notification/business-read",
    payload: 4,
  });

  assert.equal(notifications[0].read, false);
  assert.equal(oneRead[0].read, true);
  assert.deepEqual(businessRead.map(({ read }) => read), [true, true, false]);
});

test("deriva pendientes y contadores por negocio", () => {
  const unread = selectUnreadNotifications([
    { businessId: 4, read: false },
    { businessId: "4", read: false },
    { businessId: 7, read: true },
    { businessId: null, read: false },
  ]);

  assert.equal(unread.length, 3);
  assert.deepEqual(selectUnreadByBusiness(unread), { 4: 2 });
});
