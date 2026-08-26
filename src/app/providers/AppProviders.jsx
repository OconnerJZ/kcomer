import { useEffect } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterMenuProvider from "@Context/FilterMenuContext";
import { CartProvider } from "@Hooks/components/useCart";
import { AuthProvider, useAuth } from "@Context/AuthContext";
import { OrdersProvider } from "@Context/OrderContext";
import socketService from "@Services/socketService";

const SocketInitializer = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect(user);
      socketService.requestNotificationPermission();
    } else {
      socketService.disconnect();
    }
  }, [isAuthenticated, user]);

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
