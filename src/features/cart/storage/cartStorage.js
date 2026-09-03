import { normalizeStoredCart } from "../model/cart.js";

const STORAGE_KEY = "qscome_cart";

export const cartStorage = {
  load() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? normalizeStoredCart(JSON.parse(saved)) : {};
    } catch {
      return {};
    }
  },

  save(cart) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
      return true;
    } catch {
      return false;
    }
  },
};

export { STORAGE_KEY };
