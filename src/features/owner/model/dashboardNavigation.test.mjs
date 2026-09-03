import test from "node:test";
import assert from "node:assert/strict";
import { getVisibleDashboardTabs } from "./dashboardNavigation.js";

test("mantiene el mismo catálogo para navegación desktop y móvil", () => {
  const tabs = getVisibleDashboardTabs([0, 2], 4);
  assert.deepEqual(tabs.map(({ id }) => id), [0, 2]);
  assert.equal(tabs[0].badge, 4);
  assert.equal(tabs[1].badge, 0);
  assert.equal(tabs[1].mobileLabel, "Reportes");
});
