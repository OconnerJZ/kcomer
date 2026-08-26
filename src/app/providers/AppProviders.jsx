import { useEffect, useMemo, useRef } from "react";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import FilterMenuProvider from "@Features/explore/context/FilterMenuContext";
import { CartProvider } from "@Features/cart/context/CartContext";
import { AuthProvider, useAuth } from "@Features/auth/context/AuthContext";
import { hasGlobalBusinessRealtimeScope } from "@Features/auth/model/roles";
import { getUserBusinessIds } from "@Features/users/model/user";
import { OrdersProvider } from "@Features/orders/context/OrderContext";
import { useSocketConnected, useSocketEvent } from "@Shared/hooks/useSocket";
import socketService from "@Shared/services/realtime/socketService";

const SocketInitializer = () => {
  const { user, isAuthenticated } = useAuth();
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
    if (!connected || !hasGlobalScope) {
      return undefined;
    }

    const joinedIds = joinedBusinessIdsRef.current;

    businessIds.map(String).forEach((businessId) => {
      if (!joinedIds.has(businessId)) {
        socketService.joinBusiness(businessId);
        joinedIds.add(businessId);
      }
    });

    // Para el owner principal no abandonamos salas al cambiar de negocio visible:
    // su alcance realtime es global durante toda la sesión. Una desconexión/logout
    // limpia todas las suscripciones del socket.
    return undefined;
  }, [businessIdsKey, connected, hasGlobalScope]);

  useSocketEvent(
    "order:new",
    (order) => {
      if (!hasGlobalScope) return;

      const businessName =
        order?.businessName || order?.business_name || order?.business?.name || "otro negocio";
      const customerName = order?.customerName || order?.customer_name || "Un cliente";

      socketService.showNotification(`Nueva orden · ${businessName}`, {
        body: `${customerName} acaba de realizar un pedido.`,
        data: {
          orderId: order?.id,
          businessId: order?.businessId ?? order?.business_id,
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
