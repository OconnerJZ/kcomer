import assert from "node:assert/strict";
import test from "node:test";
import {
  createBusinessAccessNotification,
  createRealtimeScope,
  getBusinessRoomChanges,
} from "./realtimeScope.js";

test("normaliza el alcance realtime y elimina negocios duplicados", () => {
  assert.deepEqual(createRealtimeScope({ businessIds: [4, "4", 7], role: "owner" }), {
    businessIds: ["4", "7"],
    businessIdsKey: "4|7",
    hasBusinessScope: true,
  });
});

test("un administrador conserva alcance aunque no tenga negocios asignados", () => {
  assert.equal(createRealtimeScope({ role: "admin" }).hasBusinessScope, true);
});

test("calcula las salas que deben sincronizarse tras cambiar permisos", () => {
  assert.deepEqual(getBusinessRoomChanges(new Set(["1", "2"]), [2, 3]), {
    businessIdsToJoin: ["3"],
    businessIdsToLeave: ["1"],
  });
});

test("crea el mensaje correspondiente a una revocacion", () => {
  assert.deepEqual(createBusinessAccessNotification({ businessId: 9, revoked: true }), {
    businessId: "9",
    revoked: true,
    title: "Acceso actualizado",
    body: "Tu acceso a un negocio fue retirado.",
  });
});

test("ignora eventos de acceso sin negocio", () => {
  assert.equal(createBusinessAccessNotification({ revoked: true }), null);
});
