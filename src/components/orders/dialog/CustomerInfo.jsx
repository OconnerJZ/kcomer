import { Box, Stack, Typography } from "@mui/material";
import { Person, Phone, Email, AccessTime } from "@mui/icons-material";
import { formatOrderDate } from "@Utils/formatters"; 

const InfoField = ({ icon: Icon, label, value, isLink = false, href = "" }) => (
  <Box>
    <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 0.5 }}>
      <Icon sx={{ fontSize: 16, color: "#666" }} />
      <Typography
        variant="caption"
        sx={{
          color: "#999",
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
            color: "#1a1a1a",
            textDecoration: "none",
            borderBottom: "1px solid #e0e0e0",
            transition: "border-color 0.2s",
          }}
          onMouseEnter={(e) => (e.target.style.borderColor = "#1a1a1a")}
          onMouseLeave={(e) => (e.target.style.borderColor = "#e0e0e0")}
        >
          {value}
        </a>
      ) : (
        value
      )}
    </Typography>
  </Box>
);

const CustomerInfo = ({ order }) => {
  return (
    <Box sx={{ border: "1px solid #e0e0e0", p: 2.5, height: "100%" }}>
      <Typography
        variant="overline"
        sx={{
          color: "#666",
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
        <InfoField icon={Person} label="Nombre" value={order.customerName} />
        <InfoField
          icon={Phone}
          label="Teléfono"
          value={order.customerPhone}
          isLink
          href={`tel:${order.customerPhone}`}
        />
        {order.customerEmail && (
          <InfoField icon={Email} label="Email" value={order.customerEmail} />
        )}
        <InfoField
          icon={AccessTime}
          label="Fecha"
          value={formatOrderDate(order.createdAt, true)}
        />
      </Stack>
    </Box>
  );
};

export default CustomerInfo;