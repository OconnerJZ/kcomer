// src/App.jsx
import { useEffect } from 'react';
import FilterMenuProvider from "@Context/FilterMenuContext";
import { CartProvider } from "@Hooks/components/useCart";
import { AuthProvider, useAuth } from "@Context/AuthContext";
import { OrdersProvider } from "@Context/OrderContext";
import Router from "./Router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import socketService from '@Services/socketService';

// Componente interno que tiene acceso al contexto
const SocketInitializer = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect(user);
      socketService.requestNotificationPermission();
    }

    return () => {
      // NO desconectar - mantener activo
      // socketService.disconnect();
    };
  }, [isAuthenticated, user]);

  return null;
};

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <SocketInitializer />
        <OrdersProvider>
          <CartProvider>
            <FilterMenuProvider>
              <Router />
            </FilterMenuProvider>
          </CartProvider>
        </OrdersProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
};

export default App;