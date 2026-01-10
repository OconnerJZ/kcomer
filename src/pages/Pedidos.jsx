// src/pages/Pedidos.jsx - Versión mejorada con formulario moderno
import { useState } from "react";
import {
  Box,
  Tabs,
  Tab,
  Paper,
  Typography,
  List,
  ListItem,
  IconButton,
  Button,
  Divider,
  Stack,
  Chip,
  Badge,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Card,
  CardContent,
  Select,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import {
  Delete,
  ShoppingCart,
  Restaurant,
  DeleteSweep,
  Add,
  Remove,
  Ballot,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GeneralContent from "@Components/layout/GeneralContent";
import { useCart } from "@Hooks/components/useCart";
import { useAuth } from "@Context/AuthContext";
import { useOrders } from "@Context/OrderContext";
import { Segmented } from "antd";
import MisOrdenes from "./MisOrdenes";
import CicularProgressTracker from "@Components/CicularProgressTracker";

// Iconos con emojis
const Icons = {
  LocalShipping: () => <span style={{ fontSize: 22 }}>🚚</span>,
  Store: () => <span style={{ fontSize: 22 }}>🏪</span>,
  Phone: () => <span style={{ fontSize: 22 }}>📱</span>,
  Payment: () => <span style={{ fontSize: 22 }}>💳</span>,
  LocationOn: () => <span style={{ fontSize: 22 }}>📍</span>,
  Notes: () => <span style={{ fontSize: 22 }}>📝</span>,
};

const Pedidos = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const {
    cart,
    addToCart,
    removeFromCart,
    clearBusiness,
    getCartCount,
    getGrandTotal,
  } = useCart();
  const { createOrder } = useOrders();

  const businesses = Object.keys(cart);
  const [activeTab, setActiveTab] = useState(0);
  const [checkoutDialogOpen, setCheckoutDialogOpen] = useState(false);

  // Estados del formulario mejorado
  const [orderType, setOrderType] = useState("pickup");
  const [addressType, setAddressType] = useState("saved");
  const [errors, setErrors] = useState({});

  // Direcciones guardadas de ejemplo (esto debería venir del contexto/API del usuario)
  const addresses = [
    {
      id: 1,
      street: "Av. Insurgentes",
      number: "123",
      references: "Entre Reforma y Chapultepec",
    },
    {
      id: 2,
      street: "Calle Madero",
      number: "456",
      references: "Edificio azul",
    },
  ];

  const [form, setForm] = useState({
    customerPhone: user?.phone || "",
    paymentMethod: "cash",
    userAddressId: "",
    newAddress: {
      street: "",
      number: "",
      references: "",
    },
    notes: "",
  });

  const [option, setOption] = useState("pedidos");
  const optionsSegmented = [
    { label: "Pedidos", value: "pedidos" },
    { label: "Ordenes", value: "ordenes" },
  ];

  const handleSegmented = (value) => {
    setOption(value);
  };

  const handleChangeTab = (event, newValue) => {
    setActiveTab(newValue);
  };

  const handleQuantityChange = (businessId, item, delta) => {
    const newQuantity = item.quantity + delta;

    if (newQuantity === 0) {
      removeFromCart(businessId, item.id);
      return;
    }

    addToCart({
      itemId: item.id,
      businessId,
      businessName: cart[businessId].businessName,
      item: {
        ...item,
        quantity: newQuantity,
      },
    });
  };

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: null }));
    }
  };

  const handleNewAddressChange = (field, value) => {
    setForm((prev) => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        [field]: value,
      },
    }));
  };

  const handleOpenCheckout = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar un pedido");
      navigate("/login/orden");
      return;
    }
    setCheckoutDialogOpen(true);
  };

  const validateCheckout = () => {
    const newErrors = {};

    if (!form.customerPhone) {
      newErrors.customerPhone = "El teléfono es requerido";
    }

    if (orderType === "delivery") {
      if (addressType === "saved" && !form.userAddressId) {
        newErrors.userAddressId = "Selecciona una dirección guardada";
      }
      if (addressType === "new") {
        if (!form.newAddress.street) {
          newErrors.street = "La calle es requerida";
        }
        if (!form.newAddress.number) {
          newErrors.number = "El número es requerido";
        }
      }
    }

    const currentBusinessId = businesses[activeTab];
    const currentBusiness = cart[currentBusinessId];

    if (
      !currentBusiness.items ||
      Object.keys(currentBusiness.items).length === 0
    ) {
      newErrors.general = "El carrito está vacío";
    }

    if (currentBusiness.total <= 0) {
      newErrors.general = "El total debe ser mayor a $0";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleConfirmCheckout = () => {
    if (!validateCheckout()) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const currentBusinessId = businesses[activeTab];
    const currentBusiness = cart[currentBusinessId];

    // Preparar dirección según el tipo de pedido
    let deliveryAddress = "";
    if (orderType === "delivery") {
      if (addressType === "saved") {
        const selectedAddress = addresses.find(
          (addr) => addr.id === form.userAddressId
        );
        deliveryAddress = `${selectedAddress.street} #${
          selectedAddress.number
        }${
          selectedAddress.references ? ", " + selectedAddress.references : ""
        }`;
      } else {
        deliveryAddress = `${form.newAddress.street} #${
          form.newAddress.number
        }${
          form.newAddress.references ? ", " + form.newAddress.references : ""
        }`;
      }
    } else {
      deliveryAddress = "Recoger en tienda";
    }

    // Crear la orden
    const order = createOrder({
      businessId: currentBusinessId,
      businessName: currentBusiness.businessName,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items: Object.values(currentBusiness.items),
      total: currentBusiness.total,
      orderType,
      deliveryAddress,
      phoneNumber: form.customerPhone,
      paymentMethod: form.paymentMethod,
      notes: form.notes,
    });

    // Limpiar carrito del negocio
    clearBusiness(currentBusinessId);

    // Cerrar diálogo
    setCheckoutDialogOpen(false);

    // Reset form
    setForm({
      customerPhone: user?.phone || "",
      paymentMethod: "cash",
      userAddressId: "",
      newAddress: { street: "", number: "", references: "" },
      notes: "",
    });
    setOrderType("pickup");
    setAddressType("saved");
    setErrors({});

    // Navegar a mis órdenes
    navigate("/mis-ordenes");

    // Notificación de éxito
    alert(`¡Orden realizada con éxito! #${order.id}`);
  };

  if (businesses.length === 0) {
    return (
      <GeneralContent title="Pedidos">
        <Box sx={{ textAlign: "center", mt: 2 }}>
          <Segmented
            onChange={(value) => {
              handleSegmented(value);
            }}
            options={optionsSegmented}
          />
          {option == "pedidos" && (
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
              <Ballot sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
              <Typography variant="h5" gutterBottom>
                Parece que no hay pedidos todavía
              </Typography>
              <Typography color="text.secondary">
                Descubre negocios cercanos y empieza a pedir
              </Typography>
            </Box>
          )}
          {option == "ordenes" && <MisOrdenes />}
        </Box>
      </GeneralContent>
    );
  }

  const currentBusinessId = businesses[activeTab];
  const currentBusiness = cart[currentBusinessId];

  return (
    <GeneralContent title="Pedidos">
      <Box sx={{ textAlign: "center", mt: 2 }}>
        <Segmented
          onChange={(value) => {
            handleSegmented(value);
          }}
          options={optionsSegmented}
        />
        {option == "pedidos" && (
          <Box sx={{ maxWidth: 900, mx: "auto", mt: { xs: 2, sm: 4 }, px: 2 }}>
            {/* Tabs */}
            <Paper sx={{ mb: 2, borderRadius: 0 }} elevation={0}>
              <Tabs
                value={activeTab}
                onChange={handleChangeTab}
                variant="scrollable"
                scrollButtons="auto"
                sx={{ borderBottom: 1, borderColor: "divider" }}
              >
                {businesses.map((businessId) => (
                  <Tab
                    key={businessId}
                    label={
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="h7">
                          {cart[businessId].businessName}
                        </Typography>
                        <Chip
                          label={Object.keys(cart[businessId].items).length}
                          size="small"
                          color="warning"
                        />
                      </Stack>
                    }
                  />
                ))}
              </Tabs>
            </Paper>

            {/* Contenido */}
            <Paper sx={{ p: 3, borderRadius: 2 }}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ mb: 2 }}
              >
                <Typography variant="h6">
                  {currentBusiness.businessName}
                </Typography>
                <IconButton
                  color="default"
                  onClick={() => {
                    if (
                      window.confirm(
                        "¿Eliminar todos los items de este negocio?"
                      )
                    ) {
                      clearBusiness(currentBusinessId);
                      setActiveTab(Math.max(0, activeTab - 1));
                    }
                  }}
                >
                  <DeleteSweep />
                </IconButton>
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Lista de items */}
              <List>
                {Object.entries(currentBusiness.items).map(([itemId, item]) => (
                  <ListItem
                    key={itemId}
                    sx={{
                      border: "1px solid",
                      borderColor: "divider",
                      borderRadius: 2,
                      mb: 1,
                      flexDirection: "column",
                      alignItems: "stretch",
                    }}
                  >
                    <Box
                      sx={{
                        width: "100%",
                        display: "flex",
                        justifyContent: "space-between",
                        mb: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" sx={{ fontWeight: 600 }}>
                          {item.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {item.description}
                        </Typography>
                        {item.note && (
                          <Typography
                            variant="caption"
                            sx={{
                              display: "block",
                              mt: 0.5,
                              color: "primary.main",
                              fontStyle: "italic",
                            }}
                          >
                            📝 {item.note}
                          </Typography>
                        )}
                      </Box>

                      <IconButton
                        edge="end"
                        color="error"
                        onClick={() =>
                          removeFromCart(currentBusinessId, itemId)
                        }
                        sx={{ alignSelf: "flex-start" }}
                      >
                        <Delete />
                      </IconButton>
                    </Box>

                    <Stack
                      direction="row"
                      spacing={2}
                      alignItems="center"
                      justifyContent="space-between"
                    >
                      <Stack direction="row" spacing={1} alignItems="center">
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          ${item.price.toFixed(2)}
                        </Typography>

                        <Stack
                          direction="row"
                          alignItems="center"
                          sx={{
                            bgcolor: "background.default",
                            borderRadius: 1,
                            border: "1px solid",
                            borderColor: "divider",
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(currentBusinessId, item, -1)
                            }
                          >
                            <Remove fontSize="small" />
                          </IconButton>

                          <Typography
                            sx={{
                              fontWeight: 600,
                              minWidth: 30,
                              textAlign: "center",
                            }}
                          >
                            {item.quantity}
                          </Typography>

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleQuantityChange(currentBusinessId, item, 1)
                            }
                            color="primary"
                          >
                            <Add fontSize="small" />
                          </IconButton>
                        </Stack>
                      </Stack>

                      <Chip
                        label={`$${(item.price * item.quantity).toFixed(2)}`}
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Stack>
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 2 }} />

              {/* Total y Checkout */}
              <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between">
                  <Typography variant="h6">Total:</Typography>
                  <Typography
                    variant="h6"
                    color="success"
                    sx={{ fontWeight: 700 }}
                  >
                    ${currentBusiness.total.toFixed(2)}
                  </Typography>
                </Stack>

                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={handleOpenCheckout}
                  sx={{ borderRadius: 2, py: 1.5 }}
                >
                  Realizar Pedido
                </Button>
              </Stack>
            </Paper>

            {/* Dialog de Checkout Mejorado */}
            <Dialog
              open={checkoutDialogOpen}
              onClose={() => setCheckoutDialogOpen(false)}
              maxWidth="sm"
              fullWidth
              PaperProps={{
                sx: { borderRadius: 3 },
              }}
            >
              <DialogTitle sx={{ pb: 1 }}>
                <Typography variant="h5" fontWeight={400}>
                  Confirmar pedido
                </Typography>
              </DialogTitle>

              <DialogContent sx={{ pt: 2 }}>
                <Stack spacing={3}>
                  {/* 1. TIPO DE PEDIDO */}
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Tipo de pedido
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2}>
                      <Card
                        onClick={() => setOrderType("pickup")}
                        sx={{
                          flex: 1,
                          cursor: "pointer",
                          border:
                            orderType === "pickup"
                              ? "1.5px solid #1976d2"
                              : "1px solid transparent",
                          bgcolor: orderType === "pickup" ? "#e3f2fd" : "white",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                            transform: "translateY(-2px)",
                            boxShadow: 2,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Box sx={{ fontSize: 32, mb: 0.5 }}>🏪</Box>
                          <Typography variant="body2" fontWeight={600}>
                            Recoger en tienda
                          </Typography>

                          {orderType === "pickup" ? (
                            <Chip
                              label="Seleccionado"
                              size="small"
                              color="primary"
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Gratis
                            </Typography>
                          )}
                        </CardContent>
                      </Card>

                      <Card
                        onClick={() => setOrderType("delivery")}
                        sx={{
                          flex: 1,
                          cursor: "pointer",
                          border:
                            orderType === "delivery"
                              ? "1.5px solid #1976d2"
                              : "1px solid transparent",
                          bgcolor:
                            orderType === "delivery" ? "#e3f2fd" : "white",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#1976d2",
                            transform: "translateY(-2px)",
                            boxShadow: 2,
                          },
                        }}
                      >
                        <CardContent sx={{ textAlign: "center", py: 2 }}>
                          <Box sx={{ fontSize: 32, mb: 0.5 }}>🚚</Box>
                          <Typography variant="body2" fontWeight={600}>
                            Entrega a domicilio
                          </Typography>

                          {orderType === "delivery" ? (
                            <Chip
                              label="Seleccionado"
                              size="small"
                              color="primary"
                              sx={{ mt: 1 }}
                            />
                          ) : (
                            <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Según distancia
                            </Typography>
                          )}
                        </CardContent>
                      </Card>
                    </Box>
                  </Box>

                  {/* 2. DATOS DE CONTACTO Y NOTAS */}
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Datos de contacto
                      </Typography>
                    </Box>

                    <TextField
                      label="Teléfono"
                      value={form.customerPhone}
                      onChange={(e) =>
                        handleChange("customerPhone", e.target.value)
                      }
                      fullWidth
                      required
                      error={!!errors.customerPhone}
                      helperText={errors.customerPhone}
                      sx={{ mb: 3 }}
                    />

                    <TextField
                      label="Notas adicionales"
                      placeholder="¿Alguna instrucción especial? (opcional)"
                      multiline
                      rows={2}
                      value={form.notes}
                      onChange={(e) => handleChange("notes", e.target.value)}
                      fullWidth
                    />
                  </Box>

                  {/* 3. MÉTODO DE PAGO */}
                  <Box>
                    <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                      <Typography variant="subtitle1" fontWeight={600}>
                        Método de pago
                      </Typography>
                    </Box>

                    <Box display="flex" gap={2} mb={2}>
                      <Card
                        onClick={() => handleChange("paymentMethod", "cash")}
                        sx={{
                          flex: 1,
                          cursor: "pointer",
                          border:
                            form.paymentMethod === "cash"
                              ? "1px solid #4caf50"
                              : "1px solid #e0e0e0",
                          bgcolor:
                            form.paymentMethod === "cash" ? "#f1f8f4" : "white",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#4caf50",
                            transform: "translateY(-2px)",
                            boxShadow: 2,
                          },
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ fontSize: 24 }}>💵</Box>
                              <Typography variant="body2" fontWeight={600}>
                                Efectivo
                              </Typography>
                            </Box>
                            {form.paymentMethod === "cash" && (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  bgcolor: "#4caf50",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                }}
                              >
                                ✓
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>

                      <Card
                        onClick={() =>
                          handleChange("paymentMethod", "transfer")
                        }
                        sx={{
                          flex: 1,
                          cursor: "pointer",
                          border:
                            form.paymentMethod === "transfer"
                              ? "1px solid #2196f3"
                              : "1px solid #e0e0e0",
                          bgcolor:
                            form.paymentMethod === "transfer"
                              ? "#e3f2fd"
                              : "white",
                          transition: "all 0.2s",
                          "&:hover": {
                            borderColor: "#2196f3",
                            transform: "translateY(-2px)",
                            boxShadow: 2,
                          },
                        }}
                      >
                        <CardContent
                          sx={{ p: 1.5, "&:last-child": { pb: 1.5 } }}
                        >
                          <Box
                            display="flex"
                            alignItems="center"
                            justifyContent="space-between"
                          >
                            <Box display="flex" alignItems="center" gap={1}>
                              <Box sx={{ fontSize: 24 }}>🏦</Box>
                              <Typography variant="body2" fontWeight={600}>
                                Transferencia
                              </Typography>
                            </Box>
                            {form.paymentMethod === "transfer" && (
                              <Box
                                sx={{
                                  width: 20,
                                  height: 20,
                                  borderRadius: "50%",
                                  bgcolor: "#2196f3",
                                  color: "white",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  fontSize: 12,
                                  fontWeight: "bold",
                                }}
                              >
                                ✓
                              </Box>
                            )}
                          </Box>
                        </CardContent>
                      </Card>
                    </Box>

                    {form.paymentMethod === "transfer" && (
                      <Box mt={2}>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          mb={2}
                          color="text.secondary"
                        >
                          Realiza tu transferencia a:
                        </Typography>

                        {/* Tarjeta Bancaria Moderna */}
                        <Box
                          sx={{
                            background:
                              "linear-gradient(135deg, #db9238ff 0%, #ff4b45 100%)",
                            borderRadius: 3,
                            p: 3,
                            position: "relative",
                            overflow: "hidden",
                            boxShadow: "0 8px 16px rgba(102, 126, 234, 0.4)",
                            "&::before": {
                              content: '""',
                              position: "absolute",
                              top: -50,
                              right: -50,
                              width: 150,
                              height: 150,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.1)",
                            },
                            "&::after": {
                              content: '""',
                              position: "absolute",
                              bottom: -30,
                              left: -30,
                              width: 100,
                              height: 100,
                              borderRadius: "50%",
                              background: "rgba(255, 255, 255, 0.05)",
                            },
                          }}
                        >
                          {/* Chip y Logo */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            alignItems="flex-start"
                            mb={3}
                          >
                            <Box
                              sx={{
                                width: 50,
                                height: 40,
                                background:
                                  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)",
                                borderRadius: 1.5,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              <Box
                                sx={{
                                  width: 30,
                                  height: 24,
                                  border: "2px solid rgba(255,255,255,0.8)",
                                  borderRadius: 0.5,
                                }}
                              />
                            </Box>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "white",
                                fontWeight: 700,
                                position: "relative",
                                zIndex: 1,
                              }}
                            >
                              qsCome
                            </Typography>
                          </Box>

                          {/* Número de Cuenta */}
                          <Box mb={3} position="relative" zIndex={1}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "0.7rem",
                                mb: 0.5,
                                display: "block",
                              }}
                            >
                              Número de Cuenta
                            </Typography>
                            <Typography
                              variant="h6"
                              sx={{
                                color: "white",
                                fontWeight: 600,
                                letterSpacing: 2,
                                fontFamily: "monospace",
                              }}
                            >
                              4152 3138 7621 0043
                            </Typography>
                          </Box>

                          {/* CLABE */}
                          <Box mb={3} position="relative" zIndex={1}>
                            <Typography
                              variant="caption"
                              sx={{
                                color: "rgba(255,255,255,0.7)",
                                fontSize: "0.7rem",
                                mb: 0.5,
                                display: "block",
                              }}
                            >
                              CLABE Interbancaria
                            </Typography>
                            <Typography
                              variant="body2"
                              sx={{
                                color: "white",
                                fontWeight: 600,
                                letterSpacing: 1,
                                fontFamily: "monospace",
                              }}
                            >
                              012 345 678 901 234 567
                            </Typography>
                          </Box>

                          {/* Titular y Banco */}
                          <Box
                            display="flex"
                            justifyContent="space-between"
                            position="relative"
                            zIndex={1}
                          >
                            <Box>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255,255,255,0.7)",
                                  fontSize: "0.65rem",
                                  mb: 0.3,
                                  display: "block",
                                }}
                              >
                                TITULAR
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "white", fontWeight: 600 }}
                              >
                                Bryant Samuel Jaramillo Zarate
                              </Typography>
                            </Box>
                            <Box textAlign="right">
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "rgba(255,255,255,0.7)",
                                  fontSize: "0.65rem",
                                  mb: 0.3,
                                  display: "block",
                                }}
                              >
                                BANCO
                              </Typography>
                              <Typography
                                variant="body2"
                                sx={{ color: "white", fontWeight: 600 }}
                              >
                                BBVA México
                              </Typography>
                            </Box>
                          </Box>
                        </Box>

                        {/* Botón de copiar (opcional) */}
                        <Box mt={2} display="flex" gap={1}>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              navigator.clipboard.writeText("4152313876210043");
                              alert("Número de cuenta copiado ✓");
                            }}
                            sx={{ flex: 1, textTransform: "none" }}
                          >
                            Copiar Cuenta
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              navigator.clipboard.writeText(
                                "012345678901234567"
                              );
                              alert("CLABE copiada ✓");
                            }}
                            sx={{ flex: 1, textTransform: "none" }}
                          >
                            Copiar CLABE
                          </Button>
                        </Box>

                       
                      </Box>
                    )}
                  </Box>

                  {/* 4. DIRECCIÓN DE ENTREGA */}
                  {orderType === "delivery" && (
                    <Box>
                      <Box display="flex" alignItems="center" gap={1.5} mb={2}>
                        <Icons.LocationOn />
                        <Typography variant="subtitle1" fontWeight={600}>
                          Dirección de entrega
                        </Typography>
                      </Box>

                      {/* Segmented Control */}
                      <Box
                        sx={{
                          display: "flex",
                          gap: 1,
                          p: 0.5,
                          bgcolor: "#f5f5f5",
                          borderRadius: 2,
                          mb: 2,
                        }}
                      >
                        <Box
                          onClick={() => setAddressType("saved")}
                          sx={{
                            flex: 1,
                            py: 1,
                            px: 2,
                            textAlign: "center",
                            borderRadius: 1.5,
                            cursor: "pointer",
                            transition: "all 0.3s",
                            bgcolor:
                              addressType === "saved" ? "white" : "transparent",
                            boxShadow: addressType === "saved" ? 2 : 0,
                            "&:hover": {
                              bgcolor:
                                addressType === "saved" ? "white" : "#eeeeee",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={addressType === "saved" ? 600 : 400}
                            color={
                              addressType === "saved"
                                ? "primary"
                                : "text.secondary"
                            }
                          >
                            Guardada
                          </Typography>
                        </Box>

                        <Box
                          onClick={() => setAddressType("new")}
                          sx={{
                            flex: 1,
                            py: 1,
                            px: 2,
                            textAlign: "center",
                            borderRadius: 1.5,
                            cursor: "pointer",
                            transition: "all 0.3s",
                            bgcolor:
                              addressType === "new" ? "white" : "transparent",
                            boxShadow: addressType === "new" ? 2 : 0,
                            "&:hover": {
                              bgcolor:
                                addressType === "new" ? "white" : "#eeeeee",
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            fontWeight={addressType === "new" ? 600 : 400}
                            color={
                              addressType === "new"
                                ? "primary"
                                : "text.secondary"
                            }
                          >
                            Nueva
                          </Typography>
                        </Box>
                      </Box>

                      {addressType === "saved" && (
                        <Select
                          value={form.userAddressId}
                          onChange={(e) =>
                            handleChange("userAddressId", e.target.value)
                          }
                          fullWidth
                          displayEmpty
                          error={!!errors.userAddressId}
                          size="medium"
                        >
                          <MenuItem value="" disabled>
                            Selecciona una dirección
                          </MenuItem>
                          {addresses.map((addr) => (
                            <MenuItem key={addr.id} value={addr.id}>
                              <Box>
                                <Typography variant="body2">
                                  {addr.street} #{addr.number}
                                </Typography>
                                {addr.references && (
                                  <Typography
                                    variant="caption"
                                    color="text.secondary"
                                  >
                                    {addr.references}
                                  </Typography>
                                )}
                              </Box>
                            </MenuItem>
                          ))}
                        </Select>
                      )}

                      {addressType === "new" && (
                        <Stack spacing={1.5}>
                          <TextField
                            label="Calle"
                            value={form.newAddress.street}
                            onChange={(e) =>
                              handleNewAddressChange("street", e.target.value)
                            }
                            fullWidth
                            required
                            error={!!errors.street}
                            helperText={errors.street}
                            size="small"
                          />
                          <TextField
                            label="Número"
                            value={form.newAddress.number}
                            onChange={(e) =>
                              handleNewAddressChange("number", e.target.value)
                            }
                            fullWidth
                            required
                            error={!!errors.number}
                            helperText={errors.number}
                            size="small"
                          />
                          <TextField
                            label="Referencias (opcional)"
                            value={form.newAddress.references}
                            onChange={(e) =>
                              handleNewAddressChange(
                                "references",
                                e.target.value
                              )
                            }
                            fullWidth
                            placeholder="Ej: Entre calles X y Y"
                            size="small"
                          />
                        </Stack>
                      )}
                    </Box>
                  )}

                  <Divider />

                  {/* TOTAL */}
                  <Stack
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography variant="h6">Total a pagar:</Typography>
                    <Typography
                      variant="h6"
                      color="primary"
                      sx={{ fontWeight: 700 }}
                    >
                      ${currentBusiness.total.toFixed(2)}
                    </Typography>
                  </Stack>
                </Stack>
              </DialogContent>

              <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button
                  onClick={() => setCheckoutDialogOpen(false)}
                  sx={{ textTransform: "none" }}
                >
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmCheckout}
                  variant="contained"
                  sx={{
                    textTransform: "none",
                    px: 3,
                  }}
                >
                  Confirmar Pedido
                </Button>
              </DialogActions>
            </Dialog>
          </Box>
        )}
        {option == "ordenes" && <MisOrdenes />}
      </Box>
    </GeneralContent>
  );
};

export default Pedidos;
