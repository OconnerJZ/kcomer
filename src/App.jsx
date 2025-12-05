// src/App.jsx
import FilterMenuProvider from "@Context/FilterMenuContext";
import { CartProvider } from "@Hooks/components/useCart";
import { AuthProvider } from "@Context/AuthContext";
import { OrdersProvider } from "@Context/OrderContext";
import Router from "./Router";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

const App = () => {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
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