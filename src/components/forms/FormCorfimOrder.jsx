import {
  Box,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  Stack,
  Card,
  CardContent,
  Chip,
  Paper,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
  InputAdornment
} from "@mui/material";
import { useState } from "react";

// Iconos simulados con emojis - TODOS DEL MISMO TAMAÑO
const Icons = {
  LocalShipping: () => <span style={{ fontSize: 22 }}>🚚</span>,
  Store: () => <span style={{ fontSize: 22 }}>🏪</span>,
  Phone: () => <span style={{ fontSize: 22 }}>📱</span>,
  Payment: () => <span style={{ fontSize: 22 }}>💳</span>,
  LocationOn: () => <span style={{ fontSize: 22 }}>📍</span>,
  Notes: () => <span style={{ fontSize: 22 }}>📝</span>,
  CheckCircle: () => <span style={{ fontSize: 20 }}>✅</span>
};

export default function FormCorfimOrder() {
  // Datos de ejemplo
  const user = { name: "Juan Pérez", phone: "555-1234" };
  const addresses = [
    { id: 1, street: "Av. Insurgentes", number: "123", references: "Entre Reforma y Chapultepec" },
    { id: 2, street: "Calle Madero", number: "456", references: "Edificio azul" }
  ];

  const [orderType, setOrderType] = useState("pickup");
  const [addressType, setAddressType] = useState("saved");
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    customerName: user?.name || "",
    customerPhone: user?.phone || "",
    paymentMethod: "cash",
    transferTiming: "after_accept",
    userAddressId: "",
    newAddress: {
      street: "",
      number: "",
      references: ""
    },
    notes: ""
  });

  const handleChange = (field, value) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: null }));
    }
  };

  const handleNewAddressChange = (field, value) => {
    setForm(prev => ({
      ...prev,
      newAddress: {
        ...prev.newAddress,
        [field]: value
      }
    }));
  };

  const validate = () => {
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

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) {
      alert("Por favor completa todos los campos requeridos");
      return;
    }

    const payload = {
      orderType,
      customerName: form.customerName,
      customerPhone: form.customerPhone,
      paymentMethod: form.paymentMethod,
      ...(form.paymentMethod === "transfer" && { 
        transferTiming: form.transferTiming 
      }),
      ...(orderType === "delivery" && {
        addressType,
        ...(addressType === "saved" 
          ? { userAddressId: form.userAddressId } 
          : { newAddress: form.newAddress }
        )
      }),
      notes: form.notes
    };

    alert("✅ Pedido confirmado!\n\n" + JSON.stringify(payload, null, 2));
  };

  return (
    <Box maxWidth={600} mx="auto" p={3} sx={{ bgcolor: '#f5f5f5', minHeight: '100vh' }}>
      {/* Header */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={600} gutterBottom>
          Confirmar pedido
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Completa los datos para finalizar tu orden
        </Typography>
      </Box>

      <Stack spacing={3}>
        {/* 1. TIPO DE PEDIDO */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Icons.LocalShipping />
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
                border: orderType === "pickup" ? '3px solid #1976d2' : '2px solid transparent',
                bgcolor: orderType === "pickup" ? '#e3f2fd' : 'white',
                transition: "all 0.2s",
                "&:hover": { 
                  borderColor: "#1976d2",
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Box sx={{ fontSize: 40, mb: 1 }}>🏪</Box>
                <Typography variant="subtitle2" fontWeight={600} mt={1}>
                  Recoger en tienda
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Gratis
                </Typography>
                {orderType === "pickup" && (
                  <Chip
                    label="Seleccionado"
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>

            <Card
              onClick={() => setOrderType("delivery")}
              sx={{
                flex: 1,
                cursor: "pointer",
                border: orderType === "delivery" ? '3px solid #1976d2' : '2px solid transparent',
                bgcolor: orderType === "delivery" ? '#e3f2fd' : 'white',
                transition: "all 0.2s",
                "&:hover": { 
                  borderColor: "#1976d2",
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ textAlign: "center", py: 3 }}>
                <Box sx={{ fontSize: 40, mb: 1 }}>🚚</Box>
                <Typography variant="subtitle2" fontWeight={600} mt={1}>
                  Entrega a domicilio
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Según distancia
                </Typography>
                {orderType === "delivery" && (
                  <Chip
                    label="Seleccionado"
                    size="small"
                    color="primary"
                    sx={{ mt: 1 }}
                  />
                )}
              </CardContent>
            </Card>
          </Box>
        </Paper>

        {/* 2. DATOS DE CONTACTO Y NOTAS - AGRUPADOS */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, borderRadius: 2 }}>
          {/* Datos de contacto */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Icons.Phone />
            <Typography variant="subtitle1" fontWeight={600}>
              Datos de contacto
            </Typography>
          </Box>

          <TextField
            label="Teléfono"
            value={form.customerPhone}
            onChange={e => handleChange("customerPhone", e.target.value)}
            fullWidth
            required
            error={!!errors.customerPhone}
            helperText={errors.customerPhone}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  📱
                </InputAdornment>
              )
            }}
            sx={{ mb: 4 }}
          />

          {/* Notas adicionales */}
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Icons.Notes />
            <Typography variant="subtitle1" fontWeight={600}>
              Notas adicionales
            </Typography>
          </Box>

          <TextField
            placeholder="¿Alguna instrucción especial? (opcional)"
            multiline
            rows={3}
            value={form.notes}
            onChange={e => handleChange("notes", e.target.value)}
            fullWidth
          />
        </Paper>

        {/* 3. MÉTODO DE PAGO */}
        <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, borderRadius: 2 }}>
          <Box display="flex" alignItems="center" gap={1.5} mb={2}>
            <Icons.Payment />
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
                border: form.paymentMethod === "cash" ? '2px solid #4caf50' : '1px solid #e0e0e0',
                bgcolor: form.paymentMethod === "cash" ? '#f1f8f4' : 'white',
                transition: "all 0.2s",
                "&:hover": { 
                  borderColor: "#4caf50",
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
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
                        borderRadius: '50%',
                        bgcolor: '#4caf50',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 'bold'
                      }}
                    >
                      ✓
                    </Box>
                  )}
                </Box>
              </CardContent>
            </Card>

            <Card
              onClick={() => handleChange("paymentMethod", "transfer")}
              sx={{
                flex: 1,
                cursor: "pointer",
                border: form.paymentMethod === "transfer" ? '2px solid #2196f3' : '1px solid #e0e0e0',
                bgcolor: form.paymentMethod === "transfer" ? '#e3f2fd' : 'white',
                transition: "all 0.2s",
                "&:hover": { 
                  borderColor: "#2196f3",
                  transform: 'translateY(-2px)',
                  boxShadow: 2
                }
              }}
            >
              <CardContent sx={{ p: 1.5, '&:last-child': { pb: 1.5 } }}>
                <Box display="flex" alignItems="center" justifyContent="space-between">
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
                        borderRadius: '50%',
                        bgcolor: '#2196f3',
                        color: 'white',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: 12,
                        fontWeight: 'bold'
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
              <Typography variant="body2" fontWeight={600} mb={2} color="text.secondary">
                Realiza tu transferencia a:
              </Typography>
              
              {/* Tarjeta Bancaria Moderna */}
              <Box
                sx={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 3,
                  p: 3,
                  position: 'relative',
                  overflow: 'hidden',
                  boxShadow: '0 8px 16px rgba(102, 126, 234, 0.4)',
                  '&::before': {
                    content: '""',
                    position: 'absolute',
                    top: -50,
                    right: -50,
                    width: 150,
                    height: 150,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.1)',
                  },
                  '&::after': {
                    content: '""',
                    position: 'absolute',
                    bottom: -30,
                    left: -30,
                    width: 100,
                    height: 100,
                    borderRadius: '50%',
                    background: 'rgba(255, 255, 255, 0.05)',
                  }
                }}
              >
                {/* Chip y Logo */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box
                    sx={{
                      width: 50,
                      height: 40,
                      background: 'linear-gradient(135deg, #f6d365 0%, #fda085 100%)',
                      borderRadius: 1.5,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      position: 'relative',
                      zIndex: 1
                    }}
                  >
                    <Box
                      sx={{
                        width: 30,
                        height: 24,
                        border: '2px solid rgba(255,255,255,0.8)',
                        borderRadius: 0.5
                      }}
                    />
                  </Box>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, position: 'relative', zIndex: 1 }}>
                    BANK
                  </Typography>
                </Box>

                {/* Número de Cuenta */}
                <Box mb={3} position="relative" zIndex={1}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                    Número de Cuenta
                  </Typography>
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 600, letterSpacing: 2, fontFamily: 'monospace' }}>
                    4152 3138 7621 0043
                  </Typography>
                </Box>

                {/* CLABE */}
                <Box mb={3} position="relative" zIndex={1}>
                  <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.7rem', mb: 0.5, display: 'block' }}>
                    CLABE Interbancaria
                  </Typography>
                  <Typography variant="body2" sx={{ color: 'white', fontWeight: 600, letterSpacing: 1, fontFamily: 'monospace' }}>
                    012 345 678 901 234 567
                  </Typography>
                </Box>

                {/* Titular y Banco */}
                <Box display="flex" justifyContent="space-between" position="relative" zIndex={1}>
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', mb: 0.3, display: 'block' }}>
                      TITULAR
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                      Mi Negocio S.A. de C.V.
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.65rem', mb: 0.3, display: 'block' }}>
                      BANCO
                    </Typography>
                    <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
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
                    navigator.clipboard.writeText('4152313876210043');
                    alert('Número de cuenta copiado ✓');
                  }}
                  sx={{ flex: 1, textTransform: 'none' }}
                >
                  📋 Copiar Cuenta
                </Button>
                <Button
                  size="small"
                  variant="outlined"
                  onClick={() => {
                    navigator.clipboard.writeText('012345678901234567');
                    alert('CLABE copiada ✓');
                  }}
                  sx={{ flex: 1, textTransform: 'none' }}
                >
                  📋 Copiar CLABE
                </Button>
              </Box>

              {/* Mensaje informativo */}
              <Box
                mt={2}
                p={2}
                sx={{
                  bgcolor: '#fff3e0',
                  borderRadius: 2,
                  border: '1px solid #ffe0b2'
                }}
              >
                <Box display="flex" gap={1.5} alignItems="flex-start">
                  <Box sx={{ fontSize: 20, mt: 0.2 }}>ℹ️</Box>
                  <Box>
                    <Typography variant="body2" fontWeight={600} color="#e65100" gutterBottom>
                      Importante
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      Una vez realizada la transferencia, tu pedido será procesado. Por favor guarda tu comprobante de pago.
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Box>
          )}
        </Paper>

        {/* 4. DIRECCIÓN DE ENTREGA */}
        {orderType === "delivery" && (
          <Paper elevation={0} sx={{ border: '1px solid #e0e0e0', p: 3, borderRadius: 2 }}>
            <Box display="flex" alignItems="center" gap={1.5} mb={2}>
              <Icons.LocationOn />
              <Typography variant="subtitle1" fontWeight={600}>
                Dirección de entrega
              </Typography>
            </Box>

            {/* Segmented Control / Tabs */}
            <Box 
              sx={{ 
                display: 'flex',
                gap: 1,
                p: 0.5,
                bgcolor: '#f5f5f5',
                borderRadius: 2,
                mb: 3
              }}
            >
              <Box
                onClick={() => setAddressType("saved")}
                sx={{
                  flex: 1,
                  py: 1.5,
                  px: 2,
                  textAlign: 'center',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  bgcolor: addressType === "saved" ? 'white' : 'transparent',
                  boxShadow: addressType === "saved" ? 2 : 0,
                  '&:hover': {
                    bgcolor: addressType === "saved" ? 'white' : '#eeeeee'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight={addressType === "saved" ? 600 : 400}
                  color={addressType === "saved" ? 'primary' : 'text.secondary'}
                >
                  📍 Dirección guardada
                </Typography>
              </Box>
              
              <Box
                onClick={() => setAddressType("new")}
                sx={{
                  flex: 1,
                  py: 1.5,
                  px: 2,
                  textAlign: 'center',
                  borderRadius: 1.5,
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  bgcolor: addressType === "new" ? 'white' : 'transparent',
                  boxShadow: addressType === "new" ? 2 : 0,
                  '&:hover': {
                    bgcolor: addressType === "new" ? 'white' : '#eeeeee'
                  }
                }}
              >
                <Typography 
                  variant="body2" 
                  fontWeight={addressType === "new" ? 600 : 400}
                  color={addressType === "new" ? 'primary' : 'text.secondary'}
                >
                  ➕ Nueva dirección
                </Typography>
              </Box>
            </Box>

            {addressType === "saved" && (
              <Box mt={2}>
                <Select
                  value={form.userAddressId}
                  onChange={e => handleChange("userAddressId", e.target.value)}
                  fullWidth
                  displayEmpty
                  error={!!errors.userAddressId}
                  sx={{ bgcolor: "white" }}
                >
                  <MenuItem value="" disabled>
                    Selecciona una dirección
                  </MenuItem>
                  {addresses.map(addr => (
                    <MenuItem key={addr.id} value={addr.id}>
                      <Box>
                        <Typography variant="body2">
                          {addr.street} #{addr.number}
                        </Typography>
                        {addr.references && (
                          <Typography variant="caption" color="text.secondary">
                            {addr.references}
                          </Typography>
                        )}
                      </Box>
                    </MenuItem>
                  ))}
                </Select>
                {errors.userAddressId && (
                  <Typography variant="caption" color="error" sx={{ mt: 0.5, display: "block" }}>
                    {errors.userAddressId}
                  </Typography>
                )}
              </Box>
            )}

            {addressType === "new" && (
              <Stack spacing={2} mt={2}>
                <TextField
                  label="Calle"
                  value={form.newAddress.street}
                  onChange={e => handleNewAddressChange("street", e.target.value)}
                  fullWidth
                  required
                  error={!!errors.street}
                  helperText={errors.street}
                />
                <TextField
                  label="Número"
                  value={form.newAddress.number}
                  onChange={e => handleNewAddressChange("number", e.target.value)}
                  fullWidth
                  required
                  error={!!errors.number}
                  helperText={errors.number}
                />
                <TextField
                  label="Referencias (opcional)"
                  value={form.newAddress.references}
                  onChange={e => handleNewAddressChange("references", e.target.value)}
                  fullWidth
                  placeholder="Ej: Entre calles X y Y, portón azul"
                />
              </Stack>
            )}
          </Paper>
        )}

        <Typography variant="caption" color="text.secondary" textAlign="center">
          Al confirmar aceptas nuestros términos y condiciones
        </Typography>
      </Stack>
    </Box>
  );
}