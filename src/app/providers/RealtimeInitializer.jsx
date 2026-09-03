import { useMemo } from "react";
import { useDispatch } from "react-redux";
import useAuth from "@Features/auth/context/useAuth";
import { useNotifications } from "@Features/notifications/context/NotificationContext";
import { getUserBusinessIds } from "@Features/users/model/user";
import { useRealtimeSession } from "@App/hooks/useRealtimeSession";
import {
  createBusinessAccessNotification,
  createRealtimeScope,
} from "@App/model/realtimeScope";
import { api } from "@Shared/api/rtk/api";
import { useSocketConnected, useSocketEvent } from "@Shared/hooks/useSocket";
import socketService from "@Shared/services/realtime/socketService";

const clearRevokedActiveBusiness = (businessId) => {
  try {
    if (localStorage.getItem("owner_business_id") === businessId) {
      socketService.clearActiveBusiness();
    }
  } catch {
    // El almacenamiento puede no estar disponible en navegacion privada.
  }
};

export default function RealtimeInitializer() {
  const { user, isAuthenticated, updateUser } = useAuth();
  const dispatch = useDispatch();
  const { addOrderNotification } = useNotifications();
  const connected = useSocketConnected();
  const scope = useMemo(
    () => createRealtimeScope({ businessIds: getUserBusinessIds(user), role: user?.role }),
    [user],
  );

  const { leaveBusinessRoom } = useRealtimeSession({
    businessIds: scope.businessIds,
    businessIdsKey: scope.businessIdsKey,
    connected,
    isAuthenticated,
    user,
  });

  useSocketEvent(
    "order:new",
    (order) => {
      if (!scope.hasBusinessScope) return;

      const notification = addOrderNotification(order);
      socketService.showNotification(notification.title, {
        body: notification.message,
        data: {
          orderId: notification.orderId,
          businessId: notification.businessId,
        },
      });
    },
    { enabled: connected && scope.hasBusinessScope },
  );

  useSocketEvent(
    "business:access_changed",
    async (payload) => {
      const notification = createBusinessAccessNotification(payload);
      if (!notification) return;

      if (notification.revoked) {
        leaveBusinessRoom(notification.businessId);
        clearRevokedActiveBusiness(notification.businessId);
      }

      dispatch(api.util.invalidateTags(["Business", "BusinessTeam"]));
      await updateUser();
      socketService.showNotification(notification.title, {
        body: notification.body,
        data: { businessId: notification.businessId },
      });
    },
    { enabled: connected },
  );

  return null;
}
