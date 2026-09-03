/* eslint-disable react-refresh/only-export-components -- El provider y su hook forman una API cohesiva. */
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react";
import PropTypes from "prop-types";
import {
  createOrderNotification,
  notificationReducer,
  selectUnreadByBusiness,
  selectUnreadNotifications,
} from "@Features/notifications/model/notifications";

const NotificationContext = createContext(null);

export function NotificationProvider({ children }) {
  const [notifications, dispatch] = useReducer(notificationReducer, []);

  const addOrderNotification = useCallback((order) => {
    const notification = createOrderNotification(order);
    dispatch({ type: "notification/added", payload: notification });
    return notification;
  }, []);

  const markAsRead = useCallback((notificationId) => {
    dispatch({ type: "notification/read", payload: notificationId });
  }, []);

  const markBusinessAsRead = useCallback((businessId) => {
    dispatch({ type: "notification/business-read", payload: businessId });
  }, []);

  const markAllAsRead = useCallback(() => {
    dispatch({ type: "notification/all-read" });
  }, []);

  const clearNotifications = useCallback(() => {
    dispatch({ type: "notification/cleared" });
  }, []);

  const unreadNotifications = useMemo(
    () => selectUnreadNotifications(notifications),
    [notifications],
  );
  const unreadByBusiness = useMemo(
    () => selectUnreadByBusiness(unreadNotifications),
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

NotificationProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotifications debe usarse dentro de NotificationProvider");
  }
  return context;
};

export default NotificationContext;
