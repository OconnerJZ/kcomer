import { useCallback, useEffect, useRef } from "react";
import { getBusinessRoomChanges } from "@App/model/realtimeScope";
import socketService from "@Shared/services/realtime/socketService";

export const useRealtimeSession = ({
  businessIds,
  businessIdsKey,
  connected,
  isAuthenticated,
  user,
}) => {
  const joinedBusinessIdsRef = useRef(new Set());
  const userId = user?.id;
  const token = user?.token;

  useEffect(() => {
    if (isAuthenticated && userId && token) {
      socketService.connect({ ...user, id: userId, token });
      socketService.requestNotificationPermission();
      return;
    }

    socketService.disconnect();
  }, [isAuthenticated, token, user, userId]);

  useEffect(() => {
    const joinedIds = joinedBusinessIdsRef.current;

    if (!connected) {
      joinedIds.clear();
      return;
    }

    const { businessIdsToJoin, businessIdsToLeave } = getBusinessRoomChanges(
      joinedIds,
      businessIds,
    );

    businessIdsToLeave.forEach((businessId) => {
      socketService.leaveBusiness(businessId);
      joinedIds.delete(businessId);
    });

    businessIdsToJoin.forEach((businessId) => {
      socketService.joinBusiness(businessId);
      joinedIds.add(businessId);
    });
  }, [businessIds, businessIdsKey, connected]);

  const leaveBusinessRoom = useCallback((businessId) => {
    const normalizedBusinessId = String(businessId || "");
    if (!normalizedBusinessId) return;

    joinedBusinessIdsRef.current.delete(normalizedBusinessId);
    socketService.leaveBusiness(normalizedBusinessId);
  }, []);

  return { leaveBusinessRoom };
};
