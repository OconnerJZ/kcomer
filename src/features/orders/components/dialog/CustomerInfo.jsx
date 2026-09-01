import { Box, Stack, Typography } from "@mui/material";
import { Person, Phone, Email, AccessTime } from "@mui/icons-material";
import { formatOrderDate } from "@Features/orders/model/orderFormatters";

const InfoField = ({ icon: Icon, label, value, isLink = false, href = "" }) => (
  <Box>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
      <Icon sx={{ fontSize: 16, color: "secondary.dark" }} />
      <Typography
        variant="caption"
        sx={{
          color: "text.secondary",
          textTransform: "uppercase",
          fontSize: "0.688rem",
          letterSpacing: "0.1em",
        }}
      >
        {label}
      </Typography>
    </Stack>
    <Typography variant="body1" sx={{ fontWeight: 500, pl: 3 }}>
      {isLink ? (
        <a
          href={href}
          style={{
            color: "inherit",
            textDecoration: "none",
            borderBottom: "1px solid currentColor",
          }}
        >
          {value}
        </a>
      ) : (
        value
      )}
    </Typography>
  </Box>
);

const CustomerInfo = ({ order }) => (
  <Box sx={{ border: "1px solid", borderColor: "divider", borderRadius: 3, p: { xs: 2, sm: 2.5 }, height: "100%", bgcolor: "rgba(255,255,255,.72)" }}>
    <Typography
      variant="overline"
      sx={{
        color: "text.secondary",
        letterSpacing: "0.15em",
        fontSize: "0.688rem",
        fontWeight: 600,
        display: "block",
        mb: 2,
      }}
    >
      Datos del Cliente
    </Typography>
    <Stack spacing={2.5}>
      <InfoField icon={Person} label="Nombre" value={order.customerName || "Cliente"} />
      {order.customerPhone && (
        <InfoField
          icon={Phone}
          label="Teléfono"
          value={order.customerPhone}
          isLink
          href={`tel:${order.customerPhone}`}
        />
      )}
      {order.customerEmail && (
        <InfoField
          icon={Email}
          label="Email"
          value={order.customerEmail}
          isLink
          href={`mailto:${order.customerEmail}`}
        />
      )}
      <InfoField
        icon={AccessTime}
        label="Fecha"
        value={formatOrderDate(order.createdAt, true)}
      />
    </Stack>
  </Box>
);

export default CustomerInfo;
