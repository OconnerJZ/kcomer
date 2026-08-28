import assert from "node:assert/strict";
import test from "node:test";
import { getAllowedDashboardTabs, getOrderCapabilities, hasBusinessPermission } from "./businessPermissions.js";

test("primary owner conserva todos los permisos del negocio", () => {
  const business = { membershipRole: "primary_owner", permissions: [] };
  assert.equal(hasBusinessPermission(business, "ownership.transfer"), true);
  assert.deepEqual(getAllowedDashboardTabs(business), [0, 1, 2, 3]);
});

test("cocina ve órdenes y producción, pero no acepta órdenes", () => {
  const permissions = ["orders.read", "kitchen.read", "kitchen.update"];
  assert.deepEqual(getOrderCapabilities(permissions), {
    canAcceptOrders: false,
    canViewKitchen: true,
    canUpdateKitchen: true,
  });
});

test("caja acepta órdenes sin acceder al tablero de cocina", () => {
  const permissions = ["orders.read", "orders.accept", "payments.review"];
  assert.deepEqual(getOrderCapabilities(permissions), {
    canAcceptOrders: true,
    canViewKitchen: false,
    canUpdateKitchen: false,
  });
});

