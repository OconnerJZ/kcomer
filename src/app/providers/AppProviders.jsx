import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterMenuProvider from "@Features/explore/context/FilterMenuContext";
import { CartProvider } from "@Features/cart/context/CartContext";
import { AuthProvider, useAuth } from "@Features/auth/context/AuthContext";
import { OrdersProvider } from "@Features/orders/context/OrderContext";
import socketService from "@Shared/services/realtime/socketService";

const SocketInitializer = () => {
  const { user, isAuthenticated } = useAuth();
  const userId = user?.id;
  const token = user?.token;

  useEffect(() => {
    if (isAuthenticated && userId && token) {
      socketService.connect({ ...user, id: userId, token });
      socketService.requestNotificationPermission();
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated, userId, token]);

  return null;
};

export default function AppProviders({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <SocketInitializer />
        <OrdersProvider>
          <CartProvider>
            <FilterMenuProvider>{children}</FilterMenuProvider>
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}
