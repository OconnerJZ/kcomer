// src/context/OrderContext.jsx - VERSIÓN MEJORADA
import { createContext, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { orderAPI, handleApiError } from '@Services/apiService';
import { useAuth } from './AuthContext';

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
  const { user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.id) {
      loadUserOrders(user.id);
    }
  }, [user?.id]);

  const loadUserOrders = async (userId) => {
    try {
      setLoading(true);
      setError(null);
      const response = await orderAPI.getByUser(userId);
      
      if (response.data.success) {
        setOrders(response.data.data);
        // Guardar en localStorage como backup
        localStorage.setItem('qscome_orders', JSON.stringify(response.data.data));
      } else {
        console.error('Error loading orders:', response.data.message);
        setError(response.data.message);
      }
    } catch (err) {
      console.error('Error loading orders:', err);
      const errorData = handleApiError(err);
      setError(errorData.message);
      
      // Fallback a localStorage si falla la API
      const savedOrders = localStorage.getItem('qscome_orders');
      if (savedOrders) {
        try {
          setOrders(JSON.parse(savedOrders));
        } catch (parseError) {
          console.error('Error parsing saved orders:', parseError);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData) => {
    try {
      setLoading(true);
      setError(null);

      // Validar datos mínimos
      if (!orderData.businessId || !orderData.items || orderData.items.length === 0) {
        throw new Error('Datos de orden incompletos');
      }

      const payload = {
        userId: user.id,
        businessId: orderData.businessId,
        items: orderData.items,
        total: orderData.total,
        customerName: orderData.customerName || user.name,
        customerPhone: orderData.phoneNumber,
        deliveryAddress: orderData.deliveryAddress,
        notes: orderData.notes
      };

      const response = await orderAPI.create(payload);

      if (response.data.success) {
        const newOrder = response.data.data;
        setOrders((prev) => [newOrder, ...prev]);
        
        // Actualizar localStorage
        const updatedOrders = [newOrder, ...orders];
        localStorage.setItem('qscome_orders', JSON.stringify(updatedOrders));
        
        return newOrder;
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error creating order:', err);
      const errorData = handleApiError(err);
      setError(errorData.message);
      
      // Fallback: crear orden localmente
      const newOrder = {
        id: `order_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`,
        ...orderData,
        userId: user.id,
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
      setError(null);
      
      const response = await orderAPI.updateStatus(orderId, newStatus, note);
      
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((order) => {
            if (order.id === orderId) {
              return {
                ...order,
                status: newStatus,
                updatedAt: new Date().toISOString(),
                statusHistory: [
                  ...(order.statusHistory || []),
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
        
        // Actualizar localStorage
        const updatedOrders = orders.map((order) =>
          order.id === orderId ? { ...order, status: newStatus } : order
        );
        localStorage.setItem('qscome_orders', JSON.stringify(updatedOrders));
      } else {
        throw new Error(response.data.message);
      }
    } catch (err) {
      console.error('Error updating order status:', err);
      const errorData = handleApiError(err);
      setError(errorData.message);
      
      // Fallback: actualizar localmente
      setOrders((prev) =>
        prev.map((order) => {
          if (order.id === orderId) {
            return {
              ...order,
              status: newStatus,
              updatedAt: new Date().toISOString(),
              statusHistory: [
                ...(order.statusHistory || []),
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

  const loadOrders = async () => {
    if (user?.id) {
      await loadUserOrders(user.id);
    }
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