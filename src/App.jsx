// src/App.jsx
import { useEffect } from "react";
import FilterMenuProvider from "@Context/FilterMenuContext";
import { CartProvider } from "@Hooks/components/useCart";
import { AuthProvider, useAuth } from "@Context/AuthContext";
import { OrdersProvider } from "@Context/OrderContext";
import Router from "./Router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import socketService from "@Services/socketService";

// Componente interno que tiene acceso al contexto
const SocketInitializer = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      // connect() es idempotente: si ya está conectado con el mismo user,
      // reutiliza el socket existente.
      socketService.connect(user);
      socketService.requestNotificationPermission();
    } else {
      // Sesión cerrada / sin usuario: cerrar el socket para no dejarlo vivo
      // con el auth del usuario anterior.
      socketService.disconnect();
    }
    // El socket vive a nivel de app; no lo desconectamos en el cleanup de cada
    // render, sólo cuando isAuthenticated pasa a false (rama else de arriba).
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