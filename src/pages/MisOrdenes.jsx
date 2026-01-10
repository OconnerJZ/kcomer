// src/pages/MisOrdenes.jsx
import { useState } from "react";
import {
  Box,
  Paper,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Card,
  CardContent,
  Stack,
  Chip,
  Divider,
  Button,
  Collapse,
  List,
  ListItem,
  ListItemText,
  Avatar,
  Grid,
} from "@mui/material";
import {
  ExpandMore,
  ExpandLess,
  Restaurant,
  CheckCircle,
  LocalShipping,
  HourglassEmpty,
  DeliveryDining,
  AccessTime,
  Receipt,
  History as HistoryIcon,
} from "@mui/icons-material";
import GeneralContent from "@Components/layout/GeneralContent";
import { useOrders, ORDER_STATUS, STATUS_LABELS } from "@Context/OrderContext";
import { useAuth } from "@Context/AuthContext";
import CircularProgressTracker from "@Components/CicularProgressTracker";
import { isMobile } from "@Utils/commons";

const MisOrdenes = () => {
  const { user } = useAuth();
  const { getOrdersByUser, cancelOrder } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState(null);

  const userOrders = getOrdersByUser(user?.id);

  const getStatusColor = (status) => {
    const colors = {
      [ORDER_STATUS.PENDING]: "warning",
      [ORDER_STATUS.ACCEPTED]: "info",
      [ORDER_STATUS.PREPARING]: "primary",
      [ORDER_STATUS.READY]: "success",
      [ORDER_STATUS.IN_DELIVERY]: "success",
      [ORDER_STATUS.COMPLETED]: "default",
      [ORDER_STATUS.CANCELLED]: "error",
    };
    return colors[status] || "default";
  };

  const getStatusIcon = (status) => {
    const icons = {
      [ORDER_STATUS.PENDING]: <HourglassEmpty />,
      [ORDER_STATUS.ACCEPTED]: <CheckCircle />,
      [ORDER_STATUS.PREPARING]: <Restaurant />,
      [ORDER_STATUS.READY]: <CheckCircle />,
      [ORDER_STATUS.IN_DELIVERY]: <DeliveryDining />,
      [ORDER_STATUS.COMPLETED]: <CheckCircle />,
    };
    return icons[status];
  };

  const getStatusIconForTimeline = (status) => {
    const icons = {
      [ORDER_STATUS.PENDING]: <HourglassEmpty fontSize="small" />,
      [ORDER_STATUS.ACCEPTED]: <CheckCircle fontSize="small" />,
      [ORDER_STATUS.PREPARING]: <Restaurant fontSize="small" />,
      [ORDER_STATUS.READY]: <CheckCircle fontSize="small" />,
      [ORDER_STATUS.IN_DELIVERY]: <DeliveryDining fontSize="small" />,
      [ORDER_STATUS.COMPLETED]: <CheckCircle fontSize="small" />,
      [ORDER_STATUS.CANCELLED]: <CheckCircle fontSize="small" />,
    };
    return icons[status] || <AccessTime fontSize="small" />;
  };

  const handleToggleExpand = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  if (userOrders.length === 0) {
    return (
      <GeneralContent title="Mis Órdenes">
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "60vh",
            textAlign: "center",
            px: 3,
          }}
        >
          <Restaurant sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" gutterBottom>
            No tienes órdenes
          </Typography>
          <Typography color="text.secondary">
            Realiza tu primer pedido y aparecerá aquí
          </Typography>
        </Box>
      </GeneralContent>
    );
  }

  return (
    <GeneralContent title="Mis Órdenes">
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: { xs: 2, sm: 4 }, px: 2 }}>
        {/* Header */}

        {/* Grid de órdenes */}
        <Grid container spacing={1} justifyContent="center">
          {userOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <Card
                sx={{
                  backgroundColor: "rgba(255,255,255,0.5)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                }}
                elevation={0}
              >
                <CardContent sx={{ paddingBottom: "0px !important", flex: 1 }}>
                  <Stack spacing={2} height="100%">
                    {/* Header */}
                    <Stack
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                      onClick={() => handleToggleExpand(order.id)}
                      sx={{ cursor: "pointer" }}
                    >
                      <Stack spacing={1} flex={1}>
                        <Stack direction="row" spacing={1} alignItems="center">
                          <Typography
                            variant="subtitle1"
                            sx={{
                              fontWeight: 600,
                              overflow: "hidden",
                              textOverflow: "ellipsis",
                              whiteSpace: "nowrap",
                            }}
                          >
                            {order.businessName}
                          </Typography>
                          {expandedOrder === order.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </Stack>
                        {!isMobile() && (
                          <Stack
                            direction="row"
                            spacing={1}
                            alignItems="center"
                            flexWrap="wrap"
                          >
                            <Chip
                              icon={getStatusIcon(order.status)}
                              label={STATUS_LABELS[order.status]}
                              color={getStatusColor(order.status)}
                              size="small"
                            />
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              {new Date(order.createdAt).toLocaleString(
                                "es-MX"
                              )}
                            </Typography>
                          </Stack>
                        )}
                      </Stack>

                      <Typography
                        variant="subtitle2"
                        color="success"
                        sx={{ fontWeight: 700, ml: 1 }}
                      >
                        ${order.total.toFixed(2)}
                      </Typography>
                    </Stack>

                    {/* Stepper de progreso */}
                    {order.status !== ORDER_STATUS.CANCELLED && (
                      <>
                        <CircularProgressTracker status={order.status} />
                      </>
                    )}

                    {/* Detalles expandibles */}
                    <Collapse in={expandedOrder === order.id}>
                      <Divider sx={{ mb: 2 }} />

                      {/* ITEMS CON DISEÑO TIPO LISTA/TABLA */}
                      <Box sx={{ mb: 0 }}>
                        <Stack
                          direction="row"
                          alignItems="center"
                          justifyContent="space-between"
                          mb={2}
                        >
                          <Stack direction="row" alignItems="center" gap={1.5}>
                            <Box
                              sx={{
                                width: 30,
                                height: 30,
                                borderRadius: 2,
                                bgcolor: "primary.main",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                color: "white",
                              }}
                            >
                              <Receipt sx={{ fontSize: 20 }} />
                            </Box>
                            <Typography
                              variant="body2"
                              sx={{ fontWeight: 700 }}
                            >
                              Artículos del pedido
                            </Typography>
                          </Stack>
                        </Stack>

                        {/* Lista de items */}
                        <Paper
                          elevation={0}
                          sx={{
                            borderColor: "divider",
                            overflow: "hidden",
                          }}
                        >
                          {order.items.map((item, idx) => (
                            <Box
                              key={idx}
                              sx={{
                                p: 1,
                                borderBottom:
                                  idx < order.items.length - 1
                                    ? "1px solid"
                                    : "none",
                                borderColor: "divider",
                                "&:hover": {
                                  bgcolor: "action.hover",
                                },
                              }}
                            >
                              {/* Fila principal */}
                              <Stack
                                direction="row"
                                justifyContent="space-between"
                                alignItems="center"
                                mb={item.note ? 1 : 0}
                              >
                                {/* Izquierda: Cantidad + Nombre */}
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  gap={2}
                                  flex={1}
                                >
                                  <Chip
                                    label={`${item.quantity}x`}
                                    size="small"
                                    sx={{
                                      fontWeight: 700,
                                      minWidth: 40,
                                      bgcolor: "primary.lighter",
                                      color: "primary.main",
                                    }}
                                  />
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      fontWeight: 500,
                                      flex: 1,
                                    }}
                                  >
                                    {item.name}
                                  </Typography>
                                </Stack>

                                {/* Derecha: Precio unitario + Total */}
                                <Stack
                                  direction="row"
                                  alignItems="center"
                                  gap={2}
                                  sx={{ ml: 2 }}
                                >
                                  <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                      display: { xs: "none", sm: "block" },
                                      minWidth: 70,
                                      textAlign: "right",
                                    }}
                                  >
                                    ${item.price.toFixed(2)}
                                  </Typography>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      fontWeight: 600,
                                      color: "success.main",
                                      minWidth: 80,
                                      textAlign: "right",
                                    }}
                                  >
                                    ${(item.price * item.quantity).toFixed(2)}
                                  </Typography>
                                </Stack>
                              </Stack>

                              {/* Nota (si existe) */}
                              {item.note && (
                                <Box
                                  sx={{
                                    ml: 7,
                                    mt: 0.5,
                                    p: 1,
                                    bgcolor: "warning.lighter",
                                    borderRadius: 1,
                                    borderLeft: "1px solid",
                                    borderColor: "warning.main",
                                  }}
                                >
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "warning.dark",
                                      fontWeight: 500,
                                    }}
                                  >
                                    📝 {item.note}
                                  </Typography>
                                </Box>
                              )}
                            </Box>
                          ))}

                          {/* Fila del total */}
                          <Box
                            sx={{
                              p: 2,
                              bgcolor: "grey.50",
                              borderTop: "1px solid",
                              borderColor: "divider",
                            }}
                          >
                            <Stack
                              direction="row"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Typography
                                variant="body1"
                                sx={{ fontWeight: 700 }}
                              >
                                Total del pedido
                              </Typography>
                              <Typography
                                variant="h6"
                                sx={{
                                  fontWeight: 700,
                                  color: "success.main",
                                }}
                              >
                                ${order.total.toFixed(2)}
                              </Typography>
                            </Stack>
                          </Box>
                        </Paper>
                      </Box>

                      {/* HISTORIAL COLAPSABLE Y COMPACTO */}
                      <Divider sx={{ my: 1 }} />

                      <Box sx={{ pb: 2 }}>
                        <Button
                          onClick={() =>
                            setExpandedHistory(
                              expandedHistory === order.id ? null : order.id
                            )
                          }
                          fullWidth
                          variant="text"
                          sx={{
                            justifyContent: "space-between",
                            textTransform: "none",
                            py: 1.5,
                            px: 2,
                            borderRadius: 2,
                            bgcolor: "background.default",
                            "&:hover": {
                              bgcolor: "action.hover",
                            },
                          }}
                        >
                          <Stack direction="row" alignItems="center" gap={1}>
                            <HistoryIcon
                              sx={{ fontSize: 22, color: "info.main" }}
                            />
                            <Typography
                              variant="subtitle1"
                              sx={{ fontWeight: 600 }}
                            >
                              Ver historial del pedido
                            </Typography>
                            <Chip
                              label={order.statusHistory.length}
                              size="small"
                              color="info"
                              sx={{ ml: 0.5 }}
                            />
                          </Stack>
                          {expandedHistory === order.id ? (
                            <ExpandLess />
                          ) : (
                            <ExpandMore />
                          )}
                        </Button>

                        <Collapse in={expandedHistory === order.id}>
                          <Box sx={{ mt: 2, position: "relative", pl: 3 }}>
                            {/* Línea vertical */}
                            <Box
                              sx={{
                                position: "absolute",
                                left: "20px",
                                top: "20px",
                                bottom: "20px",
                                width: "2px",
                                bgcolor: "divider",
                              }}
                            />

                            <Stack spacing={2}>
                              {order.statusHistory.map((history, idx) => {
                                const isLast =
                                  idx === order.statusHistory.length - 1;
                                return (
                                  <Box
                                    key={idx}
                                    sx={{
                                      position: "relative",
                                      display: "flex",
                                      alignItems: "flex-start",
                                      gap: 2,
                                    }}
                                  >
                                    {/* Punto del timeline */}
                                    <Box
                                      sx={{
                                        position: "absolute",
                                        left: "-28px",
                                        top: "8px",
                                        width: isLast ? 40 : 36,
                                        height: isLast ? 40 : 36,
                                        borderRadius: "50%",
                                        bgcolor: `${getStatusColor(
                                          history.status
                                        )}.main`,
                                        display: "flex",
                                        alignItems: "center",
                                        justifyContent: "center",
                                        color: "white",
                                        boxShadow: isLast ? 3 : 1,
                                        transform: isLast
                                          ? "scale(1.05)"
                                          : "scale(1)",
                                        transition: "all 0.3s",
                                        zIndex: 1,
                                        border: "3px solid white",
                                      }}
                                    >
                                      {getStatusIconForTimeline(history.status)}
                                    </Box>

                                    {/* Contenido del evento - Más compacto */}
                                    <Paper
                                      elevation={0}
                                      sx={{
                                        flex: 1,
                                        p: 1.5,
                                        bgcolor: isLast
                                          ? "action.selected"
                                          : "background.default",
                                        borderRadius: 2,
                                        border: "1px solid",
                                        borderColor: isLast
                                          ? "primary.main"
                                          : "divider",
                                        transition: "all 0.3s",
                                        ml: 2,
                                      }}
                                    >
                                      <Stack
                                        direction="row"
                                        justifyContent="space-between"
                                        alignItems="flex-start"
                                        gap={1}
                                      >
                                        <Typography
                                          variant="body2"
                                          sx={{
                                            fontWeight: isLast ? 600 : 500,
                                            color: isLast
                                              ? "primary.main"
                                              : "text.primary",
                                          }}
                                        >
                                          {STATUS_LABELS[history.status]}
                                        </Typography>
                                        <Stack
                                          direction="row"
                                          alignItems="center"
                                          gap={0.3}
                                        >
                                          <AccessTime
                                            sx={{
                                              fontSize: 12,
                                              color: "text.secondary",
                                            }}
                                          />
                                          <Typography
                                            variant="caption"
                                            color="text.secondary"
                                            sx={{ whiteSpace: "nowrap" }}
                                          >
                                            {new Date(
                                              history.timestamp
                                            ).toLocaleString("es-MX", {
                                              day: "2-digit",
                                              month: "short",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </Typography>
                                        </Stack>
                                      </Stack>
                                      {history.note && (
                                        <Box
                                          sx={{
                                            mt: 1,
                                            p: 0.8,
                                            bgcolor: "info.lighter",
                                            borderRadius: 1,
                                            borderLeft: "3px solid",
                                            borderColor: "info.main",
                                          }}
                                        >
                                          <Typography
                                            variant="caption"
                                            sx={{
                                              fontStyle: "italic",
                                              color: "info.dark",
                                            }}
                                          >
                                            💬 {history.note}
                                          </Typography>
                                        </Box>
                                      )}
                                    </Paper>
                                  </Box>
                                );
                              })}
                            </Stack>
                          </Box>
                        </Collapse>
                      </Box>

                      {/* Botón cancelar */}
                      {order.status === ORDER_STATUS.PENDING && (
                        <>
                          <Divider sx={{ my: 2 }} />
                          <Button
                            variant="outlined"
                            color="error"
                            fullWidth
                            onClick={() => {
                              if (
                                window.confirm(
                                  "¿Estás seguro de cancelar esta orden?"
                                )
                              ) {
                                cancelOrder(order.id);
                              }
                            }}
                            sx={{
                              borderRadius: 2,
                              py: 1,
                              textTransform: "none",
                              fontWeight: 600,
                            }}
                          >
                            Cancelar Orden
                          </Button>
                        </>
                      )}
                    </Collapse>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </GeneralContent>
  );
};

export default MisOrdenes;
