import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { Alert, Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, IconButton, InputLabel, MenuItem, Paper, Select, Stack, TextField, Tooltip, Typography } from "@mui/material";
import { AddRounded, Cancel, ContentCopy, DeleteOutlineRounded, ExitToApp, Refresh, RemoveRounded, Send } from "@mui/icons-material";
import { QRCode } from "antd";
import { useDispatch } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useSocketEvent } from "@Shared/hooks/useSocket";
import { api } from "@Shared/api/rtk/api";
import OrderProductList from "@Features/orders/components/items/OrderProductList";
import { useCancelSharedOrderMutation, useDeleteSharedOrderItemMutation, useGetSharedOrderQuery, useJoinSharedOrderByTokenMutation, useLeaveSharedOrderMutation, useRotateSharedOrderInviteMutation, useSubmitSharedOrderMutation, useUpdateSharedOrderItemMutation } from "../api/sharedOrders.api";
import { createCheckoutDraft, sharedOrderError } from "../model/sharedOrder";
import { writeOrderTarget } from "../hooks/useOrderTarget";

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
  const dispatch = useDispatch();
  const { user } = useAuth();
  const [joinedSessionId, setJoinedSessionId] = useState(null);
  const sessionId = id || sessionIdOverride || joinedSessionId;
  const [notice, setNotice] = useState("");
  const [error, setError] = useState("");
  const [secrets, setSecrets] = useState(() => {
    if (!id) return null;
    try { return JSON.parse(window.sessionStorage.getItem(`shared-order-secrets:${id}`)); } catch { return null; }
  });
  const [checkout, setCheckout] = useState({});
  const [itemToRemove, setItemToRemove] = useState(null);
  const [joinToken] = useJoinSharedOrderByTokenMutation();
  const { data: session, isLoading, refetch } = useGetSharedOrderQuery(sessionId, { skip: !sessionId });
  const [updateItem] = useUpdateSharedOrderItemMutation();
  const [deleteItem] = useDeleteSharedOrderItemMutation();
  const [rotateInvite] = useRotateSharedOrderInviteMutation();
  const [leave] = useLeaveSharedOrderMutation();
  const [cancel] = useCancelSharedOrderMutation();
  const [submit, submitState] = useSubmitSharedOrderMutation();

  useEffect(() => {
    if (!token || sessionId) return;
    joinToken(token).unwrap().then((joined) => { writeOrderTarget("shared"); setJoinedSessionId(joined.id); navigate(`/orden-compartida/${joined.id}`, { replace: true }); }).catch((requestError) => setError(sharedOrderError(requestError, "El enlace ya no es válido")));
  }, [joinToken, navigate, sessionId, token]);
  useSocketEvent("shared-order:updated", (payload) => {
    refetch();
    if (payload?.reason === "submitted") dispatch(api.util.invalidateTags([{ type: "Orders", id: "LIST" }]));
  }, { enabled: Boolean(sessionId), room: { type: "shared-order", id: sessionId } });

  const defaultCheckout = createCheckoutDraft(session?.businesses || [], user);
  const checkoutFor = (businessId) => ({ ...defaultCheckout[businessId], ...checkout[businessId] });
  const shareLink = secrets?.token ? `${window.location.origin}/orden-compartida/unirse/${secrets.token}` : "";
  const act = async (operation, successMessage) => { setError(""); try { const result = await operation(); if (successMessage) setNotice(successMessage); return result; } catch (requestError) { setError(sharedOrderError(requestError)); return null; } };

  const changeQuantity = (item, delta) => act(() => updateItem({ id: session.id, itemId: item.id, quantity: item.quantity + delta, note: item.note || "", modifiers: item.modifiers || [], expectedVersion: session.version }).unwrap());
  const remove = async () => {
    if (!itemToRemove) return;
    const updated = await act(
      () => deleteItem({ id: session.id, itemId: itemToRemove.id, expectedVersion: session.version }).unwrap(),
      "Producto eliminado de tu selección.",
    );
    if (updated) setItemToRemove(null);
  };
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
        <Box><Typography variant="h5">{session.title}</Typography><Typography color="text.secondary">Tú eres <Typography component="span" sx={{ fontWeight: 700 }}>{session.self.label}</Typography> · {session.participants.length} participante(s)</Typography></Box>
        {session.status === "open" && <Button startIcon={session.isHost ? <Cancel /> : <ExitToApp />} color="inherit" onClick={exitSession}>{session.isHost ? "Cerrar grupo" : "Salir del grupo"}</Button>}
      </Stack></Paper>

      {session.isHost && session.status === "open" && <Paper variant="outlined" sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="h6">Invitar al grupo</Typography><Stack direction={{ xs: "column", sm: "row" }} gap={3} alignItems="center" sx={{ mt: 2 }}><QRCode value={shareLink || "Invitación protegida"} size={150} /><Box sx={{ flex: 1 }}><Typography variant="overline">Código</Typography><Typography variant="h3" sx={{ letterSpacing: 5 }}>{secrets?.code || "••••••"}</Typography><Stack direction="row" gap={1} flexWrap="wrap"><Button size="small" disabled={!shareLink} startIcon={<ContentCopy />} onClick={() => navigator.clipboard.writeText(shareLink)}>Copiar enlace</Button><Button size="small" startIcon={<Refresh />} onClick={rotate}>Nueva invitación</Button></Stack>{!secrets && <Typography variant="caption" color="text.secondary">Por seguridad el código sólo se muestra al crearlo. Genera una nueva invitación si lo necesitas.</Typography>}</Box></Stack></Paper>}

      {session.status === "open" && <Paper variant="outlined" sx={{ p: { xs: 1.75, sm: 2.5 }, borderRadius: 3, bgcolor: "rgba(255,75,69,.025)" }}><Typography variant="subtitle1" fontWeight={850}>Agrega desde el menú</Typography><Typography variant="body2" color="text.secondary">En Explorar, cada producto se añadirá directamente a {session.self.label}. Si prefieres un pedido aparte, cambia a “Pedido individual”.</Typography></Paper>}

      <Paper sx={{ p: { xs: 1.5, sm: 2.5 }, borderRadius: 3 }}>
        <Box sx={{ mb: 1.5 }}><Typography variant="h6">Productos del grupo</Typography><Typography variant="body2" color="text.secondary">Cada selección conserva juntos los productos que deben entregarse.</Typography></Box>
        <OrderProductList
          items={session.items}
          groupBySelection
          total={session.grandTotal}
          emptyMessage="Todavía no hay productos en esta orden compartida."
          getMeta={(item) => `${item.businessName} · Agregado por ${item.participantName || "Participante"}`}
          renderActions={(item) => item.mine && session.status === "open" ? <Stack direction="row" spacing={0.75} alignItems="center" justifyContent="flex-end" sx={{ width: { xs: "100%", sm: "auto" } }}><Stack direction="row" alignItems="center" sx={{ border: "1px solid", borderColor: "divider", borderRadius: 999, bgcolor: "background.paper", p: 0.25 }}><IconButton aria-label={`Quitar una unidad de ${item.name}`} size="small" disabled={item.quantity <= 1} onClick={() => changeQuantity(item, -1)} sx={{ width: { xs: 32, sm: 34 }, height: { xs: 32, sm: 34 } }}><RemoveRounded fontSize="small" /></IconButton><Typography variant="caption" fontWeight={900} sx={{ minWidth: 26, textAlign: "center" }}>{item.quantity}</Typography><IconButton aria-label={`Agregar una unidad de ${item.name}`} size="small" color="primary" onClick={() => changeQuantity(item, 1)} sx={{ width: { xs: 32, sm: 34 }, height: { xs: 32, sm: 34 } }}><AddRounded fontSize="small" /></IconButton></Stack><Tooltip title="Quitar de mi selección"><IconButton aria-label={`Quitar ${item.name} de mi selección`} color="error" size="small" onClick={() => setItemToRemove(item)} sx={{ width: { xs: 34, sm: 38 }, height: { xs: 34, sm: 38 }, bgcolor: "rgba(211,47,47,.07)", "&:hover": { bgcolor: "rgba(211,47,47,.13)" } }}><DeleteOutlineRounded fontSize="small" /></IconButton></Tooltip></Stack> : null}
        />
      </Paper>

      {session.isHost && session.status === "open" && session.businesses.length > 0 && <Paper sx={{ p: 2.5, borderRadius: 3 }}><Typography variant="h6">Crear órdenes por negocio</Typography><Typography color="text.secondary" sx={{ mb: 2 }}>Cada negocio recibirá únicamente sus productos.</Typography><Stack gap={2}>{session.businesses.map((business) => { const config = checkoutFor(business.id); const methods = business.paymentMethods.filter((entry) => entry.active); return <Paper key={business.id} variant="outlined" sx={{ p: 2 }}><Typography sx={{ fontWeight: 700, mb: 1.5 }}>{business.name}</Typography><Stack direction={{ xs: "column", sm: "row" }} gap={2}><FormControl fullWidth><InputLabel>Entrega</InputLabel><Select label="Entrega" value={config.orderType || "pickup"} onChange={(event) => updateCheckout(business.id, "orderType", event.target.value)}><MenuItem value="pickup">Recoger en tienda</MenuItem><MenuItem value="delivery">Delivery</MenuItem></Select></FormControl><FormControl fullWidth><InputLabel>Pago</InputLabel><Select label="Pago" value={config.paymentMethod || ""} onChange={(event) => updateCheckout(business.id, "paymentMethod", event.target.value)}>{methods.map(({ method }) => <MenuItem key={method} value={method}>{methodLabel[method] || method}</MenuItem>)}</Select></FormControl></Stack>{config.orderType === "delivery" && <TextField fullWidth label="Dirección de entrega" value={config.deliveryAddress === "Recoger en tienda" ? "" : config.deliveryAddress || ""} onChange={(event) => updateCheckout(business.id, "deliveryAddress", event.target.value)} sx={{ mt: 2 }} />}</Paper>; })}<TextField label="Teléfono de contacto" value={checkoutFor(session.businesses[0].id).customerPhone || ""} onChange={(event) => setCheckout((current) => Object.fromEntries(session.businesses.map((business) => [business.id, { ...defaultCheckout[business.id], ...current[business.id], customerPhone: event.target.value }])))}/><Button size="large" variant="contained" startIcon={<Send />} disabled={submitState.isLoading} onClick={finish}>Confirmar y crear {session.businesses.length} orden(es)</Button></Stack></Paper>}
    </Stack></Box>
    <Dialog open={Boolean(itemToRemove)} onClose={() => setItemToRemove(null)} fullWidth maxWidth="xs">
      <DialogTitle>Quitar producto</DialogTitle>
      <DialogContent><Typography>¿Quieres quitar <strong>{itemToRemove?.name}</strong> de {itemToRemove?.participantLabel || "tu selección"}? Los demás productos no cambiarán.</Typography></DialogContent>
      <DialogActions><Button color="inherit" onClick={() => setItemToRemove(null)}>Conservar</Button><Button color="error" variant="contained" onClick={remove}>Sí, quitar</Button></DialogActions>
    </Dialog>
  </SharedOrderShell>;
}

SharedOrderPage.propTypes = {
  embedded: PropTypes.bool,
  sessionIdOverride: PropTypes.string,
};
