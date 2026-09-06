import assert from "node:assert/strict";
import test from "node:test";
import { buildOrderPayload } from "./checkout.js";

test("checkout only sends loyalty redemption intent while preserving server pricing authority", () => {
  const payload = buildOrderPayload({
    businessId: 7,
    business: {
      businessName: "Las Parotas",
      total: 500,
      items: {
        1: { id: 1, quantity: 2, price: 250 },
      },
    },
    user: { id: 9, name: "Cliente", email: "cliente@example.com" },
    orderType: "pickup",
    addressType: "saved",
    addresses: [],
    form: {
      customerPhone: "5551234567",
      paymentMethod: "cash",
      notes: "",
      userAddressId: "",
      newAddress: {},
    },
    useLoyaltyReward: true,
  });

  assert.equal(payload.useLoyaltyReward, true);
  assert.equal(payload.total, 500);
  assert.equal("rewardPercent" in payload, false);
  assert.equal("discountAmount" in payload, false);
  assert.equal("finalTotal" in payload, false);
});
