// src/services/socketService.js
import { io } from "socket.io-client";
import { API_URL_SERVER } from "@Utils/enviroments";

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
  }

  // ============================================================================
  // CONNECTION MANAGEMENT
  // ============================================================================

  /**
   * Connect to socket server
   * @param {Object} user - User object with token
   * @returns {Socket} Socket instance
   */
  connect(user) {
    if (!user || !user.token) {
      console.error("❌ No se puede conectar sin usuario o token");
      return null;
    }

    // If already connected with same user, return existing socket
    if (this.socket?.connected && this.currentUser?.id === user.id) {
      console.log("✅ Socket ya conectado para este usuario");
      return this.socket;
    }

    // Disconnect existing connection if different user
    if (this.socket && this.currentUser?.id !== user.id) {
      console.log("🔄 Cambiando usuario, desconectando socket anterior");
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

    console.log("🔌 Iniciando conexión Socket.IO...");
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
      console.log("Usuario: ",this.currentUser)
      console.log("✅ Socket.IO conectado:", this.socket.id);

      // Auto-join rooms based on user role
      this.autoJoinRooms();

      // Notify listeners - USAR notifyListeners en lugar de emit
      this.notifyListeners("connected", { socketId: this.socket.id });
    });

    // Disconnection
    this.socket.on("disconnect", (reason) => {
      this.connected = false;
      console.log("❌ Socket.IO desconectado:", reason);

      // Notify listeners
      this.notifyListeners("disconnected", { reason });

      // Handle different disconnect reasons
      if (reason === "io server disconnect") {
        // Server forcefully disconnected, don't reconnect automatically
        console.warn("⚠️ Servidor cerró la conexión");
      } else if (reason === "transport close" || reason === "ping timeout") {
        // Connection lost, will try to reconnect
        console.log("🔄 Pérdida de conexión, intentando reconectar...");
      }
    });

    // Connection error
    this.socket.on("connect_error", (error) => {
      console.error("❌ Error de conexión Socket.IO:", error.message);
      this.reconnectAttempts++;

      // Notify listeners
      this.notifyListeners("connection_error", {
        error: error.message,
        attempts: this.reconnectAttempts,
      });

      // Check if max attempts reached
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error("❌ Máximo de intentos de reconexión alcanzado");
        this.disconnect();
        this.notifyListeners("max_reconnect_attempts_reached");
      }
    });

    // Reconnection attempt
    this.socket.on("reconnect_attempt", (attemptNumber) => {
      console.log(`🔄 Intento de reconexión #${attemptNumber}`);
      this.notifyListeners("reconnect_attempt", { attemptNumber });
    });

    // Reconnection successful
    this.socket.on("reconnect", (attemptNumber) => {
      console.log("🎉 Socket.IO reconectado (intento:", attemptNumber, ")");
      this.reconnectAttempts = 0;
      this.notifyListeners("reconnected", { attemptNumber });

      // Re-join rooms after reconnection
      this.autoJoinRooms();
    });

    // Reconnection failed
    this.socket.on("reconnect_failed", () => {
      console.error("❌ Falló la reconexión después de todos los intentos");
      this.notifyListeners("reconnect_failed");
    });

    // Authentication error
    this.socket.on("auth_error", (error) => {
      console.error("❌ Error de autenticación:", error);
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
      // Join business room for owners/admins
      const businessIdToJoin = localStorage.getItem("owner_business_id");
      if (businessIdToJoin) {
        this.joinBusiness(businessIdToJoin);
      }
    } else if (role === "customer" || role === "user") {
      // Join user room for customers
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
      console.log("👋 Socket.IO desconectado manualmente");
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

  // ============================================================================
  // ROOM MANAGEMENT
  // ============================================================================

  /**
   * Join business room (for owners/admins)
   * @param {string} businessId
   */
  joinBusiness(businessId) {
    
    if (!this.socket?.connected) {
      console.warn("⚠️ Socket no conectado, no se puede unir a sala");
      return;
    }

    if (!businessId) {
      console.error("❌ businessId requerido para unirse a sala");
      return;
    }
    
    console.log("📤 Emitiendo join:business con ID:", businessId);
    
    this.socket.emit("join:business", businessId, (response) => {
      if (response?.success) {
        console.log("✅ Unido a sala business:", businessId);
      } else {
        console.error("❌ Error al unirse a sala business:", response?.error);
      }
    });
  }

  /**
   * Join user room (for customers)
   * @param {string} userId
   */
  joinUser(userId) {
    if (!this.socket?.connected) {
      console.warn("⚠️ Socket no conectado, no se puede unir a sala");
      return;
    }

    if (!userId) {
      console.error("❌ userId requerido para unirse a sala");
      return;
    }

    console.log("📤 Emitiendo join:user con ID:", userId);

    this.socket.emit("join:user", userId, (response) => {
      if (response?.success) {
        console.log("✅ Unido a sala user:", userId);
      } else {
        console.error("❌ Error al unirse a sala user:", response?.error);
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
      console.log("👋 Saliendo de sala:", room);
    }
  }

  // ============================================================================
  // ORDER MANAGEMENT
  // ============================================================================

  /**
   * Create new order
   * @param {Object} orderData
   * @param {Function} callback
   */
  createOrder(orderData, callback) {
    if (!this.socket?.connected) {
      callback?.({ success: false, error: "Socket no conectado" });
      return;
    }

    this.socket.emit("order:create", orderData, callback);
  }

  /**
   * Update order status
   * @param {string} orderId
   * @param {string} status
   * @param {Function} callback
   */
  updateOrderStatus(orderId, status, callback) {
    if (!this.socket?.connected) {
      callback?.({ success: false, error: "Socket no conectado" });
      return;
    }

    this.socket.emit(
      "order:update_status",
      { orderId, status },
      callback
    );
  }

  /**
   * Listen to new orders (for business)
   * @param {Function} callback
   */
  onNewOrder(callback) {
    const eventName = "order:new";

    const handler = (data) => {
      callback?.({
        type: "order:new",
        tag: `order-new`,
        data: data,
      });
    };

    this.socket.on(eventName, handler);
    this.listeners.set(eventName, handler);
  }

  /**
   * Remove new order listener
   */
  offNewOrder() {
    this.off("order:new");
  }

  /**
   * Listen to order status updates
   * @param {Function} callback
   */
  onOrderStatusUpdate(callback) {
    const eventName = "order:status_update";

    const handler = (data) => {
      callback?.({
        type: "order:status_update",
        tag: `order-status-${data.orderId}`,
        data: data,
      });
    };

    this.socket.on(eventName, handler);
    this.listeners.set(eventName, handler);
  }

  /**
   * Remove order status update listener
   */
  offOrderStatusUpdate() {
    this.off("order:status_update");
  }

  // ============================================================================
  // GENERIC EVENT MANAGEMENT
  // ============================================================================

  /**
   * Listen to custom socket event
   * @param {string} event
   * @param {Function} callback
   */
  on(event, callback) {
    if (!this.socket) {
      console.warn("⚠️ Socket no inicializado");
      return;
    }

    // Store in event handlers for custom events
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }

    this.eventHandlers.get(event).push(callback);
    this.socket.on(event, callback);
  }

  /**
   * Remove listener for specific event
   * @param {string} event
   * @param {Function} callback - Optional specific callback to remove
   */
  off(event, callback) {
    if (this.socket) {
      if (callback) {
        this.socket.off(event, callback);

        // Remove from eventHandlers
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

  /**
   * Emit event to socket server (for Socket.IO events)
   * @param {string} event
   * @param {*} data
   * @param {Function} callback - Optional acknowledgment callback
   */
  emitToServer(event, data, callback) {
    if (this.socket?.connected) {
      if (callback) {
        this.socket.emit(event, data, callback);
      } else {
        this.socket.emit(event, data);
      }
    } else {
      console.warn("⚠️ Socket no conectado, no se puede emitir evento:", event);
    }
  }

  /**
   * Notify internal listeners (for internal events)
   * @param {string} event
   * @param {*} data
   */
  notifyListeners(event, data) {
    if (this.eventHandlers.has(event)) {
      const handlers = this.eventHandlers.get(event);
      handlers.forEach((handler) => {
        try {
          handler(data);
        } catch (error) {
          console.error(`Error en listener de ${event}:`, error);
        }
      });
    }
  }

  // ============================================================================
  // NOTIFICATION MANAGEMENT
  // ============================================================================

  /**
   * Request notification permission
   * @returns {Promise<boolean>}
   */
  async requestNotificationPermission() {
    if (!("Notification" in window)) {
      console.log("ℹ️ Este navegador no soporta notificaciones");
      return false;
    }

    if (Notification.permission === "granted") {
      console.log("✅ Permisos de notificación ya concedidos");
      return true;
    }

    if (Notification.permission === "denied") {
      console.log("❌ Permisos de notificación denegados");
      return false;
    }

    try {
      const permission = await Notification.requestPermission();
      const granted = permission === "granted";

      if (granted) {
        console.log("✅ Permisos de notificación concedidos");
      } else {
        console.log("⚠️ Permisos de notificación no concedidos");
      }

      return granted;
    } catch (error) {
      console.error("❌ Error al solicitar permisos de notificación:", error);
      return false;
    }
  }

  /**
   * Show browser notification
   * @param {string} title
   * @param {Object} options
   */
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

      // Auto-close after 5 seconds
      setTimeout(() => notification.close(), 5000);

      // Handle notification click
      notification.onclick = () => {
        window.focus();
        notification.close();

        // Custom click handler if provided
        if (options.onClick) {
          options.onClick(options.data);
        }
      };

      return notification;
    } catch (error) {
      console.error("❌ Error al mostrar notificación:", error);
      return null;
    }
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  /**
   * Get connection status info
   * @returns {Object}
   */
  getStatus() {
    return {
      connected: this.connected,
      socketId: this.getSocketId(),
      reconnectAttempts: this.reconnectAttempts,
      currentUser: this.currentUser
        ? {
            id: this.currentUser.id,
            role: this.currentUser.role,
          }
        : null,
    };
  }

  /**
   * Reconnect manually
   */
  reconnect() {
    if (this.socket) {
      console.log("🔄 Reconexión manual iniciada");
      this.socket.connect();
    } else if (this.currentUser) {
      console.log("🔄 Creando nueva conexión");
      this.connect(this.currentUser);
    } else {
      console.error("❌ No se puede reconectar sin usuario");
    }
  }

  /**
   * Clear all listeners
   */
  clearAllListeners() {
    this.listeners.clear();
    this.eventHandlers.clear();

    if (this.socket) {
      this.socket.removeAllListeners();
    }

    console.log("🧹 Todos los listeners eliminados");
  }
}

// ============================================================================
// SINGLETON INSTANCE
// ============================================================================

export const socketService = new SocketService();

// ============================================================================
// REACT HOOK
// ============================================================================

import { useEffect, useState } from "react";
import { useAuth } from "@Context/AuthContext";

/**
 * React hook for using socket service
 * @param {Object} options - Configuration options
 * @returns {Object} Socket service and status
 */
export const useSocket = (options = {}) => {
  const { autoConnect = true, autoRequestPermission = true } = options;

  const { user, isAuthenticated } = useAuth();
  const [connected, setConnected] = useState(socketService.isConnected());
  const [socketId, setSocketId] = useState(socketService.getSocketId());

  useEffect(() => {
    // Connect when authenticated
    
    if (autoConnect && isAuthenticated && user) {
      socketService.connect(user);

      // Request notification permission
      if (autoRequestPermission) {
        socketService.requestNotificationPermission();
      }
    }

    // Setup status listeners
    const handleConnected = (data) => {
      setConnected(true);
      setSocketId(data.socketId);
    };

    const handleDisconnected = () => {
      setConnected(false);
      setSocketId(null);
    };

    socketService.on("connected", handleConnected);
    socketService.on("disconnected", handleDisconnected);

    // Cleanup: Remove listeners but don't disconnect
    // Socket stays active across component unmounts
    return () => {
      socketService.off("connected", handleConnected);
      socketService.off("disconnected", handleDisconnected);
    };
  }, [isAuthenticated, user, autoConnect, autoRequestPermission]);

  return {
    socket: socketService,
    connected,
    socketId,
    isConnected: connected,
  };
};

window.socketService = socketService;
console.log("🔧 socketService disponible en window.socketService");

export default socketService;