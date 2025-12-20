// src/services/socketService.js
import { io } from 'socket.io-client';
import { API_URL_SERVER } from '@Utils/enviroments';

class SocketService {
  constructor() {
    this.socket = null;
    this.connected = false;
    this.listeners = new Map();
  }

  connect(user) {
    if (this.socket?.connected) {
      console.log('✅ Socket ya conectado');
      return this.socket;
    }

    this.socket = io(API_URL_SERVER, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
      auth: {
        token: user?.token
      }
    });

    this.socket.on('connect', () => {
      this.connected = true;
      console.log('✅ Socket.IO conectado:', this.socket.id);

      // Auto-join salas según rol
      if (user?.role === 'owner') {
        // TODO: Obtener businessId del usuario
        const businessId = user.businessId || localStorage.getItem('owner_business_id');
        if (businessId) {
          this.joinBusiness(businessId);
        }
      } else {
        this.joinUser(user.id);
      }
    });

    this.socket.on('disconnect', (reason) => {
      this.connected = false;
      console.log('❌ Socket.IO desconectado:', reason);
    });

    this.socket.on('connect_error', (error) => {
      console.error('❌ Error de conexión Socket.IO:', error);
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('🔄 Socket.IO reconectado (intento:', attemptNumber, ')');
    });

    return this.socket;
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
      this.connected = false;
      this.listeners.clear();
      console.log('👋 Socket.IO desconectado manualmente');
    }
  }

  joinBusiness(businessId) {
    if (this.socket?.connected) {
      this.socket.emit('join:business', businessId);
      console.log('👤 Unido a sala business:', businessId);
    }
  }

  joinUser(userId) {
    if (this.socket?.connected) {
      this.socket.emit('join:user', userId);
      console.log('👤 Unido a sala user:', userId);
    }
  }

  // Escuchar nueva orden (para owners)
  onNewOrder(callback) {
    if (!this.socket) return;

    // Remover listener anterior si existe
    this.socket.off('order:new');
    
    this.socket.on('order:new', (orderData) => {
      console.log('📨 Nueva orden recibida:', orderData);
      callback(orderData);
      
      // Notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification('Nueva Orden 🛒', {
          body: `Orden #${orderData.id} - $${orderData.total.toFixed(2)}`,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `order-${orderData.id}`
        });
      }
    });

    this.listeners.set('order:new', callback);
  }

  // Escuchar actualización de estado (para clientes)
  onOrderStatusUpdate(callback) {
    if (!this.socket) return;

    // Remover listener anterior si existe
    this.socket.off('order:status_update');
    
    this.socket.on('order:status_update', (data) => {
      console.log('📨 Estado de orden actualizado:', data);
      callback(data);

      // Notificación del navegador
      if (Notification.permission === 'granted') {
        new Notification('Actualización de Orden', {
          body: `Orden #${data.orderId} - ${data.statusLabel}`,
          icon: '/pwa-192x192.png',
          badge: '/pwa-192x192.png',
          tag: `order-${data.orderId}`
        });
      }
    });

    this.listeners.set('order:status_update', callback);
  }

  // Remover listener específico
  off(event) {
    if (this.socket) {
      this.socket.off(event);
      this.listeners.delete(event);
    }
  }

  // Solicitar permisos de notificación
  async requestNotificationPermission() {
    if (!('Notification' in window)) {
      console.log('Este navegador no soporta notificaciones');
      return false;
    }

    if (Notification.permission === 'granted') {
      return true;
    }

    if (Notification.permission !== 'denied') {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }

    return false;
  }
}

// Exportar instancia única (Singleton)
export const socketService = new SocketService();

// Hook para usar en componentes React
import { useEffect } from 'react';
import { useAuth } from '@Context/AuthContext';

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated && user) {
      socketService.connect(user);
      socketService.requestNotificationPermission();
    }

    return () => {
      // No desconectar al desmontar, mantener conexión activa
    };
  }, [isAuthenticated, user]);

  return socketService;
};

export default socketService;