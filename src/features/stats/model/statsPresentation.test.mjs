import test from "node:test";
import assert from "node:assert/strict";
import { deltaTone, minutes, orderTypeLabel, paymentLabel } from "./statsPresentation.js";

test("interpreta crecimiento normal e inverso", () => {
  assert.equal(deltaTone(4), "positive");
  assert.equal(deltaTone(4, true), "negative");
  assert.equal(deltaTone(0), "neutral");
});

test("presenta etiquetas financieras y operativas", () => {
  assert.equal(paymentLabel("transfer"), "Transferencia");
  assert.equal(orderTypeLabel("pickup"), "Recoger");
  assert.equal(minutes(12.25), "12.3 min");
  assert.equal(minutes(0), "Sin datos");
});
