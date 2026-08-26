// src/services/socketService.js
import { io } from "socket.io-client";
import { API_URL_SERVER } from "@Utils/enviroments";

// ============================================================================
// LOGGING (silenciado en producción)
// ============================================================================

const DEV = import.meta.env?.DEV ?? false;
const log = (...a) => DEV && console.log(...a);
const warn = (...a) => DEV && console.warn(...a);
const logError = (...a) => DEV && console.error(...a);

// ============================================================================
// CONSTANTS
// ============================================================================

const SOCKET_CONFIG = {
  transports: ["websocket", "polling"],
  reconnection: true,
  reconnectionDelay: 1000,
  reconnectionDelayMax: 5000,
  reconnectionAttempts: 10,
  timeout: 20000,
  autoConnect: false, // Conectar manualmente para mejor control
};

const RECONNECT_STRATEGIES = {
  EXPONENTIAL: "exponential",
  LINEAR: "linear",
};

// ============================================================================
// SOCKET SERVICE CLASS
// ============================================================================

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 10;
    this.currentUser = null;
    this.reconnectStrategy = RECONNECT_STRATEGIES.EXPONENTIAL;

    // Event handlers registry
    this.eventHandlers = new Map();

    // Suscriptores del estado de conexión (para useSyncExternalStore)
    this._statusListeners = new Set();
  }

  // ==========================================================================
  // REACTIVE STATUS STORE (para React vía useSyncExternalStore)
  // ==========================================================================

  /**
   * Suscribe un listener a los cambios de estado de conexión.
   * Devuelve la función de limpieza (unsubscribe). Referencia estable.
   * @param {Function} listener
   * @returns {Function} unsubscribe
   */
  subscribeStatus = (listener) => {
    this._statusListeners.add(listener);
    return () => this._statusListeners.delete(listener);
  };

  /**
   * Snapshot del estado de conexión. Devuelve un primitivo (boolean),
   * por lo que es seguro para useSyncExternalStore.
   * @returns {boolean}
   */
  getStatusSnapshot = () => this.connected;

  /**
   * Notifica a los suscriptores que el estado de conexión cambió.
   */
  _emitStatus = () => {
    this._statusListeners.forEach((listener) => {
      try {
        listener();
      } catch (error) {
        logError("Error en status listener:", error);
      }
    });
  };

  // ==========================================================================
  // CONNECTION MANAGEMENT
  // ==========================================================================

  /**
   * Connect to socket server
   * @param {Object} user - User object with token
   * @returns {Socket} Socket instance
   */
  connect(user) {
    if (!user || !user.token) {
      logError("❌ No se puede conectar sin usuario o token");
      return null;
    }

    // If already connected with same user, return existing socket
    if (this.socket?.connected && this.currentUser?.id === user.id) {
      log("✅ Socket ya conectado para este usuario");
      return this.socket;
    }

    // Disconnect existing connection if different user
    if (this.socket && this.currentUser?.id !== user.id) {
      log("🔄 Cambiando usuario, desconectando socket anterior");
      this.disconnect();
    }

    this.currentUser = user;

    // Create new socket connection
    this.socket = io(API_URL_SERVER, {
      ...SOCKET_CONFIG,
      auth: {
        token: user.token,
        userId: user.id,
        role: user.role,
      },
    });

    this.setupEventHandlers();
    this.socket.connect();

    log("🔌 Iniciando conexión Socket.IO...");
    return this.socket;
  }

  /**
   * Setup all socket event handlers
   */
  setupEventHandlers() {
    if (!this.socket) return;

    // Connection successful
    this.socket.on("connect", () => {
      this.connected = true;
      this.reconnectAttempts = 0;
      this._emitStatus(); // ⟵ avisa a React que ya hay conexión
      log("✅ Socket.IO conectado:", this.socket.id);

      // Auto-join rooms based on user role
      this.autoJoinRooms();

      // Notify listeners
      this.notifyListeners("connected", { socketId: this.socket.id });
    });

    // Disconnection
    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      this._emitStatus(); // ⟵ avisa a React que se perdió la conexión
      log("❌ Socket.IO desconectado:", reason);

      // Notify listeners
      this.notifyListeners("disconnected", { reason });

      // Handle different disconnect reasons
      if (reason === "io server disconnect") {
        warn("⚠️ Servidor cerró la conexión");
      } else if (reason === "transport close" || reason === "ping timeout") {
        log("🔄 Pérdida de conexión, intentando reconectar...");
      }
    });

    // Connection error
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

    // Reconnection attempt
    this.socket.on("reconnect_attempt", (attemptNumber) => {
      log(`🔄 Intento de reconexión #${attemptNumber}`);
      this.notifyListeners("reconnect_attempt", { attemptNumber });
    });

    // Reconnection successful
    this.socket.on("reconnect", (attemptNumber) => {
      log("🎉 Socket.IO reconectado (intento:", attemptNumber, ")");
      this.reconnectAttempts = 0;
      this.notifyListeners("reconnected", { attemptNumber });

      // Re-join rooms after reconnection
      this.autoJoinRooms();
    });

    // Reconnection failed
    this.socket.on("reconnect_failed", () => {
      logError("❌ Falló la reconexión después de todos los intentos");
      this.notifyListeners("reconnect_failed");
    });

    // Authentication error
    this.socket.on("auth_error", (error) => {
      logError("❌ Error de autenticación:", error);
      this.notifyListeners("auth_error", error);
      this.disconnect();
    });
  }

  /**
   * Auto-join rooms based on user role
   */
  autoJoinRooms() {
    if (!this.currentUser) return;

    const { role, id } = this.currentUser;

    if (role === "owner" || role === "admin") {
      const businessIdToJoin = localStorage.getItem("owner_business_id");
      if (businessIdToJoin) {
        this.joinBusiness(businessIdToJoin);
      }
    } else if (role === "customer" || role === "user") {
      this.joinUser(id);
    }
  }

  /**
   * Disconnect from socket server
   */
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
      this.clearActiveBusiness(); // ⟵ no dejar el negocio persistido tras logout
      this._emitStatus(); // ⟵ avisa a React que ya no hay conexión
      log("👋 Socket.IO desconectado manualmente");
    }
  }

  /**
   * Check if socket is connected
   * @returns {boolean}
   */
  isConnected() {
    return this.socket?.connected || false;
  }

  /**
   * Get socket ID
   * @returns {string|null}
   */
  getSocketId() {
    return this.socket?.id || null;
  }

  // ==========================================================================
  // ROOM MANAGEMENT
  // ==========================================================================

  /**
   * Join business room (for owners/admins)
   * @param {string} businessId
   */
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

  /**
   * Join user room (for customers)
   * @param {string} userId
   */
  joinUser(userId) {
    if (!this.socket?.connected) {
      warn("⚠️ Socket no conectado, no se puede unir a sala");
      return;
    }

    if (!userId) {
      logError("❌ userId requerido para unirse a sala");
      return;
    }

    log("📤 Emitiendo join:user con ID:", userId);

    this.socket.emit("join:user", userId, (response) => {
      if (response?.success) {
        log("✅ Unido a sala user:", userId);
      } else {
        logError("❌ Error al unirse a sala user:", response?.error);
      }
    });
  }

  /**
   * Leave a room
   * @param {string} room
   */
  leaveRoom(room) {
    if (this.socket?.connected) {
      this.socket.emit("leave:room", room);
      log("👋 Saliendo de sala:", room);
    }
  }

  /**
   * Define el negocio activo del owner y lo persiste para que autoJoinRooms()
   * pueda re-unirse a la sala tras un reconnect o un reload (cuando el dashboard
   * aún no ha montado). Si ya hay conexión, se une de inmediato.
   *
   * Es la API que deben usar los componentes en lugar de tocar localStorage
   * directamente.
   * @param {string} businessId
   */
  setActiveBusiness(businessId) {
    if (!businessId) return;

    try {
      localStorage.setItem("owner_business_id", String(businessId));
    } catch (error) {
      logError("No se pudo persistir owner_business_id:", error);
    }

    if (this.socket?.connected) {
      this.joinBusiness(businessId);
    }
  }

  /**
   * Limpia el negocio activo persistido (al cerrar sesión / cambiar de usuario).
   */
  clearActiveBusiness() {
    try {
      localStorage.removeItem("owner_business_id");
    } catch {
      /* noop */
    }
  }

  // ==========================================================================
  // ORDER MANAGEMENT
  // ==========================================================================

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

  // ==========================================================================
  // GENERIC EVENT MANAGEMENT
  // ==========================================================================

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

  // ==========================================================================
  // NOTIFICATION MANAGEMENT
  // ==========================================================================

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
      logError("❌ Error al mostrar notificación:", error);
      return null;
    }
  }

  // ==========================================================================
  // UTILITY METHODS
  // ==========================================================================

  getStatus() {
    return {
      connected: this.connected,
      socketId: this.getSocketId(),
      reconnectAttempts: this.reconnectAttempts,
      currentUser: this.currentUser
        ? { id: this.currentUser.id, role: this.currentUser.role }
        : null,
    };
  }

  reconnect() {
    if (this.socket) {
      log("🔄 Reconexión manual iniciada");
      this.socket.connect();
    } else if (this.currentUser) {
      log("🔄 Creando nueva conexión");
      this.connect(this.currentUser);
    } else {
      logError("❌ No se puede reconectar sin usuario");
    }
  }

  clearAllListeners() {
    this.listeners.clear();
    this.eventHandlers.clear();

    if (this.socket) {
      this.socket.removeAllListeners();
    }

    log("🧹 Todos los listeners eliminados");
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const socketService = new SocketService();

export default socketService;