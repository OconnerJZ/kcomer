import { useEffect, useMemo, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterMenuProvider from "@Features/explore/context/FilterMenuContext";
import { CartProvider } from "@Features/cart/context/CartContext";
import { AuthProvider, useAuth } from "@Features/auth/context/AuthContext";
import { hasGlobalBusinessRealtimeScope } from "@Features/auth/model/roles";
import { getUserBusinessIds } from "@Features/users/model/user";
import { OrdersProvider } from "@Features/orders/context/OrderContext";
import { NotificationProvider, useNotifications } from "@Features/notifications/context/NotificationContext";
import { useSocketConnected, useSocketEvent } from "@Shared/hooks/useSocket";
import socketService from "@Shared/services/realtime/socketService";

const SocketInitializer = () => {
  const { user, isAuthenticated } = useAuth();
  const { addOrderNotification } = useNotifications();
  const connected = useSocketConnected();
  const userId = user?.id;
  const token = user?.token;
  const role = user?.role;
  const joinedBusinessIdsRef = useRef(new Set());

  const businessIds = useMemo(() => getUserBusinessIds(user), [user?.businesses]);
  const businessIdsKey = businessIds.join("|");
  const hasGlobalScope = hasGlobalBusinessRealtimeScope(user);

  useEffect(() => {
    if (isAuthenticated && userId && token) {
      socketService.connect({ ...user, id: userId, token });
      socketService.requestNotificationPermission();
    } else {
      socketService.disconnect();
      joinedBusinessIdsRef.current.clear();
    }
  }, [isAuthenticated, userId, token, role]);

  useEffect(() => {
    if (!connected || !hasGlobalScope) return undefined;

    const joinedIds = joinedBusinessIdsRef.current;
    businessIds.map(String).forEach((businessId) => {
      if (!joinedIds.has(businessId)) {
        socketService.joinBusiness(businessId);
        joinedIds.add(businessId);
      }
    });

    return undefined;
  }, [businessIdsKey, connected, hasGlobalScope]);

  useSocketEvent(
    "order:new",
    (order) => {
      if (!hasGlobalScope) return;

      const notification = addOrderNotification(order);
      socketService.showNotification(notification.title, {
        body: notification.message,
        data: {
          orderId: notification.orderId,
          businessId: notification.businessId,
        },
      });
    },
    { enabled: connected && hasGlobalScope },
  );

  return null;
};

export default function AppProviders({ children }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <AuthProvider>
        <NotificationProvider>
          <SocketInitializer />
          <OrdersProvider>
            <CartProvider>
              <FilterMenuProvider>{children}</FilterMenuProvider>
            </CartProvider>
          </OrdersProvider>
        </NotificationProvider>
      </AuthProvider>
    </LocalizationProvider>
  );
}
