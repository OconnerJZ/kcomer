import assert from "node:assert/strict";
import test from "node:test";
import { createOrdersFeedback, getOrderEditingConflict } from "./customerOrdersView.js";

const editingOrder = { id: 7, status: "pending", version: 2 };

test("mantiene abierta una edición que coincide con la versión actual", () => {
  assert.equal(getOrderEditingConflict(editingOrder, [editingOrder]), null);
});

test("bloquea la edición cuando cambia el estado de la orden", () => {
  const conflict = getOrderEditingConflict(editingOrder, [
    { ...editingOrder, status: "preparing", version: 3 },
  ]);

  assert.equal(conflict.severity, "warning");
  assert.match(conflict.message, /cambió de estado/);
});

test("detecta una actualización concurrente por versión", () => {
  const conflict = getOrderEditingConflict(editingOrder, [
    { ...editingOrder, version: 3 },
  ]);

  assert.equal(conflict.key, "7-version-3");
  assert.match(conflict.message, /otra sesión/);
});

test("crea feedback cerrado o visible según exista un mensaje", () => {
  assert.deepEqual(createOrdersFeedback(), {
    open: false,
    message: "",
    severity: "success",
  });
  assert.deepEqual(createOrdersFeedback("Orden cancelada"), {
    open: true,
    message: "Orden cancelada",
    severity: "success",
  });
});
