import test from "node:test";
import assert from "node:assert/strict";
import {
  canManageBusinessTeam,
  getDisplayedSettingsTab,
  getSettingsSections,
  toggleFoodTypeSelection,
  togglePaymentMethod,
  updatePaymentMethodConfig,
} from "./ownerSettings.js";

test("agrega equipo sólo para propietarios o miembros autorizados", () => {
  assert.equal(canManageBusinessTeam({ membershipRole: "primary_owner" }), true);
  assert.equal(canManageBusinessTeam({ permissions: ["team.manage"] }), true);
  assert.equal(canManageBusinessTeam({ permissions: ["orders.view"] }), false);
  assert.equal(getSettingsSections(true).at(-1).key, "team");
  assert.equal(getSettingsSections(false).some(({ key }) => key === "team"), false);
});

test("evita una pestaña inválida cuando cambian los permisos", () => {
  assert.equal(getDisplayedSettingsTab(9, getSettingsSections(false)), 0);
  assert.equal(getDisplayedSettingsTab(9, getSettingsSections(true)), 9);
});

test("actualiza pagos y categorías sin mutar el estado original", () => {
  const payments = [{ method: "transfer", active: false, config: { bank: "A" } }];
  const toggled = togglePaymentMethod(payments, "transfer");
  const configured = updatePaymentMethodConfig(payments, "transfer", "account", "123");

  assert.equal(toggled[0].active, true);
  assert.deepEqual(configured[0].config, { bank: "A", account: "123" });
  assert.equal(payments[0].active, false);
  assert.deepEqual(toggleFoodTypeSelection([1, 2], "2"), [1]);
  assert.deepEqual(toggleFoodTypeSelection([1], 3), [1, 3]);
});
