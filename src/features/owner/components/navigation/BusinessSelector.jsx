import { useState } from "react";
import PropTypes from "prop-types";
import {
  Avatar,
  Badge,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
} from "@mui/material";
import { ArrowDropDownTwoTone } from "@mui/icons-material";
import { useNotifications } from "@Features/notifications/context/NotificationContext";
import { API_URL_MEDIA_SERVER } from "@Shared/config/env";

const resolveMediaUrl = (value = "") => {
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `${API_URL_MEDIA_SERVER.replace(/\/$/, "")}/${String(value).replace(/^\/+/, "")}`;
};

const BusinessSelector = ({ businessName, businesses, selectedBusinessId, onSelect }) => {
  const [anchorEl, setAnchorEl] = useState(null);
  const { unreadByBusiness, markBusinessAsRead } = useNotifications();

  const selectBusiness = (businessId) => {
    onSelect(businessId);
    markBusinessAsRead(businessId);
    setAnchorEl(null);
  };

  return (
    <>
      <Stack direction="row" alignItems="center">
        <Typography
          variant="subtitle2"
          sx={{ fontWeight: 600, color: "rgba(255, 75, 69, 1)", fontSize: "0.7rem" }}
        >
          {businessName}
        </Typography>
        {businesses.length > 1 && (
          <IconButton
            size="small"
            aria-label="Cambiar negocio"
            onClick={(event) => setAnchorEl(event.currentTarget)}
          >
            <ArrowDropDownTwoTone fontSize="medium" />
          </IconButton>
        )}
      </Stack>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => setAnchorEl(null)}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        PaperProps={{ sx: { minWidth: 260, maxHeight: 320, mt: 1, borderRadius: "10px" } }}
      >
        {businesses.map((business) => {
          const selected = String(business.id) === String(selectedBusinessId);
          const unread = unreadByBusiness[String(business.id)] || 0;
          return (
            <MenuItem
              key={business.id ?? business.name}
              selected={selected}
              onClick={() => selectBusiness(business.id)}
            >
              <ListItemIcon>
                <Badge badgeContent={unread} color="error" max={99} overlap="circular">
                  <Avatar
                    variant="rounded"
                    src={resolveMediaUrl(business.logo)}
                    alt={business.name || "Negocio"}
                    sx={{ width: 32, height: 32 }}
                  >
                    {business.name?.charAt(0)}
                  </Avatar>
                </Badge>
              </ListItemIcon>
              <ListItemText
                primary={business.name || "Negocio"}
                secondary={selected
                  ? "Negocio activo"
                  : unread ? `${unread} sin leer` : undefined}
              />
            </MenuItem>
          );
        })}
      </Menu>
    </>
  );
};

BusinessSelector.propTypes = {
  businessName: PropTypes.string.isRequired,
  businesses: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    name: PropTypes.string,
    logo: PropTypes.string,
  })).isRequired,
  selectedBusinessId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  onSelect: PropTypes.func.isRequired,
};

export default BusinessSelector;
