import { createContext, useCallback, useContext, useMemo, useState } from "react";

const NotificationContext = createContext(null);

const getBusinessId = (notification) =>
  notification?.businessId ?? notification?.business_id ?? notification?.business?.id ?? null;

const getOrderId = (notification) => notification?.orderId ?? notification?.id ?? null;

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([]);

  const addOrderNotification = useCallback((order) => {
    const businessId = getBusinessId(order);
    const orderId = getOrderId(order);
    const businessName =
      order?.businessName || order?.business_name || order?.business?.name || "Negocio";
    const customerName = order?.customerName || order?.customer_name || "Un cliente";

    const notification = {
      id: `${businessId ?? "business"}:${orderId ?? Date.now()}:${Date.now()}`,
      type: "order:new",
      businessId,
      orderId,
      businessName,
      title: `Nueva orden · ${businessName}`,
      message: `${customerName} acaba de realizar un pedido.`,
      createdAt: new Date().toISOString(),
      read: false,
    };

    setNotifications((current) => [notification, ...current].slice(0, 100));
    return notification;
  }, []);

  const markAsRead = useCallback((notificationId) => {
    setNotifications((current) =>
      current.map((item) =>
        item.id === notificationId ? { ...item, read: true } : item,
      ),
    );
  }, []);

  const markBusinessAsRead = useCallback((businessId) => {
    setNotifications((current) =>
      current.map((item) =>
        String(item.businessId) === String(businessId)
          ? { ...item, read: true }
          : item,
      ),
    );
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((current) => current.map((item) => ({ ...item, read: true })));
  }, []);

  const clearNotifications = useCallback(() => setNotifications([]), []);

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !item.read),
    [notifications],
  );

  const unreadByBusiness = useMemo(
    () =>
      unreadNotifications.reduce((accumulator, item) => {
        if (item.businessId == null) return accumulator;
        const key = String(item.businessId);
        accumulator[key] = (accumulator[key] || 0) + 1;
        return accumulator;
      }, {}),
    [unreadNotifications],
  );

  const value = useMemo(
    () => ({
      notifications,
      unreadNotifications,
      unreadCount: unreadNotifications.length,
      unreadByBusiness,
      addOrderNotification,
      markAsRead,
      markBusinessAsRead,
      markAllAsRead,
      clearNotifications,
    }),
    [
      notifications,
      unreadNotifications,
      unreadByBusiness,
      addOrderNotification,
      markAsRead,
      markBusinessAsRead,
      markAllAsRead,
      clearNotifications,
    ],
  );

  return <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>;
}

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return context;
};

export default NotificationContext;
