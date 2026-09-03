import test from "node:test";
import assert from "node:assert/strict";
import {
  DEFAULT_MAP_CENTER,
  getLocationAddress,
  getLocationErrorMessage,
  hasLocationCoordinates,
  toMapCoordinates,
  toPublishedLocation,
} from "./mapLocation.js";

test("normaliza coordenadas legacy y usa un centro seguro", () => {
  assert.deepEqual(toMapCoordinates({ latitude: "19.28", longitude: "-99.65" }), {
    lat: 19.28,
    lng: -99.65,
  });
  assert.deepEqual(toMapCoordinates(), DEFAULT_MAP_CENTER);
  assert.equal(hasLocationCoordinates({ latitude: 0, longitude: 0 }), true);
  assert.equal(hasLocationCoordinates({ latitude: "", longitude: null }), false);
});

test("construye la ubicación publicada sin perder geocodificación", () => {
  const location = toPublishedLocation(
    { lat: 19.28, lng: -99.65 },
    { formatted_address: "Toluca", city: "Toluca" },
  );
  assert.equal(location.latitude, 19.28);
  assert.equal(location.city, "Toluca");
  assert.equal(getLocationAddress(location), "Toluca");
});

test("traduce errores conocidos de geolocalización", () => {
  assert.equal(getLocationErrorMessage({ code: 1 }), "Permiso de ubicación denegado");
  assert.equal(getLocationErrorMessage(new Error("Sin señal")), "Sin señal");
});
