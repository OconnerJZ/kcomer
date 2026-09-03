import assert from "node:assert/strict";
import test from "node:test";
import {
  addCartItem,
  calculateCartCount,
  calculateCartGrandTotal,
  clearCartBusiness,
  normalizeStoredCart,
  removeCartItem,
} from "./cart.js";

const firstItem = { id: 4, name: "Tacos", price: 25, quantity: 2 };
const secondItem = { id: 5, name: "Agua", price: 20, quantity: 1 };

test("normaliza un carrito legacy y recalcula su total", () => {
  const cart = normalizeStoredCart({
    8: {
      business_name: "Las Parotas",
      items: { 4: firstItem },
    },
  });

  assert.equal(cart[8].businessName, "Las Parotas");
  assert.equal(cart[8].items[4].quantity, 2);
  assert.equal(cart[8].total, 50);
});

test("agrega productos sin mutar el carrito anterior", () => {
  const initial = {};
  const withTacos = addCartItem(initial, {
    itemId: 4,
    businessId: 8,
    businessName: "Las Parotas",
    paymentMethods: [{ id: 1 }],
    item: firstItem,
  });
  const withDrinks = addCartItem(withTacos, {
    itemId: 5,
    businessId: 8,
    businessName: "Las Parotas",
    item: secondItem,
  });

  assert.deepEqual(initial, {});
  assert.equal(Object.keys(withDrinks[8].items).length, 2);
  assert.equal(withDrinks[8].total, 70);
  assert.deepEqual(withDrinks[8].paymentMethods, [{ id: 1 }]);
});

test("elimina el negocio cuando se retira su último producto", () => {
  const cart = addCartItem({}, {
    itemId: 4,
    businessId: 8,
    businessName: "Las Parotas",
    item: firstItem,
  });

  assert.deepEqual(removeCartItem(cart, 8, 4), {});
  assert.strictEqual(removeCartItem(cart, 99, 4), cart);
});

test("calcula contadores globales y limpia sólo el negocio indicado", () => {
  let cart = addCartItem({}, {
    itemId: 4,
    businessId: 8,
    businessName: "Las Parotas",
    item: firstItem,
  });
  cart = addCartItem(cart, {
    itemId: 5,
    businessId: 9,
    businessName: "Bebidas",
    item: secondItem,
  });

  assert.equal(calculateCartCount(cart), 3);
  assert.equal(calculateCartGrandTotal(cart), 70);
  assert.deepEqual(Object.keys(clearCartBusiness(cart, 8)), ["9"]);
});
