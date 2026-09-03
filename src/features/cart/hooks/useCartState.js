import { useCallback, useEffect, useMemo, useState } from "react";
import {
  addCartItem,
  calculateCartCount,
  calculateCartGrandTotal,
  clearCartBusiness,
  removeCartItem,
} from "../model/cart";
import { cartStorage } from "../storage/cartStorage";

export const useCartState = () => {
  const [cart, setCart] = useState(() => cartStorage.load());

  useEffect(() => {
    cartStorage.save(cart);
  }, [cart]);

  const addToCart = useCallback((payload) => {
    setCart((current) => addCartItem(current, payload));
  }, []);

  const removeFromCart = useCallback((businessId, itemId) => {
    setCart((current) => removeCartItem(current, businessId, itemId));
  }, []);

  const clearBusiness = useCallback((businessId) => {
    setCart((current) => clearCartBusiness(current, businessId));
  }, []);

  const clearAll = useCallback(() => setCart({}), []);
  const cartCount = useMemo(() => calculateCartCount(cart), [cart]);
  const grandTotal = useMemo(() => calculateCartGrandTotal(cart), [cart]);
  const getCartCount = useCallback(() => cartCount, [cartCount]);
  const getGrandTotal = useCallback(() => grandTotal, [grandTotal]);

  return useMemo(() => ({
    cart,
    addToCart,
    removeFromCart,
    clearBusiness,
    clearAll,
    getCartCount,
    getGrandTotal,
  }), [
    addToCart,
    cart,
    clearAll,
    clearBusiness,
    getCartCount,
    getGrandTotal,
    removeFromCart,
  ]);
};

export default useCartState;
