import PropTypes from "prop-types";
import useCartState from "../hooks/useCartState";
import CartContext from "./cartContext";

export const CartProvider = ({ children }) => {
  const value = useCartState();
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
