import assert from "node:assert/strict";
import test from "node:test";
import {
  buildBusinessMapsEmbedUrl,
  getBusinessPhotoUrls,
  resolveExploreMediaUrl,
} from "./cardPlaceMovement.js";

test("construye mapas por coordenadas y usa la dirección como respaldo", () => {
  assert.equal(
    buildBusinessMapsEmbedUrl({ latitude: 19.2, longitude: -99.6 }),
    "https://www.google.com/maps?q=19.2%2C-99.6&output=embed",
  );
  assert.equal(
    buildBusinessMapsEmbedUrl({ address: "Toluca Centro" }),
    "https://www.google.com/maps?q=Toluca%20Centro&output=embed",
  );
});

test("normaliza fotografías locales y conserva URLs absolutas", () => {
  const photos = getBusinessPhotoUrls({
    photos: ["one.jpg", { imageUrl: "https://cdn.example.com/two.jpg" }, {}],
  }, "https://api.example.com/media/");
  assert.deepEqual(photos, [
    "https://api.example.com/media/one.jpg",
    "https://cdn.example.com/two.jpg",
  ]);
  assert.equal(resolveExploreMediaUrl("", "https://api.example.com"), "");
});
