import { createContext, useContext } from "react";

export const OrdersContext = createContext(null);

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) throw new Error("useOrders debe usarse dentro de OrdersProvider");
  return context;
};

export default useOrders;
