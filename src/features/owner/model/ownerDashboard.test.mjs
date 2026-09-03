import test from "node:test";
import assert from "node:assert/strict";
import {
  DASHBOARD_STATE,
  getDisplayedDashboardTab,
  getNewestBusinessId,
  getOwnerDashboardState,
  getPendingOrdersCount,
} from "./ownerDashboard.js";

test("prioriza acceso, carga y error antes de mostrar el dashboard", () => {
  const base = {
    canAccess: true,
    loadingBusinesses: false,
    hasBusinesses: true,
    businessError: null,
    selectedBusiness: { id: 1 },
  };

  assert.equal(
    getOwnerDashboardState({ ...base, canAccess: false }),
    DASHBOARD_STATE.REGISTER_ACCESS,
  );
  assert.equal(
    getOwnerDashboardState({ ...base, loadingBusinesses: true, hasBusinesses: false }),
    DASHBOARD_STATE.LOADING,
  );
  assert.equal(
    getOwnerDashboardState({ ...base, businessError: "Error" }),
    DASHBOARD_STATE.ERROR,
  );
  assert.equal(getOwnerDashboardState(base), DASHBOARD_STATE.READY);
});

test("elige una pestaña permitida y cuenta sólo órdenes pendientes", () => {
  assert.equal(getDisplayedDashboardTab(3, [0, 1]), 0);
  assert.equal(getDisplayedDashboardTab(1, [0, 1]), 1);
  assert.equal(getPendingOrdersCount([{ status: "pending" }, { status: "ready" }]), 1);
});

test("obtiene el último negocio de respuestas RTK envueltas o directas", () => {
  assert.equal(getNewestBusinessId({ data: { data: [{ id: 1 }, { id: 2 }] } }), 2);
  assert.equal(getNewestBusinessId({ data: [{ id: 3 }] }), 3);
  assert.equal(getNewestBusinessId({ data: null }), null);
});
