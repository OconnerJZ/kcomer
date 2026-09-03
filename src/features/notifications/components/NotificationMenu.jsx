import {
  Box,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Typography,
} from "@mui/material";
import { AccessTime, DoneAll } from "@mui/icons-material";

const formatTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-MX", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

export default function NotificationMenu({
  anchorEl,
  open,
  onClose,
  notifications = [],
  onSelect,
  onMarkAllRead,
}) {
  return (
    <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={onClose}
      transformOrigin={{ horizontal: "right", vertical: "top" }}
      anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      PaperProps={{ sx: { width: { xs: 320, sm: 380 }, maxWidth: "calc(100vw - 24px)", maxHeight: 460, mt: 1, borderRadius: "8px" } }}
    >
      <Box sx={{ px: 2, py: 1.5, display: "flex", alignItems: "center", justifyContent: "space-between", gap: 1 }}>
        <Box>
          <Typography variant="subtitle1" fontWeight={700}>Notificaciones</Typography>
          <Typography variant="caption" color="text.secondary">Órdenes recientes de tus negocios</Typography>
        </Box>
        {notifications.some((item) => !item.read) && (
          <Button size="small" startIcon={<DoneAll />} onClick={onMarkAllRead}>
            Leer todas
          </Button>
        )}
      </Box>
      <Divider />

      {notifications.length === 0 ? (
        <Box sx={{ px: 2, py: 4, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">No tienes notificaciones nuevas.</Typography>
        </Box>
      ) : (
        notifications.map((notification) => (
          <MenuItem
            key={notification.id}
            onClick={() => onSelect(notification)}
            sx={{
              alignItems: "flex-start",
              py: 1.25,
              bgcolor: notification.read ? "transparent" : "action.hover",
              whiteSpace: "normal",
            }}
          >
            <ListItemText
              primary={notification.title}
              secondary={
                <>
                  <Typography component="span" variant="body2" color="text.secondary">
                    {notification.message}
                  </Typography>
                  <Box component="span" sx={{ mt: 0.5, display: "flex", alignItems: "center", gap: 0.5 }}>
                    <AccessTime sx={{ fontSize: 13 }} />
                    <Typography component="span" variant="caption" color="text.secondary">
                      {formatTime(notification.createdAt)}
                    </Typography>
                  </Box>
                </>
              }
              primaryTypographyProps={{ fontWeight: notification.read ? 500 : 700, fontSize: "0.9rem" }}
            />
          </MenuItem>
        ))
      )}
    </Menu>
  );
}
