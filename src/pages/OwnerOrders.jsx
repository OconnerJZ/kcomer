import { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Card,
  CardContent,
  Typography,
  Chip,
  Button,
  Dialog,
  DialogContent,
  FormControl,
  Select,
  MenuItem,
  Divider,
  IconButton,
  CircularProgress,
  Alert,
  Snackbar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useMediaQuery,
  useTheme,
  Grid,
  Fade,
} from "@mui/material";
import {
  Visibility,
  CheckCircle,
  Cancel,
  HourglassEmpty,
  Restaurant,
  LocalShipping,
  Refresh,
  Phone,
  LocationOn,
  AccessTime,
  Person,
  StickyNote2,
  Close,
  Email,
  CreditCard,
} from "@mui/icons-material";
import socketService from "@Services/socketService";
import { orderAPI, handleApiError } from "@Services/apiService";

const ORDER_STATUS = {
  pending: { label: "Pendiente", color: "warning", icon: HourglassEmpty },
  accepted: { label: "Aceptada", color: "info", icon: CheckCircle },
  preparing: { label: "Preparando", color: "primary", icon: Restaurant },
  ready: { label: "Lista", color: "success", icon: CheckCircle },
  in_delivery: { label: "En camino", color: "success", icon: LocalShipping },
  completed: { label: "Completada", color: "default", icon: CheckCircle },
  cancelled: { label: "Cancelada", color: "error", icon: Cancel },
};

const OwnerOrders = ({ businessId, orders: initialOrders, onRefresh }) => {
  const [orders, setOrders] = useState(initialOrders || []);
  const [loading, setLoading] = useState(false);
  const [filterStatus, setFilterStatus] = useState("all");
  const [orderDialog, setOrderDialog] = useState({ open: false, order: null });
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isSmall = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    if (initialOrders) {
      setOrders(initialOrders);
    }
  }, [initialOrders]);

  useEffect(() => {
    socketService.onNewOrder((newOrder) => {
      console.log("🔔 Nueva orden recibida:", newOrder);
      setOrders((prev) => [newOrder, ...prev]);
      if (onRefresh) {
        setTimeout(() => onRefresh(), 500);
      }
    });
  }, [onRefresh]);

  const loadOrders = async (silent = false) => {
    try {
      if (!silent) setLoading(true);
      const response = await orderAPI.getByBusiness(businessId);
      if (response.data.success) {
        setOrders(response.data.data);
      }
    } catch (error) {
      console.error("Error loading orders:", error);
      if (!silent) {
        const errorData = handleApiError(error);
        setSnackbar({
          open: true,
          message: errorData.message,
          severity: "error",
        });
      }
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      setLoading(true);
      const response = await orderAPI.updateStatus(orderId, newStatus);
      if (response.data.success) {
        setOrders((prev) =>
          prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
        );
        setSnackbar({
          open: true,
          message: `Orden actualizada a ${ORDER_STATUS[newStatus].label}`,
          severity: "success",
        });
        setOrderDialog({ open: false, order: null });
        if (onRefresh) onRefresh();
      }
    } catch (error) {
      console.error("Error updating order:", error);
      const errorData = handleApiError(error);
      setSnackbar({
        open: true,
        message: errorData.message,
        severity: "error",
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders =
    filterStatus === "all"
      ? orders
      : orders.filter((o) => o.status === filterStatus);

  const getNextStatus = (currentStatus) => {
    const flow = {
      pending: "accepted",
      accepted: "preparing",
      preparing: "ready",
      ready: "in_delivery",
      in_delivery: "completed",
    };
    return flow[currentStatus];
  };

  const getActionButton = (order) => {
    const nextStatus = getNextStatus(order.status);
    if (!nextStatus) return null;

    const labels = {
      accepted: "Aceptar",
      preparing: "Iniciar preparación",
      ready: "Marcar como lista",
      in_delivery: "En camino",
      completed: "Completar",
    };

    const statusColors = {
      pending: { bg: "#ed8936", hover: "#dd6b20" },
      accepted: { bg: "#3182ce", hover: "#2c5282" },
      preparing: { bg: "#805ad5", hover: "#6b46c1" },
      ready: { bg: "#38a169", hover: "#2f855a" },
      in_delivery: { bg: "#38a169", hover: "#2f855a" },
      completed: { bg: "#718096", hover: "#4a5568" },
    };

    const colors = statusColors[order.status] || {
      bg: "#1a1a1a",
      hover: "#2a2a2a",
    };

    return (
      <Button
        size="small"
        variant="contained"
        disableElevation
        fullWidth={isSmall}
        onClick={() => updateOrderStatus(order.id, nextStatus)}
        sx={{
          bgcolor: colors.bg,
          color: "white",
          textTransform: "none",
          fontWeight: 500,
          px: 2.5,
          py: 0.75,
          fontSize: "0.813rem",
          letterSpacing: "0.01em",
          "&:hover": {
            bgcolor: colors.hover,
          },
        }}
      >
        {labels[nextStatus]}
      </Button>
    );
  };

  if (loading && orders.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 5 }}>
        <CircularProgress sx={{ color: "#1a1a1a" }} />
      </Box>
    );
  }

  return (
    <Box>
      {/* Filtros - Diseño Minimalista */}
      <Paper
        elevation={0}
        sx={{
          p: 2,
          mb: 3,
          border: "1px solid #e0e0e0",
          borderRadius: 0,
        }}
      >
        <Stack
          direction="row"
          spacing={2}
          alignItems="center"
          justifyContent="space-between"
          flexWrap="wrap"
        >
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography
              variant="overline"
              sx={{
                color: "#666",
                fontWeight: 600,
                letterSpacing: "0.1em",
                fontSize: "0.688rem",
              }}
            >
              Filtrar
            </Typography>
            <FormControl size="small" sx={{ minWidth: 180 }}>
              <Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                sx={{
                  borderRadius: 0,
                  fontSize: "0.875rem",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#e0e0e0",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#1a1a1a",
                  },
                }}
              >
                <MenuItem value="all">Todas</MenuItem>
                <MenuItem value="pending">Pendientes</MenuItem>
                <MenuItem value="preparing">En preparación</MenuItem>
                <MenuItem value="ready">Listas</MenuItem>
                <MenuItem value="completed">Completadas</MenuItem>
              </Select>
            </FormControl>
            <Typography
              variant="caption"
              sx={{
                color: "#1a1a1a",
                fontWeight: 500,
                px: 1.5,
                py: 0.5,
              }}
            >
              {filteredOrders.length}
            </Typography>
          </Stack>

          <IconButton
            onClick={() => loadOrders()}
            disabled={loading}
            size="small"
            sx={{
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            <Refresh fontSize="small" />
          </IconButton>
        </Stack>
      </Paper>

      {filteredOrders.length === 0 && (
        <Paper
          elevation={0}
          sx={{
            p: 5,
            textAlign: "center",
            border: "1px solid #e0e0e0",
            borderRadius: 0,
          }}
        >
          <Restaurant sx={{ fontSize: 48, color: "#e0e0e0", mb: 2 }} />
          <Typography sx={{ color: "#666", mb: 1 }}>
            No tienes ordenes en tu negocio
          </Typography>
          <Typography variant="caption" sx={{ color: "#999" }}>
            Comparte <strong>qscome.com.mx</strong> con tus clientes
          </Typography>
        </Paper>
      )}
      {/* Vista Desktop: Tabla Minimalista */}
      {!isMobile && filteredOrders.length > 0 && (
        <TableContainer
          component={Paper}
          elevation={0}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 0,
          }}
        >
          <Table>
            <TableHead>
              <TableRow sx={{ borderBottom: "2px solid #1a1a1a" }}>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                    py: 2,
                  }}
                >
                  ID
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                  }}
                >
                  Cliente
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                  }}
                >
                  Items
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                  }}
                >
                  Total
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                  }}
                >
                  Estado
                </TableCell>
                <TableCell
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                  }}
                >
                  Fecha
                </TableCell>
                <TableCell
                  align="right"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.75rem",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                    color: "#666",
                  }}
                >
                  Acciones
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredOrders.map((order) => {
                const StatusIcon = ORDER_STATUS[order.status].icon;
                return (
                  <TableRow
                    key={order.id}
                    sx={{
                      borderBottom: "1px solid #f0f0f0",
                      "&:hover": {
                        bgcolor: "#fafafa",
                      },
                      transition: "background-color 0.15s ease",
                    }}
                  >
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontFamily: "monospace" }}
                      >
                        #{order.id}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 500, fontSize: "0.875rem" }}
                      >
                        {order.customerName}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ color: "#666", fontSize: "0.875rem" }}
                      >
                        {order.items.length}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "0.875rem" }}
                      >
                        ${order.total.toFixed(2)}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <Box
                        sx={{
                          display: "inline-flex",
                          alignItems: "center",
                          gap: 0.5,
                          px: 1,
                          py: 0.25,
                          border: `1px solid ${
                            ORDER_STATUS[order.status].color === "warning"
                              ? "#ed8936"
                              : ORDER_STATUS[order.status].color === "info"
                              ? "#3182ce"
                              : ORDER_STATUS[order.status].color === "primary"
                              ? "#805ad5"
                              : ORDER_STATUS[order.status].color === "success"
                              ? "#38a169"
                              : ORDER_STATUS[order.status].color === "error"
                              ? "#e53e3e"
                              : "#e0e0e0"
                          }`,
                          color:
                            ORDER_STATUS[order.status].color === "warning"
                              ? "#ed8936"
                              : ORDER_STATUS[order.status].color === "info"
                              ? "#3182ce"
                              : ORDER_STATUS[order.status].color === "primary"
                              ? "#805ad5"
                              : ORDER_STATUS[order.status].color === "success"
                              ? "#38a169"
                              : ORDER_STATUS[order.status].color === "error"
                              ? "#e53e3e"
                              : "#666",
                          fontSize: "0.75rem",
                          fontWeight: 500,
                        }}
                      >
                        <StatusIcon sx={{ fontSize: 15 }} />
                        {ORDER_STATUS[order.status].label}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Typography
                        variant="caption"
                        sx={{ color: "#999", fontSize: "0.75rem" }}
                      >
                        {new Date(order.createdAt).toLocaleDateString("es-MX", {
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <Stack
                        direction="row"
                        spacing={1}
                        justifyContent="flex-end"
                      >
                        <IconButton
                          size="small"
                          onClick={() => setOrderDialog({ open: true, order })}
                          sx={{
                            "&:hover": {
                              bgcolor: "rgba(0,0,0,0.04)",
                            },
                          }}
                        >
                          <Visibility sx={{ fontSize: 18 }} />
                        </IconButton>
                        {getActionButton(order)}
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Vista Mobile: Tarjetas Minimalistas */}
      {isMobile && (
        <>
          {filteredOrders.length === 0 ? (
            <Paper
              sx={{
                p: 5,
                textAlign: "center",
                border: "1px solid #e0e0e0",
                borderRadius: 0,
              }}
              elevation={0}
            >
              <Typography sx={{ color: "#666", fontSize: "0.875rem" }}>
                No hay órdenes{" "}
                {filterStatus !== "all"
                  ? `en estado "${ORDER_STATUS[filterStatus]?.label}"`
                  : ""}
              </Typography>
            </Paper>
          ) : (
            <Stack spacing={2}>
              {filteredOrders.map((order) => {
                const StatusIcon = ORDER_STATUS[order.status].icon;
                return (
                  <Card
                    key={order.id}
                    elevation={0}
                    sx={{
                      border: "1px solid #e0e0e0",
                      borderRadius: 0,
                      transition: "border-color 0.2s",
                      "&:hover": {
                        borderColor: "#1a1a1a41",
                      },
                    }}
                  >
                    <CardContent sx={{ p: 2.5 }}>
                      <Stack spacing={2}>
                        <Stack
                          direction="row"
                          justifyContent="space-between"
                          alignItems="start"
                        >
                          <Stack spacing={0.5}>
                            <Typography
                              variant="body2"
                              sx={{
                                fontFamily: "monospace",
                                fontWeight: 600,
                                fontSize: "0.875rem",
                              }}
                            >
                              #{order.id}
                            </Typography>
                            <Box
                              sx={{
                                display: "inline-flex",
                                alignItems: "center",
                                gap: 0.5,
                                px: 1,
                                py: 0.25,
                                border: `1px solid ${
                                  ORDER_STATUS[order.status].color === "warning"
                                    ? "#ed8936"
                                    : ORDER_STATUS[order.status].color ===
                                      "info"
                                    ? "#3182ce"
                                    : ORDER_STATUS[order.status].color ===
                                      "primary"
                                    ? "#805ad5"
                                    : ORDER_STATUS[order.status].color ===
                                      "success"
                                    ? "#38a169"
                                    : ORDER_STATUS[order.status].color ===
                                      "error"
                                    ? "#e53e3e"
                                    : "#e0e0e0"
                                }`,
                                color:
                                  ORDER_STATUS[order.status].color === "warning"
                                    ? "#ed8936"
                                    : ORDER_STATUS[order.status].color ===
                                      "info"
                                    ? "#3182ce"
                                    : ORDER_STATUS[order.status].color ===
                                      "primary"
                                    ? "#805ad5"
                                    : ORDER_STATUS[order.status].color ===
                                      "success"
                                    ? "#38a169"
                                    : ORDER_STATUS[order.status].color ===
                                      "error"
                                    ? "#e53e3e"
                                    : "#666",
                                fontSize: "0.75rem",
                                fontWeight: 500,
                                width: "fit-content",
                              }}
                            >
                              <StatusIcon
                                sx={{ fontSize: 14, color: "#38a169" }}
                              />
                              {ORDER_STATUS[order.status].label}
                            </Box>
                          </Stack>
                          <Typography
                            variant="h6"
                            sx={{ fontWeight: 600, fontSize: "1.125rem" }}
                          >
                            ${order.total.toFixed(2)}
                          </Typography>
                        </Stack>

                        <Divider sx={{ borderColor: "#f0f0f0" }} />

                        <Box>
                          <Typography
                            variant="body2"
                            sx={{ fontWeight: 500, mb: 0.5 }}
                          >
                            {order.customerName}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: "#999", display: "block" }}
                          >
                            {order.items.length} producto
                            {order.items.length !== 1 ? "s" : ""} •{" "}
                            {new Date(order.createdAt).toLocaleDateString(
                              "es-MX",
                              {
                                day: "2-digit",
                                month: "short",
                                hour: "2-digit",
                                minute: "2-digit",
                              }
                            )}
                          </Typography>
                        </Box>

                        <Stack direction="row" spacing={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() =>
                              setOrderDialog({ open: true, order })
                            }
                            sx={{
                              borderColor: "#e0e0e0",
                              color: "#1a1a1a",
                              textTransform: "none",
                              fontWeight: 500,
                              borderRadius: 0,
                              fontSize: "0.813rem",
                              "&:hover": {
                                borderColor: "#1a1a1a",
                                bgcolor: "transparent",
                              },
                            }}
                          >
                            Ver detalles
                          </Button>
                          {getActionButton(order)}
                        </Stack>
                      </Stack>
                    </CardContent>
                  </Card>
                );
              })}
            </Stack>
          )}
        </>
      )}

      {/* Dialog Minimalista con Grid Layout */}
      <Dialog
        open={orderDialog.open}
        onClose={() => setOrderDialog({ open: false, order: null })}
        maxWidth="lg"
        fullWidth
        fullScreen={isSmall}
        TransitionComponent={Fade}
        PaperProps={{
          elevation: 0,
          sx: {
            borderRadius: 0,
            border: "1px solid #e0e0e0",
          },
        }}
      >
        {orderDialog.order && (
          <>
            <DialogContent sx={{ p: 0 }}>
              {/* Header Minimalista */}
              <Box
                sx={{
                  p: 3,
                  borderBottom: "1px solid #e0e0e0",
                  bgcolor: "#fafafa",
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Box>
                    <Typography
                      variant="overline"
                      sx={{
                        color: "#666",
                        letterSpacing: "0.15em",
                        fontSize: "0.688rem",
                        fontWeight: 600,
                      }}
                    >
                      Orden
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{
                        fontWeight: 600,
                        fontFamily: "monospace",
                        mt: 0.5,
                      }}
                    >
                      #{orderDialog.order.id}
                    </Typography>
                  </Box>
                  <Stack direction="row" spacing={2} alignItems="center">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.75,
                        px: 1.5,
                        py: 0.75,
                        border: `1px solid ${
                          ORDER_STATUS[orderDialog.order.status].color ===
                          "warning"
                            ? "#ed8936"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "info"
                            ? "#3182ce"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "primary"
                            ? "#805ad5"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "success"
                            ? "#38a169"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "error"
                            ? "#e53e3e"
                            : "#1a1a1a"
                        }`,
                        color:
                          ORDER_STATUS[orderDialog.order.status].color ===
                          "warning"
                            ? "#ed8936"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "info"
                            ? "#3182ce"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "primary"
                            ? "#805ad5"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "success"
                            ? "#38a169"
                            : ORDER_STATUS[orderDialog.order.status].color ===
                              "error"
                            ? "#e53e3e"
                            : "#1a1a1a",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontWeight: 600, fontSize: "0.813rem" }}
                      >
                        {ORDER_STATUS[orderDialog.order.status].label}
                      </Typography>
                    </Box>
                    <IconButton
                      onClick={() =>
                        setOrderDialog({ open: false, order: null })
                      }
                      size="small"
                      sx={{
                        "&:hover": {
                          bgcolor: "rgba(0,0,0,0.04)",
                        },
                      }}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  </Stack>
                </Stack>
              </Box>

              {/* Grid Layout Principal */}
              <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                  {/* Columna Izquierda: Datos de Contacto */}
                  <Grid item xs={12} md={6}>
                    <Box
                      sx={{
                        border: "1px solid #e0e0e0",
                        p: 2.5,
                        height: "100%",
                      }}
                    >
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
                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <Person sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#999",
                                textTransform: "uppercase",
                                fontSize: "0.688rem",
                                letterSpacing: "0.1em",
                              }}
                            >
                              Nombre
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, pl: 3 }}
                          >
                            {orderDialog.order.customerName}
                          </Typography>
                        </Box>

                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <Phone sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#999",
                                textTransform: "uppercase",
                                fontSize: "0.688rem",
                                letterSpacing: "0.1em",
                              }}
                            >
                              Teléfono
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body1"
                            sx={{ pl: 3, fontWeight: 500 }}
                          >
                            <a
                              href={`tel:${orderDialog.order.customerPhone}`}
                              style={{
                                color: "#1a1a1a",
                                textDecoration: "none",
                                borderBottom: "1px solid #e0e0e0",
                                transition: "border-color 0.2s",
                              }}
                              onMouseEnter={(e) =>
                                (e.target.style.borderColor = "#1a1a1a")
                              }
                              onMouseLeave={(e) =>
                                (e.target.style.borderColor = "#e0e0e0")
                              }
                            >
                              {orderDialog.order.customerPhone}
                            </a>
                          </Typography>
                        </Box>

                        {orderDialog.order.customerEmail && (
                          <Box>
                            <Stack
                              direction="row"
                              spacing={1}
                              alignItems="center"
                              sx={{ mb: 0.5 }}
                            >
                              <Email sx={{ fontSize: 16, color: "#666" }} />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#999",
                                  textTransform: "uppercase",
                                  fontSize: "0.688rem",
                                  letterSpacing: "0.1em",
                                }}
                              >
                                Email
                              </Typography>
                            </Stack>
                            <Typography
                              variant="body1"
                              sx={{ pl: 3, fontWeight: 500 }}
                            >
                              {orderDialog.order.customerEmail}
                            </Typography>
                          </Box>
                        )}

                        <Box>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            sx={{ mb: 0.5 }}
                          >
                            <AccessTime sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#999",
                                textTransform: "uppercase",
                                fontSize: "0.688rem",
                                letterSpacing: "0.1em",
                              }}
                            >
                              Fecha
                            </Typography>
                          </Stack>
                          <Typography
                            variant="body1"
                            sx={{ pl: 3, fontWeight: 500 }}
                          >
                            {new Date(
                              orderDialog.order.createdAt
                            ).toLocaleDateString("es-MX", {
                              dateStyle: "full",
                            })}
                          </Typography>
                        </Box>
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Columna Derecha: Ubicación y Notas */}
                  <Grid item xs={12} md={6}>
                    <Stack spacing={2} sx={{ height: "100%" }}>
                      {/* Ubicación */}
                      <Box sx={{ border: "1px solid #e0e0e0", p: 2.5 }}>
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
                          Dirección de Entrega
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="start"
                          sx={{ mb: 0.5 }}
                        >
                          <LocationOn sx={{ fontSize: 16, color: "#666" }} />
                          <Typography
                            variant="body1"
                            sx={{ fontWeight: 500, lineHeight: 1.6 }}
                          >
                            {orderDialog.order.deliveryAddress}
                          </Typography>
                        </Stack>
                      </Box>

                      {/* Notas */}
                      {orderDialog.order.notes && (
                        <Box
                          sx={{
                            border: "1px solid #e0e0e0",
                            p: 2.5,
                            bgcolor: "#fafafa",
                          }}
                        >
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
                            Notas del Cliente
                          </Typography>
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="start"
                            sx={{ mb: 0.5 }}
                          >
                            <StickyNote2 sx={{ fontSize: 16, color: "#666" }} />
                            <Typography
                              variant="body2"
                              sx={{
                                fontStyle: "italic",
                                color: "#666",
                                lineHeight: 1.6,
                              }}
                            >
                              {orderDialog.order.notes}
                            </Typography>
                          </Stack>
                        </Box>
                      )}

                      {/* Método de Pago */}
                      <Box sx={{ border: "1px solid #e0e0e0", p: 2.5 }}>
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
                          Método de Pago
                        </Typography>
                        <Stack
                          direction="row"
                          spacing={1}
                          alignItems="center"
                          sx={{ mb: 0.5 }}
                        >
                          <CreditCard sx={{ fontSize: 16, color: "#666" }} />
                          <Typography variant="body1" sx={{ fontWeight: 500 }}>
                            {orderDialog.order.paymentMethod || "Efectivo"}
                          </Typography>
                        </Stack>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Productos - Full Width */}
                  <Grid item xs={12}>
                    <Box sx={{ border: "1px solid #e0e0e0", p: 2.5 }}>
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
                        Productos ({orderDialog.order.items.length})
                      </Typography>

                      <Stack spacing={1.5}>
                        {orderDialog.order.items.map((item, idx) => (
                          <Box
                            key={idx}
                            sx={{
                              display: "flex",
                              justifyContent: "space-between",
                              alignItems: "start",
                              py: 1.5,
                              borderBottom:
                                idx !== orderDialog.order.items.length - 1
                                  ? "1px solid #f0f0f0"
                                  : "none",
                            }}
                          >
                            <Box sx={{ flex: 1 }}>
                              <Stack
                                direction="row"
                                spacing={1.5}
                                alignItems="center"
                              >
                                <Typography
                                  variant="body2"
                                  sx={{
                                    fontFamily: "monospace",
                                    fontWeight: 600,
                                    color: "#666",
                                    minWidth: 20,
                                  }}
                                >
                                  {item.quantity}×
                                </Typography>
                                <Box>
                                  <Typography
                                    variant="body1"
                                    sx={{ fontWeight: 500 }}
                                  >
                                    {item.name}
                                  </Typography>
                                  {item.note && (
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        display: "block",
                                        color: "#999",
                                        fontStyle: "italic",
                                        mt: 0.25,
                                      }}
                                    >
                                      {item.note}
                                    </Typography>
                                  )}
                                </Box>
                              </Stack>
                            </Box>
                            <Typography
                              variant="body1"
                              sx={{ fontWeight: 600, fontFamily: "monospace" }}
                            >
                              ${(item.price * item.quantity).toFixed(2)}
                            </Typography>
                          </Box>
                        ))}
                      </Stack>
                    </Box>
                  </Grid>

                  {/* Total */}
                  <Grid item xs={12}>
                    <Box
                      sx={{
                        border: "1px solid #1a1a1a",
                        p: { xs: 2, sm: 2.5 },
                        bgcolor: "#fafafa",
                      }}
                    >
                      <Stack
                        direction={{ xs: "column", sm: "row" }}
                        justifyContent="space-between"
                        alignItems={{ xs: "center", sm: "center" }}
                        spacing={{ xs: 1, sm: 0 }}
                      >
                        <Typography
                          variant="overline"
                          sx={{
                            color: "#1a1a1a",
                            letterSpacing: "0.15em",
                            fontSize: "0.813rem",
                            fontWeight: 700,
                          }}
                        >
                          Total
                        </Typography>
                        <Typography
                          variant="h4"
                          sx={{
                            fontWeight: 700,
                            fontFamily: "monospace",
                            fontSize: { xs: "2rem", sm: "2.125rem" },
                          }}
                        >
                          ${orderDialog.order.total.toFixed(2)}
                        </Typography>
                      </Stack>
                    </Box>
                  </Grid>
                </Grid>

                {/* Acciones */}
                <Stack
                  direction={{ xs: "column", sm: "row" }}
                  spacing={2}
                  justifyContent={{ xs: "center", sm: "flex-end" }}
                  alignItems={{ xs: "stretch", sm: "center" }}
                  sx={{ mt: 3, pt: 3, borderTop: "1px solid #e0e0e0" }}
                >
                  <Button
                    variant="outlined"
                    onClick={() => setOrderDialog({ open: false, order: null })}
                    fullWidth={isSmall}
                    sx={{
                      borderColor: "#e0e0e0",
                      color: "#666",
                      textTransform: "none",
                      fontWeight: 500,
                      borderRadius: 0,
                      px: 3,
                      "&:hover": {
                        borderColor: "#1a1a1a",
                        bgcolor: "transparent",
                      },
                    }}
                  >
                    Cerrar
                  </Button>
                  <Box sx={{ width: isSmall ? "100%" : "auto" }}>
                    {getActionButton(orderDialog.order)}
                  </Box>
                </Stack>
              </Box>
            </DialogContent>
          </>
        )}
      </Dialog>

      {/* Snackbar Minimalista */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={4000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.severity}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
          sx={{
            border: "1px solid #e0e0e0",
            borderRadius: 0,
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
          }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default OwnerOrders;
