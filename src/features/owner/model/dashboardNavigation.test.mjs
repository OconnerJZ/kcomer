import test from "node:test";
import assert from "node:assert/strict";
import {
  getVisibleDashboardGroups,
  getVisibleDashboardTabs,
} from "./dashboardNavigation.js";

test("mantiene el mismo catálogo para navegación desktop y móvil", () => {
  const tabs = getVisibleDashboardTabs([0, 2], 4);
  assert.deepEqual(tabs.map(({ id }) => id), [0, 2]);
  assert.equal(tabs[0].badge, 4);
  assert.equal(tabs[1].badge, 0);
  assert.equal(tabs[1].mobileLabel, "Reportes");
});

test("agrupa navegación sin alterar tabs ni permisos visibles", () => {
  const groups = getVisibleDashboardGroups([0, 1, 4, 6, 3], 5);

  assert.deepEqual(groups.map(({ id }) => id), ["operation", "growth", "management"]);
  assert.deepEqual(groups[0].items.map(({ id }) => id), [0, 1]);
  assert.deepEqual(groups[1].items.map(({ id }) => id), [4, 6]);
  assert.deepEqual(groups[2].items.map(({ id }) => id), [3]);
  assert.equal(groups[0].badge, 5);
  assert.equal(groups[1].badge, 0);
});

test("oculta grupos que no tienen tabs autorizados", () => {
  const groups = getVisibleDashboardGroups([5], 0);

  assert.deepEqual(groups.map(({ id }) => id), ["growth"]);
  assert.deepEqual(groups[0].items.map(({ id }) => id), [5]);
});
