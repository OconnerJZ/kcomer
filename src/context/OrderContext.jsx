// src/context/OrdersContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const OrdersContext = createContext();

// Estados posibles de una orden
export const ORDER_STATUS = {
  PENDING: 'pending',           // Pendiente de aceptación
  ACCEPTED: 'accepted',         // Aceptada por el negocio
  PREPARING: 'preparing',       // En preparación
  READY: 'ready',              // Lista para recoger/entregar
  IN_DELIVERY: 'in_delivery',  // En camino (si es delivery)
  COMPLETED: 'completed',       // Completada
  CANCELLED: 'cancelled',       // Cancelada
};

export const STATUS_LABELS = {
  [ORDER_STATUS.PENDING]: 'Pendiente',
  [ORDER_STATUS.ACCEPTED]: 'Aceptada',
  [ORDER_STATUS.PREPARING]: 'Preparando',
  [ORDER_STATUS.READY]: 'Lista',
  [ORDER_STATUS.IN_DELIVERY]: 'En camino',
  [ORDER_STATUS.COMPLETED]: 'Completada',
  [ORDER_STATUS.CANCELLED]: 'Cancelada',
};

export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    // Cargar órdenes del localStorage
    const savedOrders = localStorage.getItem('qscome_orders');
    if (savedOrders) {
      try {
        setOrders(JSON.parse(savedOrders));
      } catch (error) {
        console.error('Error loading orders:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Guardar órdenes en localStorage
    localStorage.setItem('qscome_orders', JSON.stringify(orders));
  }, [orders]);

  const createOrder = (orderData) => {
    const newOrder = {
      id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
      ...orderData,
      status: ORDER_STATUS.PENDING,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      statusHistory: [
        {
          status: ORDER_STATUS.PENDING,
          timestamp: new Date().toISOString(),
          note: 'Orden creada',
        },
      ],
    };

    setOrders((prev) => [newOrder, ...prev]);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus, note = '') => {
    setOrders((prev) =>
      prev.map((order) => {
        if (order.id === orderId) {
          return {
            ...order,
            status: newStatus,
            updatedAt: new Date().toISOString(),
            statusHistory: [
              ...order.statusHistory,
              {
                status: newStatus,
                timestamp: new Date().toISOString(),
                note,
              },
            ],
          };
        }
        return order;
      })
    );
  };

  const getOrdersByUser = (userId) => {
    return orders.filter((order) => order.userId === userId);
  };

  const getOrdersByBusiness = (businessId) => {
    return orders.filter((order) => order.businessId === businessId);
  };

  const getOrdersByStatus = (status) => {
    return orders.filter((order) => order.status === status);
  };

  const cancelOrder = (orderId) => {
    updateOrderStatus(orderId, ORDER_STATUS.CANCELLED, 'Orden cancelada por el usuario');
  };

  const value = {
    orders,
    createOrder,
    updateOrderStatus,
    getOrdersByUser,
    getOrdersByBusiness,
    getOrdersByStatus,
    cancelOrder,
    ORDER_STATUS,
    STATUS_LABELS,
  };

  return <OrdersContext.Provider value={value}>{children}</OrdersContext.Provider>;
};

OrdersProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useOrders = () => {
  const context = useContext(OrdersContext);
  if (!context) {
    throw new Error('useOrders debe usarse dentro de OrdersProvider');
  }
  return context;
};

export default useOrders;