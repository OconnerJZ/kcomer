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

  useEffect(() => {
    handlerRef.current = handler;
  }, [handler]);

  const roomType = room?.type;
  const roomId = room?.id;

  useEffect(() => {
    if (!enabled || !connected) return;

    const socket = socketService.socket;
    if (!socket) return;

    if (roomType === "business" && roomId) socketService.setActiveBusiness(roomId);
    if (roomType === "shared-order" && roomId) socketService.joinSharedOrder(roomId);
    // La sala personal se asigna en el servidor desde el JWT; el cliente nunca
    // elige un userId para evitar suscripciones a notificaciones ajenas.

    const listener = (data) => handlerRef.current?.(data);
    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
      if (roomType === "shared-order" && roomId) socketService.leaveSharedOrder(roomId);
    };
  }, [enabled, connected, event, roomType, roomId]);
};
