// src/hooks/useSocket.js
import { useSyncExternalStore, useEffect, useRef } from "react";
import socketService from "@Services/socketService";

/**
 * Estado de conexión del socket, de forma REACTIVA.
 * Reemplaza el patrón imperativo `socketService.isConnected()` dentro de efectos,
 * que causaba el race condition (el efecto leía "false" antes de que el socket
 * terminara de conectar y nunca se volvía a evaluar).
 *
 * useSyncExternalStore es la API oficial de React 18/19 para suscribirse a un
 * store externo mutable como este singleton.
 *
 * @returns {boolean}
 */
export const useSocketConnected = () =>
  useSyncExternalStore(
    socketService.subscribeStatus,
    socketService.getStatusSnapshot,
    () => false, // snapshot para SSR / primer render
  );

/**
 * Suscribe a un evento del socket y —esto es lo clave— vuelve a suscribirse
 * automáticamente cuando el socket (re)conecta, porque `connected` está en las
 * dependencias del efecto. Además usa un ref para el handler, así el listener
 * siempre ejecuta la última versión sin necesidad de re-suscribir en cada render
 * (evita stale closures).
 *
 * @param {string} event - Nombre del evento (ej: "order:new").
 * @param {Function} handler - Callback que recibe el payload del evento.
 * @param {Object} [options]
 * @param {boolean} [options.enabled=true] - Si es false, no engancha nada.
 * @param {{type: "business"|"user", id: string}} [options.room] - Sala a unirse
 *        al conectar. Se re-une automáticamente tras cada reconexión.
 */
export const useSocketEvent = (event, handler, { enabled = true, room } = {}) => {
  const connected = useSocketConnected();

  // Mantener siempre el último handler sin re-suscribir el listener.
  const handlerRef = useRef(handler);
  handlerRef.current = handler;

  const roomType = room?.type;
  const roomId = room?.id;

  useEffect(() => {
    if (!enabled || !connected) return;

    const socket = socketService.socket;
    if (!socket) return;

    // Unirse a la sala correspondiente (idempotente del lado del server).
    // Las salas "business" se persisten para que autoJoinRooms() vuelva a
    // unirse tras un reconnect o un reload aunque el dashboard no esté montado.
    if (roomType === "business" && roomId) socketService.setActiveBusiness(roomId);
    if (roomType === "user" && roomId) socketService.joinUser(roomId);

    const listener = (data) => handlerRef.current?.(data);
    socket.on(event, listener);

    return () => {
      socket.off(event, listener);
    };
    // handler intencionalmente fuera de deps: lo leemos vía ref.
  }, [enabled, connected, event, roomType, roomId]);
};