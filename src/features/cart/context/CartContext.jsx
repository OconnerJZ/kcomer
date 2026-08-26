import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const CartContext = createContext();
const STORAGE_KEY = "qscome_cart";

const calculateBusinessTotal = (items) =>
  Object.values(items).reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
  }, [cart]);

  const addToCart = useCallback(
    ({ itemId, businessId, businessName, item }) => {
      const completeItem = {
        id: item.id,
        name: item.name || "",
        description: item.description || "",
        price: Number(item.price) || 0,
        quantity: item.quantity || 0,
        note: item.note || "",
        image: item.image || "",
      };

      setCart((prev) => {
        const currentBusiness = prev[businessId] || {
          businessName,
          items: {},
          total: 0,
        };
        const items = {
          ...currentBusiness.items,
          [itemId]: completeItem,
        };

        return {
          ...prev,
          [businessId]: {
            ...currentBusiness,
            businessName: businessName || currentBusiness.businessName,
            items,
            total: calculateBusinessTotal(items),
          },
        };
      });
    },
    [],
  );

  const removeFromCart = useCallback((businessId, itemId) => {
    setCart((prev) => {
      const currentBusiness = prev[businessId];
      if (!currentBusiness) return prev;

      const items = Object.fromEntries(
        Object.entries(currentBusiness.items).filter(([id]) => String(id) !== String(itemId)),
      );

      if (Object.keys(items).length === 0) {
        const { [businessId]: _removed, ...remainingCart } = prev;
        return remainingCart;
      }

      return {
        ...prev,
        [businessId]: {
          ...currentBusiness,
          items,
          total: calculateBusinessTotal(items),
        },
      };
    });
  }, []);

  const clearBusiness = useCallback((businessId) => {
    setCart((prev) => {
      if (!prev[businessId]) return prev;
      const { [businessId]: _removed, ...remainingCart } = prev;
      return remainingCart;
    });
  }, []);

  const clearAll = useCallback(() => setCart({}), []);

  const cartCount = useMemo(
    () =>
      Object.values(cart).reduce(
        (total, business) =>
          total +
          Object.values(business.items).reduce(
            (sum, item) => sum + item.quantity,
            0,
          ),
        0,
      ),
    [cart],
  );

  const grandTotal = useMemo(
    () => Object.values(cart).reduce((total, business) => total + business.total, 0),
    [cart],
  );

  const getCartCount = useCallback(() => cartCount, [cartCount]);
  const getGrandTotal = useCallback(() => grandTotal, [grandTotal]);

  const value = useMemo(
    () => ({
      cart,
      addToCart,
      removeFromCart,
      clearBusiness,
      clearAll,
      getCartCount,
      getGrandTotal,
    }),
    [
      cart,
      addToCart,
      removeFromCart,
      clearBusiness,
      clearAll,
      getCartCount,
      getGrandTotal,
    ],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

export default useCart;
