import test from "node:test";
import assert from "node:assert/strict";
import { ORDER_STATUS, ORDER_STATUS_VALUES, STATUS_LABELS } from "./orderStatus.js";

test("deriva valores y etiquetas desde un único catálogo de estados", () => {
  assert.equal(ORDER_STATUS_VALUES.PREPARING, "preparing");
  assert.equal(STATUS_LABELS[ORDER_STATUS_VALUES.PREPARING], ORDER_STATUS.preparing.label);
  assert.equal(STATUS_LABELS[ORDER_STATUS_VALUES.CANCELLED], "Cancelada");
});
