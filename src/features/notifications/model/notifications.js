const MAX_NOTIFICATIONS = 100;

const getBusinessId = (notification) =>
  notification?.businessId ?? notification?.business_id ?? notification?.business?.id ?? null;

const getOrderId = (notification) => notification?.orderId ?? notification?.id ?? null;

export const createOrderNotification = (order = {}, now = new Date()) => {
  const businessId = getBusinessId(order);
  const orderId = getOrderId(order);
  const businessName =
    order.businessName || order.business_name || order.business?.name || "Negocio";
  const customerName = order.customerName || order.customer_name || "Un cliente";
  const timestamp = now.getTime();

  return {
    id: `${businessId ?? "business"}:${orderId ?? timestamp}:${timestamp}`,
    type: "order:new",
    businessId,
    orderId,
    businessName,
    title: `Nueva orden · ${businessName}`,
    message: `${customerName} acaba de realizar un pedido.`,
    createdAt: now.toISOString(),
    read: false,
  };
};

const markNotificationAsRead = (notification, shouldMark) =>
  shouldMark && !notification.read ? { ...notification, read: true } : notification;

export const notificationReducer = (notifications, action) => {
  switch (action.type) {
    case "notification/added":
      return [action.payload, ...notifications].slice(0, MAX_NOTIFICATIONS);
    case "notification/read":
      return notifications.map((notification) =>
        markNotificationAsRead(notification, notification.id === action.payload),
      );
    case "notification/business-read":
      return notifications.map((notification) =>
        markNotificationAsRead(
          notification,
          String(notification.businessId) === String(action.payload),
        ),
      );
    case "notification/all-read":
      return notifications.map((notification) => markNotificationAsRead(notification, true));
    case "notification/cleared":
      return [];
    default:
      return notifications;
  }
};

export const selectUnreadNotifications = (notifications) =>
  notifications.filter((notification) => !notification.read);

export const selectUnreadByBusiness = (unreadNotifications) =>
  unreadNotifications.reduce((counts, notification) => {
    if (notification.businessId == null) return counts;

    const businessId = String(notification.businessId);
    counts[businessId] = (counts[businessId] || 0) + 1;
    return counts;
  }, {});

export { MAX_NOTIFICATIONS };
