import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

const CartContext = createContext();
const STORAGE_KEY = "qscome_cart";

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

  const addToCart = ({ itemId, businessId, businessName, item }) => {
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
      const newCart = { ...prev };
      if (!newCart[businessId]) {
        newCart[businessId] = { businessName, items: {}, total: 0 };
      }
      newCart[businessId].items[itemId] = completeItem;
      newCart[businessId].total = Object.values(newCart[businessId].items).reduce(
        (sum, i) => sum + i.price * i.quantity,
        0,
      );
      return newCart;
    });
  };

  const removeFromCart = (businessId, itemId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      if (newCart[businessId]) {
        delete newCart[businessId].items[itemId];
        if (Object.keys(newCart[businessId].items).length === 0) {
          delete newCart[businessId];
        } else {
          newCart[businessId].total = Object.values(newCart[businessId].items).reduce(
            (sum, i) => sum + i.price * i.quantity,
            0,
          );
        }
      }
      return newCart;
    });
  };

  const clearBusiness = (businessId) => {
    setCart((prev) => {
      const newCart = { ...prev };
      delete newCart[businessId];
      return newCart;
    });
  };

  const clearAll = () => setCart({});

  const getCartCount = () =>
    Object.values(cart).reduce(
      (total, business) =>
        total +
        Object.values(business.items).reduce(
          (sum, item) => sum + item.quantity,
          0,
        ),
      0,
    );

  const getGrandTotal = () =>
    Object.values(cart).reduce((total, business) => total + business.total, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearBusiness,
        clearAll,
        getCartCount,
        getGrandTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart debe usarse dentro de CartProvider");
  }
  return context;
};

export default useCart;
