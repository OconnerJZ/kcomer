import { useEffect, useRef, useSyncExternalStore } from "react";
import socketService from "@Shared/services/realtime/socketService";

export const useSocketConnected = () =>
  useSyncExternalStore(
    socketService.subscribeStatus,
    socketService.getStatusSnapshot,
    () => false,
  );

export const useSocketEvent = (event, handler, { enabled = true, room } = {}) => {
  const connected = useSocketConnected();
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const roomType = room?.type;
  const roomId = room?.id;

  useEffect(() => {
    if (!enabled || !connected) return;

    const socket = socketService.socket;
    if (!socket) return;

    if (roomType === "business" && roomId) socketService.setActiveBusiness(roomId);
    if (roomType === "user" && roomId) socketService.joinUser(roomId);

    const listener = (data) => handlerRef.current?.(data);
    socket.on(event, listener);

    return () => socket.off(event, listener);
  }, [enabled, connected, event, roomType, roomId]);
};
