import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Grid,
  Snackbar,
  Typography,
} from "@mui/material";
import { Restaurant } from "@mui/icons-material";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useOrders } from "@Features/orders/context/useOrders";
import CustomerOrderCard from "@Features/orders/components/customer/CustomerOrderCard";
import EditPendingOrderDialog from "@Features/orders/components/customer/EditPendingOrderDialog";

export default function MyOrders() {
  const { user } = useAuth();
  const { getOrdersByUser, cancelOrder, editPendingOrder, loading, refreshOrders } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);
  const [cancelOrderId, setCancelOrderId] = useState(null);
  const [feedback, setFeedback] = useState({ open: false, message: "", severity: "success" });

  const userOrders = getOrdersByUser(user?.id);

  const showFeedback = (message, severity = "success") => {
    setFeedback({ open: true, message, severity });
  };

  useEffect(() => {
    if (!editingOrder) return;
    const current = userOrders.find((order) => String(order.id) === String(editingOrder.id));
    if (!current) return;

    const statusChanged = current.status !== "pending";
    const versionChanged = Number(current.version) !== Number(editingOrder.version);

    if (statusChanged || versionChanged) {
      setEditingOrder(null);
      showFeedback(
        statusChanged
          ? "La orden cambió de estado y quedó bloqueada para edición."
          : "La orden fue modificada en otra sesión. Se cargó la versión más reciente.",
        "warning",
      );
    }
  }, [userOrders, editingOrder]);

  const handleCancel = async () => {
    if (!cancelOrderId) return;
    const result = await cancelOrder(cancelOrderId);
    setCancelOrderId(null);
    if (result?.success) {
      showFeedback("Orden cancelada", "success");
    } else {
      showFeedback(result?.error || "No fue posible cancelar la orden", "error");
    }
  };

  const handleSaveEdit = async (items) => {
    if (!editingOrder) return;
    const result = await editPendingOrder(editingOrder.id, items, editingOrder.version);

    if (result.success) {
      setEditingOrder(null);
      showFeedback("Orden actualizada", "success");
      return;
    }

    if (Number(result.status) === 409) {
      setEditingOrder(null);
      await refreshOrders();
      showFeedback(
        "La orden cambió mientras la editabas. Se cargó la versión más reciente y tus cambios no sobrescribieron los nuevos datos.",
        "warning",
      );
      return;
    }

    showFeedback(result.error || "No fue posible modificar la orden", "error");
  };

  if (userOrders.length === 0) {
    return (
      <GeneralContent title="Mis Órdenes">
        <Box sx={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "60vh", textAlign: "center", px: 3 }}>
          <Restaurant sx={{ fontSize: 80, color: "text.disabled", mb: 2 }} />
          <Typography variant="h5" gutterBottom>No tienes órdenes</Typography>
          <Typography color="text.secondary">Realiza tu primer pedido y aparecerá aquí</Typography>
        </Box>
      </GeneralContent>
    );
  }

  return (
    <GeneralContent title="Mis Órdenes">
      <Box sx={{ maxWidth: 1200, mx: "auto", py: { xs: 2, sm: 4 }, px: { xs: 1.5, sm: 2.5 } }}>
        <Grid container spacing={{ xs: 1.5, sm: 2 }} justifyContent="center" alignItems="flex-start">
          {userOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <CustomerOrderCard
                order={order}
                expanded={expandedOrder === order.id}
                historyExpanded={expandedHistory === order.id}
                onToggle={() => setExpandedOrder((current) => current === order.id ? null : order.id)}
                onToggleHistory={() => setExpandedHistory((current) => current === order.id ? null : order.id)}
                onCancel={() => setCancelOrderId(order.id)}
                onEdit={() => setEditingOrder({ ...order })}
              />
            </Grid>
          ))}
        </Grid>
      </Box>

      <EditPendingOrderDialog
        open={Boolean(editingOrder)}
        order={editingOrder}
        onClose={() => setEditingOrder(null)}
        onSave={handleSaveEdit}
        saving={loading}
      />

      <Dialog open={Boolean(cancelOrderId)} onClose={() => setCancelOrderId(null)} maxWidth="xs" fullWidth PaperProps={{ sx: { borderRadius: 3.5 } }}>
        <DialogTitle sx={{ fontWeight: 900 }}>Cancelar orden</DialogTitle>
        <DialogContent>
          <Typography color="text.secondary">
            ¿Seguro que quieres cancelar esta orden? Esta acción solo está disponible mientras siga pendiente.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setCancelOrderId(null)} sx={{ textTransform: "none" }}>Conservar orden</Button>
          <Button color="error" variant="contained" disableElevation onClick={handleCancel} sx={{ textTransform: "none", borderRadius: 999, px: 2.25 }}>
            Sí, cancelar
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={feedback.open}
        autoHideDuration={4200}
        onClose={() => setFeedback((current) => ({ ...current, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity={feedback.severity}
          variant="filled"
          onClose={() => setFeedback((current) => ({ ...current, open: false }))}
          sx={{ borderRadius: 2.5, boxShadow: "0 12px 34px rgba(0,0,0,.16)" }}
        >
          {feedback.message}
        </Alert>
      </Snackbar>
    </GeneralContent>
  );
}
