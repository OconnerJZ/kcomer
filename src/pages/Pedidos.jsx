// src/pages/Pedidos.jsx - Versión final con checkout
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
} from "@mui/material";
import {
  Delete,
  ShoppingCart,
  Restaurant,
  DeleteSweep,
  Add,
  Remove,
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import GeneralContent from "@Components/layout/GeneralContent";
import { useCart } from "@Hooks/components/useCart";
import { useAuth } from "@Context/AuthContext";
import { useOrders } from "@Context/OrderContext";
import { Segmented } from "antd";
import MisOrdenes from "./MisOrdenes";

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
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [notes, setNotes] = useState("");

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

  const handleOpenCheckout = () => {
    if (!isAuthenticated) {
      alert("Debes iniciar sesión para realizar un pedido");
      navigate("/login");
      return;
    }
    setCheckoutDialogOpen(true);
  };

  const handleConfirmCheckout = () => {
    const currentBusinessId = businesses[activeTab];
    const currentBusiness = cart[currentBusinessId];

    // Crear la orden
    const order = createOrder({
      businessId: currentBusinessId,
      businessName: currentBusiness.businessName,
      userId: user.id,
      customerName: user.name,
      customerEmail: user.email,
      items: Object.values(currentBusiness.items),
      total: currentBusiness.total,
      deliveryAddress,
      phoneNumber,
      notes,
    });

    // Limpiar carrito del negocio
    clearBusiness(currentBusinessId);

    // Cerrar diálogo
    setCheckoutDialogOpen(false);

    // Navegar a mis órdenes
    navigate("/mis-ordenes");

    // Notificación de éxito
    alert(`¡Orden realizada con éxito! #${order.id.slice(-8)}`);
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
              <ShoppingCart
                sx={{ fontSize: 80, color: "text.disabled", mb: 2 }}
              />
              <Typography variant="h5" gutterBottom>
                Tu carrito está vacío
              </Typography>
              <Typography color="text.secondary">
                Explora negocios y agrega productos para empezar
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
            {/* Header */}
            

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
                        
                        <Typography variant="h7" >{cart[businessId].businessName}</Typography>
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

            {/* Dialog de Checkout */}
            <Dialog
              open={checkoutDialogOpen}
              onClose={() => setCheckoutDialogOpen(false)}
              maxWidth="sm"
              fullWidth
            >
              <DialogTitle>Confirmar Pedido</DialogTitle>
              <DialogContent>
                <Stack spacing={2} sx={{ mt: 1 }}>
                  <TextField
                    label="Dirección de entrega"
                    placeholder="Calle, número, colonia..."
                    value={deliveryAddress}
                    onChange={(e) => setDeliveryAddress(e.target.value)}
                    required
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <TextField
                    label="Teléfono de contacto"
                    placeholder="10 dígitos"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    required
                    fullWidth
                    type="tel"
                  />

                  <TextField
                    label="Notas adicionales (opcional)"
                    placeholder="Instrucciones especiales..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    fullWidth
                    multiline
                    rows={2}
                  />

                  <Divider />

                  <Stack direction="row" justifyContent="space-between">
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
              <DialogActions>
                <Button onClick={() => setCheckoutDialogOpen(false)}>
                  Cancelar
                </Button>
                <Button
                  onClick={handleConfirmCheckout}
                  variant="contained"
                  disabled={!deliveryAddress || !phoneNumber}
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
