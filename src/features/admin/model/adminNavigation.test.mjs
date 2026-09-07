import test from "node:test";
import assert from "node:assert/strict";
import {
  ADMIN_MODULE_STATUS,
  ADMIN_MODULES,
  getAdminModuleForPath,
  getAdminModulesBySection,
} from "./adminNavigation.js";

test("resuelve el módulo activo para rutas admin anidadas", () => {
  assert.equal(getAdminModuleForPath("/admin").id, "overview");
  assert.equal(getAdminModuleForPath("/admin/businesses").id, "businesses");
  assert.equal(getAdminModuleForPath("/admin/businesses/12").id, "businesses");
  assert.equal(getAdminModuleForPath("/admin/users").id, "users");
  assert.equal(getAdminModuleForPath("/admin/users/7").id, "users");
  assert.equal(getAdminModuleForPath("/admin/plans").id, "plans");
  assert.equal(getAdminModuleForPath("/admin/plans/history").id, "plans");
  assert.equal(getAdminModuleForPath("/admin/features").id, "features");
  assert.equal(getAdminModuleForPath("/admin/features/business/12").id, "features");
});

test("usa el overview como fallback sin habilitar rutas inexistentes", () => {
  assert.equal(getAdminModuleForPath("/admin/desconocido").id, "overview");
});

test("mantiene el catálogo agrupado y distingue módulos disponibles de planeados", () => {
  const sections = getAdminModulesBySection();
  const flattened = sections.flatMap(({ modules }) => modules);

  assert.deepEqual(flattened.map(({ id }) => id), ADMIN_MODULES.map(({ id }) => id));
  assert.equal(ADMIN_MODULES.find(({ id }) => id === "plans")?.status, ADMIN_MODULE_STATUS.READY);
  assert.equal(ADMIN_MODULES.find(({ id }) => id === "businesses")?.status, ADMIN_MODULE_STATUS.READY);
  assert.equal(ADMIN_MODULES.find(({ id }) => id === "users")?.status, ADMIN_MODULE_STATUS.READY);
  assert.equal(ADMIN_MODULES.find(({ id }) => id === "features")?.status, ADMIN_MODULE_STATUS.READY);
  assert.equal(ADMIN_MODULES.find(({ id }) => id === "marketing")?.status, ADMIN_MODULE_STATUS.PLANNED);
});
