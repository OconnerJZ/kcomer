import { io } from "socket.io-client";
import { API_URL_SERVER } from "@Shared/config/env";

const DEV = import.meta.env?.DEV ?? false;
const log = (...a) => DEV && console.log(...a);
const warn = (...a) => DEV && console.warn(...a);
const logError = (...a) => DEV && console.error(...a);

const SOCKET_CONFIG = {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  timeout: 20000,
  autoConnect: false,
};

const RECONNECT_STRATEGIES = {
  EXPONENTIAL: "exponential",
  LINEAR: "linear",
};

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.currentUser = null;
    this.reconnectStrategy = RECONNECT_STRATEGIES.EXPONENTIAL;
    this.eventHandlers = new Map();
    this._statusListeners = new Set();
  }

  subscribeStatus = (listener) => {
    this._statusListeners.add(listener);
    return () => this._statusListeners.delete(listener);
  };

  getStatusSnapshot = () => this.connected;

  _emitStatus = () => {
    this._statusListeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        logError("Error en status listener:", error);
      }
    });
  };

  connect(user) {
    if (!user || !user.token) {
      logError("❌ No se puede conectar sin usuario o token");
      return null;
    }

    if (this.socket?.connected && this.currentUser?.id === user.id) {
      log("✅ Socket ya conectado para este usuario");
      return this.socket;
    }

    if (this.socket && this.currentUser?.id !== user.id) {
      log("🔄 Cambiando usuario, desconectando socket anterior");
      this.disconnect();
    }

    this.currentUser = user;

    this.socket = io(API_URL_SERVER, {
      ...SOCKET_CONFIG,
      auth: {
        token: user.token,
      },
    });

    this.setupEventHandlers();
    this.socket.connect();

    log("🔌 Iniciando conexión Socket.IO...");
    return this.socket;
  }

  setupEventHandlers() {
    if (!this.socket) return;

    this.socket.on("connect", () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this._emitStatus();
      log("✅ Socket.IO conectado:", this.socket.id);
      this.autoJoinRooms();
      this.notifyListeners("connected", { socketId: this.socket.id });
    });

    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      this._emitStatus();
      log("❌ Socket.IO desconectado:", reason);
      this.notifyListeners("disconnected", { reason });

      if (reason === "io server disconnect") {
        warn("⚠️ Servidor cerró la conexión");
      } else if (reason === "transport close" || reason === "ping timeout") {
        log("🔄 Pérdida de conexión, intentando reconectar...");
      }
    });

    this.socket.on("connect_error", (error) => {
      logError("❌ Error de conexión Socket.IO:", error.message);
      this.reconnectAttempts++;

      this.notifyListeners("connection_error", {
        error: error.message,
        attempts: this.reconnectAttempts,
      });

      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        logError("❌ Máximo de intentos de reconexión alcanzado");
        this.disconnect();
        this.notifyListeners("max_reconnect_attempts_reached");
      }
    });

    this.socket.on("reconnect_attempt", (attemptNumber) => {
      log(`🔄 Intento de reconexión #${attemptNumber}`);
      this.notifyListeners("reconnect_attempt", { attemptNumber });
    });

    this.socket.on("reconnect", (attemptNumber) => {
      log("🎉 Socket.IO reconectado (intento:", attemptNumber, ")");
      this.reconnectAttempts = 0;
      this.notifyListeners("reconnected", { attemptNumber });
      this.autoJoinRooms();
    });

    this.socket.on("reconnect_failed", () => {
      logError("❌ Falló la reconexión después de todos los intentos");
      this.notifyListeners("reconnect_failed");
    });

    this.socket.on("auth_error", (error) => {
      logError("❌ Error de autenticación:", error);
      this.notifyListeners("auth_error", error);
      this.disconnect();
    });
  }

  autoJoinRooms() {
    if (!this.currentUser) return;

    const businessIdToJoin = localStorage.getItem("owner_business_id");
    if (businessIdToJoin) {
      this.joinBusiness(businessIdToJoin);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket.removeAllListeners();
      this.socket = null;
      this.connected = false;
      this.currentUser = null;
      this.reconnectAttempts = 0;
      this.listeners.clear();
      this.eventHandlers.clear();
      this.clearActiveBusiness();
      this._emitStatus();
      log("👋 Socket.IO desconectado manualmente");
    }
  }

  isConnected() {
    return this.socket?.connected || false;
  }

  getSocketId() {
    return this.socket?.id || null;
  }

  joinBusiness(businessId) {
    if (!this.socket?.connected) {
      warn("⚠️ Socket no conectado, no se puede unir a sala");
      return;
    }

    if (!businessId) {
      logError("❌ businessId requerido para unirse a sala");
      return;
    }

    log("📤 Emitiendo join:business con ID:", businessId);

    this.socket.emit("join:business", businessId, (response) => {
      if (response?.success) {
        log("✅ Unido a sala business:", businessId);
      } else {
        logError("❌ Error al unirse a sala business:", response?.error);
      }
    });
  }

  leaveBusiness(businessId) {
    if (this.socket?.connected) {
      this.socket.emit("leave:business", businessId);
      log("👋 Saliendo de sala business:", businessId);
    }
  }

  joinSharedOrder(sessionId) {
    if (!this.socket?.connected || !sessionId) return;
    this.socket.emit("join:shared-order", sessionId, (response) => {
      if (!response?.success) logError("No se pudo entrar al realtime compartido:", response?.error);
    });
  }

  leaveSharedOrder(sessionId) {
    if (this.socket?.connected && sessionId) this.socket.emit("leave:shared-order", sessionId);
  }

  setActiveBusiness(businessId) {
    if (!businessId) return;

    const nextBusinessId = String(businessId);
    let previousBusinessId = null;

    try {
      previousBusinessId = localStorage.getItem("owner_business_id");
      localStorage.setItem("owner_business_id", nextBusinessId);
    } catch (error) {
      logError("No se pudo persistir owner_business_id:", error);
    }

    if (this.socket?.connected) {
      if (previousBusinessId && previousBusinessId !== nextBusinessId) {
        this.leaveBusiness(previousBusinessId);
      }
      if (previousBusinessId !== nextBusinessId) {
        this.joinBusiness(nextBusinessId);
      }
    }
  }

  clearActiveBusiness() {
    try {
      const activeBusinessId = localStorage.getItem("owner_business_id");
      if (activeBusinessId && this.socket?.connected) {
        this.leaveBusiness(activeBusinessId);
      }
      localStorage.removeItem("owner_business_id");
    } catch {
      /* noop */
    }
  }

  createOrder(orderData, callback) {
    if (!this.socket?.connected) {
      callback?.({ success: false, error: "Socket no conectado" });
      return;
    }
    this.socket.emit("order:create", orderData, callback);
  }

  updateOrderStatus(orderId, status, callback) {
    if (!this.socket?.connected) {
      callback?.({ success: false, error: "Socket no conectado" });
      return;
    }
    this.socket.emit("order:update_status", { orderId, status }, callback);
  }

  onNewOrder(callback) {
    const eventName = "order:new";
    const handler = (data) => {
      callback?.({ type: "order:new", tag: `order-new`, data });
    };
    this.socket.on(eventName, handler);
    this.listeners.set(eventName, handler);
  }

  offNewOrder() {
    this.off("order:new");
  }

  onOrderStatusUpdate(callback) {
    const eventName = "order:status_update";
    const handler = (data) => {
      callback?.({
        type: "order:status_update",
        tag: `order-status-${data.orderId}`,
        data,
      });
    };
    this.socket.on(eventName, handler);
    this.listeners.set(eventName, handler);
  }

  offOrderStatusUpdate() {
    this.off("order:status_update");
  }

  on(event, callback) {
    if (!this.socket) {
      warn("⚠️ Socket no inicializado");
      return;
    }

    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }

    this.eventHandlers.get(event).push(callback);
    this.socket.on(event, callback);
  }

  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);

        if (this.eventHandlers.has(event)) {
          const handlers = this.eventHandlers.get(event);
          const index = handlers.indexOf(callback);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      } else {
        this.socket.off(event);
        this.eventHandlers.delete(event);
      }

      this.listeners.delete(event);
    }
  }

  emitToServer(event, data, callback) {
    if (this.socket?.connected) {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
    } else {
      warn("⚠️ Socket no conectado, no se puede emitir evento:", event);
    }
  }

  notifyListeners(event, data) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          logError(`Error en listener de ${event}:`, error);
        }
      });
    }
  }

  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      log("ℹ️ Este navegador no soporta notificaciones");
      return false;
    }

    if (Notification.permission === "granted") {
      log("✅ Permisos de notificación ya concedidos");
      return true;
    }

    if (Notification.permission === "denied") {
      log("❌ Permisos de notificación denegados");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";
      log(granted ? "✅ Permisos concedidos" : "⚠️ Permisos no concedidos");
      return granted;
    } catch (error) {
      logError("❌ Error al solicitar permisos de notificación:", error);
      return false;
    }
  }

  showNotification(title, options = {}) {
    if (Notification.permission !== "granted") {
      return;
    }

    try {
      const notification = new Notification(title, {
        icon: "/pwa-192x192.png",
        badge: "/pwa-192x192.png",
        ...options,
      });

      setTimeout(() => notification.close(), 5000);

      notification.onclick = () => {
        window.focus();
        notification.close();
        if (options.onClick) {
          options.onClick(options.data);
        }
      };

      return notification;
    } catch (error) {
      logError("❌ Error mostrando notificación:", error);
    }
  }
}

const socketService = new SocketService();
export default socketService;
