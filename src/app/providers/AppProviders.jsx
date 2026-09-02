import PropTypes from "prop-types";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterMenuProvider from "@Features/explore/context/FilterMenuContext";
import CartProvider from "@Features/cart/context/CartProvider";
import AuthProvider from "@Features/auth/context/AuthProvider";
import { OrdersProvider } from "@Features/orders/context/OrderContext";
import { NotificationProvider } from "@Features/notifications/context/NotificationContext";
import { FeedbackProvider } from "@Shared/feedback/FeedbackProvider";
import RealtimeInitializer from "./RealtimeInitializer";

export default function AppProviders({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <FeedbackProvider>
        <AuthProvider>
          <NotificationProvider>
            <RealtimeInitializer />
            <OrdersProvider>
              <CartProvider>
                <FilterMenuProvider>{children}</FilterMenuProvider>
              </CartProvider>
            </OrdersProvider>
          </NotificationProvider>
        </AuthProvider>
      </FeedbackProvider>
    </LocalizationProvider>
  );
}

AppProviders.propTypes = {
  children: PropTypes.node.isRequired,
};
