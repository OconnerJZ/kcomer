// src/context/OrdersContext.jsx
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { orderAPI } from '@Services/apiService';

const OrdersContext = createContext();

export const ORDER_STATUS = {
  PENDING: 'pending',
  ACCEPTED: 'accepted',
  PREPARING: 'preparing',
  READY: 'ready',
  IN_DELIVERY: 'in_delivery',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
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
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Cargar órdenes al montar
  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      const response = await orderAPI.getAll();
      setOrders(response.data);
    } catch (err) {
      console.error('Error loading orders:', err);
      setError(err.message);
      // Fallback a localStorage si falla la API
      const savedOrders = localStorage.getItem('qscome_orders');
      if (savedOrders) {
        setOrders(JSON.parse(savedOrders));
      }
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      const response = await orderAPI.create({
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
      });

      const newOrder = response.data;
      setOrders((prev) => [newOrder, ...prev]);
      
      // Backup en localStorage
      localStorage.setItem('qscome_orders', JSON.stringify([newOrder, ...orders]));
      
      return newOrder;
    } catch (err) {
      console.error('Error creating order:', err);
      
      // Fallback: crear orden localmente
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
            note: 'Orden creada (offline)',
          },
        ],
      };
      
      setOrders((prev) => [newOrder, ...prev]);
      localStorage.setItem('qscome_orders', JSON.stringify([newOrder, ...orders]));
      
      return newOrder;
    } finally {
      setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, note = '') => {
    try {
      setLoading(true);
      await orderAPI.updateStatus(orderId, newStatus);
      
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
      
      // Backup en localStorage
      const updatedOrders = orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      );
      localStorage.setItem('qscome_orders', JSON.stringify(updatedOrders));
      
    } catch (err) {
      console.error('Error updating order status:', err);
      
      // Fallback: actualizar localmente
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
                  note: note || '(actualización offline)',
                },
              ],
            };
          }
          return order;
        })
      );
    } finally {
      setLoading(false);
    }
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
    loading,
    error,
    createOrder,
    updateOrderStatus,
    getOrdersByUser,
    getOrdersByBusiness,
    getOrdersByStatus,
    cancelOrder,
    loadOrders,
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