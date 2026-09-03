import { useState } from "react";
import PropTypes from "prop-types";
import { Badge, IconButton } from "@mui/material";
import { Notifications } from "@mui/icons-material";
import NotificationMenu from "@Features/notifications/components/NotificationMenu";
import { useNotifications } from "@Features/notifications/context/NotificationContext";

const DashboardNotifications = ({ onNavigate }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
  } = useNotifications();

  const selectNotification = (notification) => {
    markAsRead(notification.id);
    onNavigate?.({
      businessId: notification.businessId,
      orderId: notification.orderId,
    });
    setAnchorEl(null);
  };

  return (
    <>
      <IconButton
        onClick={(event) => setAnchorEl(event.currentTarget)}
        aria-label="Notificaciones"
      >
        <Badge badgeContent={unreadCount} color="error" max={99}>
          <Notifications />
        </Badge>
      </IconButton>
      <NotificationMenu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        notifications={notifications}
        onSelect={selectNotification}
        onMarkAllRead={markAllAsRead}
      />
    </>
  );
};

DashboardNotifications.propTypes = {
  onNavigate: PropTypes.func,
};

export default DashboardNotifications;
