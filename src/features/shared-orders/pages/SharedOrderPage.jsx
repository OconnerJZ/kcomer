import { useEffect, useMemo, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Button, Chip, CircularProgress, Divider, FormControl, InputLabel, MenuItem, Paper, Select, Stack, TextField, Typography } from "@mui/material";
import { AddShoppingCart, Cancel, ContentCopy, ExitToApp, Refresh, Send } from "@mui/icons-material";
import { QRCode } from "antd";
import { useNavigate, useParams } from "react-router-dom";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useCart } from "@Features/cart/context/CartContext";
import { useSocketEvent } from "@Shared/hooks/useSocket";
import { useAddSharedOrderItemsMutation, useCancelSharedOrderMutation, useDeleteSharedOrderItemMutation, useGetSharedOrderQuery, useJoinSharedOrderByTokenMutation, useLeaveSharedOrderMutation, useRotateSharedOrderInviteMutation, useSubmitSharedOrderMutation, useUpdateSharedOrderItemMutation } from "../api/sharedOrders.api";
import { createCheckoutDraft, flattenCartForSharedOrder, sharedOrderError } from "../model/sharedOrder";

const methodLabel = { cash: "Efectivo", transfer: "Transferencia", card: "Tarjeta", wallet: "Wallet" };

const SharedOrderShell = ({ embedded, title, children }) => embedded
  ? children
  : <GeneralContent title={title}>{children}</GeneralContent>;

SharedOrderShell.propTypes = {
  embedded: PropTypes.bool,
  title: PropTypes.string,
  children: PropTypes.node.isRequired,
};

export default function SharedOrderPage({ embedded = false, sessionIdOverride = null }) {
  const { id, token } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { cart, clearAll } = useCart();
  const [joinedSessionId, setJoinedSessionId] = useState(null);
  const sessionId = id || sessionIdOverride || joinedSessionId;
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [secrets, setSecrets] = useState(() => {
    if (!id) return null;
    try { return JSON.parse(window.sessionStorage.getItem(`shared-order-secrets:${id}`)); } catch { return null; }
  });
  const [checkout, setCheckout] = useState({});
  const [joinToken] = useJoinSharedOrderByTokenMutation();
  const { data: session, isLoading, refetch } = useGetSharedOrderQuery(sessionId, { skip: !sessionId });
  const [addItems, addState] = useAddSharedOrderItemsMutation();
  const [updateItem] = useUpdateSharedOrderItemMutation();
  const [deleteItem] = useDeleteSharedOrderItemMutation();
  const [rotateInvite] = useRotateSharedOrderInviteMutation();
  const [leave] = useLeaveSharedOrderMutation();
  const [cancel] = useCancelSharedOrderMutation();
  const [submit, submitState] = useSubmitSharedOrderMutation();

  useEffect(() => {
    if (!token || sessionId) return;
    joinToken(token).unwrap().then((joined) => { setJoinedSessionId(joined.id); navigate(`/orden-compartida/${joined.id}`, { replace: true }); }).catch((requestError) => setError(sharedOrderError(requestError, "El enlace ya no es válido")));
  }, [joinToken, navigate, sessionId, token]);
  useSocketEvent("shared-order:updated", () => refetch(), { enabled: Boolean(sessionId), room: { type: "shared-order", id: sessionId } });

  const cartItems = useMemo(() => flattenCartForSharedOrder(cart), [cart]);
  const defaultCheckout = createCheckoutDraft(session?.businesses || [], user);
  const checkoutFor = (businessId) => ({ ...defaultCheckout[businessId], ...checkout[businessId] });
  const shareLink = secrets?.token ? `${window.location.origin}/orden-compartida/unirse/${secrets.token}` : "";
  const act = async (operation, successMessage) => { setError(""); try { const result = await operation(); if (successMessage) setNotice(successMessage); return result; } catch (requestError) { setError(sharedOrderError(requestError)); return null; } };

  const importCart = async () => {
    if (!cartItems.length || !session) return;
    const updated = await act(() => addItems({ id: session.id, items: cartItems, expectedVersion: session.version }).unwrap());
    if (!updated) return;
    clearAll(); setNotice("Tu carrito se agregó a la orden compartida"); refetch();
  };
  const changeQuantity = (item, delta) => act(() => updateItem({ id: session.id, itemId: item.id, quantity: item.quantity + delta, note: item.note || "", modifiers: item.modifiers || [], expectedVersion: session.version }).unwrap());
  const remove = (item) => act(() => deleteItem({ id: session.id, itemId: item.id, expectedVersion: session.version }).unwrap());
  const rotate = async () => {
    const result = await act(() => rotateInvite({ id: session.id, expectedVersion: session.version, codeLength: secrets?.code?.length === 4 ? 4 : 6 }).unwrap(), "Se generó una invitación nueva");
    if (result?.secrets) { setSecrets(result.secrets); window.sessionStorage.setItem(`shared-order-secrets:${session.id}`, JSON.stringify(result.secrets)); }
  };
  const updateCheckout = (businessId, field, value) => setCheckout((current) => ({ ...current, [businessId]: { ...defaultCheckout[businessId], ...current[businessId], [field]: value, ...(field === "orderType" && value === "pickup" ? { deliveryAddress: "Recoger en tienda" } : {}) } }));
  const finish = async () => {
    const configs = session.businesses.map(({ id: businessId }) => checkoutFor(businessId));
    if (configs.some((config) => config?.orderType === "delivery" && !config.deliveryAddress?.trim())) { setError("Escribe la dirección de entrega para cada negocio con delivery"); return; }
    const result = await act(() => submit({ id: session.id, expectedVersion: session.version, checkout: configs }).unwrap(), "Las órdenes fueron creadas");
    if (result) navigate("/mis-ordenes");
  };

  const exitSession = async () => {
    const result = await act(() => session.isHost
      ? cancel({ id: session.id, expectedVersion: session.version }).unwrap()
      : leave({ id: session.id, expectedVersion: session.version }).unwrap());
    if (result && !embedded) navigate("/orden");
  };

  if (!sessionId || isLoading) return <SharedOrderShell embedded={embedded} title="Orden compartida"><Box sx={{ py: 8, textAlign: "center" }}><CircularProgress /></Box></SharedOrderShell>;
  if (!session) return <SharedOrderShell embedded={embedded} title="Orden compartida"><Alert severity="error">{error || "No se pudo abrir la orden compartida"}</Alert></SharedOrderShell>;

  return <SharedOrderShell embedded={embedded} title={session.title}>
    <Box sx={{ maxWidth: 920, mx: "auto", px: 2, pb: 6 }}><Stack gap={2}>
      {error && <Alert severity="error" onClose={() => setError("")}>{error}</Alert>}{notice && <Alert severity="success" onClose={() => setNotice("")}>{notice}</Alert>}
      <Paper sx={{ p: 2.5, borderRadius: 3 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" gap={2}>
        <Box><Stack direction="row" gap={1} alignItems="center"><Typography variant="h5">{session.title}</Typography><Chip size="small" label={session.status === "open" ? "Abierta" : "Cerrada"} color={session.status === "open" ? "success" : "default"} /></Stack><Typography color="text.secondary">Tú eres <Typography component="span" sx={{ fontWeight: 700 }}>{session.self.label}</Typography> · {session.participants.length} participante(s)</Typography></Box>
        {session.status === "open" && <Button startIcon={session.isHost ? <Cancel /> : <ExitToApp />} color="inherit" onClick={exitSession}>{session.isHost ? "Cerrar grupo" : "Salir del grupo"}</Button>}
      </Stack></Paper>

      {session.isHost && session.status === "open" && <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="h6">Invitar al grupo</Typography><Stack direction={{ xs: "column", sm: "row" }} gap={3} alignItems="center" sx={{ mt: 2 }}><QRCode value={shareLink || "Invitación protegida"} size={150} /><Box sx={{ flex: 1 }}><Typography variant="overline">Código</Typography><Typography variant="h3" sx={{ letterSpacing: 5 }}>{secrets?.code || "••••••"}</Typography><Stack direction="row" gap={1} flexWrap="wrap"><Button size="small" disabled={!shareLink} startIcon={<ContentCopy />} onClick={() => navigator.clipboard.writeText(shareLink)}>Copiar enlace</Button><Button size="small" startIcon={<Refresh />} onClick={rotate}>Nueva invitación</Button></Stack>{!secrets && <Typography variant="caption" color="text.secondary">Por seguridad el código sólo se muestra al crearlo. Genera una nueva invitación si lo necesitas.</Typography>}</Box></Stack></Paper>}

      {session.status === "open" && <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}><Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "center" }} gap={1}><Box><Typography variant="h6">Mi selección compartida</Typography><Typography color="text.secondary">{cartItems.length ? `${cartItems.length} producto(s) listos para sumar al grupo` : "Ve a Explorar, elige tus productos y vuelve aquí."}</Typography></Box><Button variant="contained" startIcon={<AddShoppingCart />} disabled={!cartItems.length || addState.isLoading} onClick={importCart}>Sumar a la orden</Button></Stack></Paper>}

      <Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="h6">Productos del grupo</Typography>{!session.items.length ? <Typography color="text.secondary" sx={{ py: 3 }}>Todavía no hay productos.</Typography> : <Stack divider={<Divider flexItem />} sx={{ mt: 1 }}>{session.items.map((item) => <Stack key={item.id} direction="row" gap={2} alignItems="center" sx={{ py: 1.5 }}><Box sx={{ flex: 1 }}><Typography>{item.quantity} × {item.name}</Typography><Typography variant="caption" color="text.secondary">{item.businessName} · {item.participantLabel}</Typography>{item.note && <Typography variant="body2">{item.note}</Typography>}</Box><Typography sx={{ fontWeight: 700 }}>${item.subtotal.toFixed(2)}</Typography>{item.mine && session.status === "open" && <Stack direction="row"><Button size="small" disabled={item.quantity <= 1} onClick={() => changeQuantity(item, -1)}>−</Button><Button size="small" onClick={() => changeQuantity(item, 1)}>+</Button><Button size="small" color="error" onClick={() => remove(item)}>Quitar</Button></Stack>}</Stack>)}</Stack>}<Divider sx={{ my: 2 }} /><Stack direction="row" justifyContent="space-between"><Typography variant="h6">Total del grupo</Typography><Typography variant="h6" color="success.main">${session.grandTotal.toFixed(2)}</Typography></Stack></Paper>

      {session.isHost && session.status === "open" && session.businesses.length > 0 && <Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="h6">Crear órdenes por negocio</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Cada negocio recibirá únicamente sus productos.</Typography><Stack gap={2}>{session.businesses.map((business) => { const config = checkoutFor(business.id); const methods = business.paymentMethods.filter((entry) => entry.active); return <Paper key={business.id} variant="outlined" sx={{ p: 2 }}><Typography sx={{ fontWeight: 700, mb: 1.5 }}>{business.name}</Typography><Stack direction={{ xs: "column", sm: "row" }} gap={2}><FormControl fullWidth><InputLabel>Entrega</InputLabel><Select label="Entrega" value={config.orderType || "pickup"} onChange={(event) => updateCheckout(business.id, "orderType", event.target.value)}><MenuItem value="pickup">Recoger en tienda</MenuItem><MenuItem value="delivery">Delivery</MenuItem></Select></FormControl><FormControl fullWidth><InputLabel>Pago</InputLabel><Select label="Pago" value={config.paymentMethod || ""} onChange={(event) => updateCheckout(business.id, "paymentMethod", event.target.value)}>{methods.map(({ method }) => <MenuItem key={method} value={method}>{methodLabel[method] || method}</MenuItem>)}</Select></FormControl></Stack>{config.orderType === "delivery" && <TextField fullWidth label="Dirección de entrega" value={config.deliveryAddress === "Recoger en tienda" ? "" : config.deliveryAddress || ""} onChange={(event) => updateCheckout(business.id, "deliveryAddress", event.target.value)} sx={{ mt: 2 }} />}</Paper>; })}<TextField label="Teléfono de contacto" value={checkoutFor(session.businesses[0].id).customerPhone || ""} onChange={(event) => setCheckout((current) => Object.fromEntries(session.businesses.map((business) => [business.id, { ...defaultCheckout[business.id], ...current[business.id], customerPhone: event.target.value }])))}/><Button size="large" variant="contained" startIcon={<Send />} disabled={submitState.isLoading} onClick={finish}>Confirmar y crear {session.businesses.length} orden(es)</Button></Stack></Paper>}
    </Stack></Box>
  </SharedOrderShell>;
}

SharedOrderPage.propTypes = {
  embedded: PropTypes.bool,
  sessionIdOverride: PropTypes.string,
};
