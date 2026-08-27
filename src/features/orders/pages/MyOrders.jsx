import { useState } from "react";
import { Box, Grid, Typography } from "@mui/material";
import { Restaurant } from "@mui/icons-material";
import GeneralContent from "@Shared/components/layout/GeneralContent";
import { useAuth } from "@Features/auth/context/AuthContext";
import { useOrders } from "@Features/orders/context/OrderContext";
import CustomerOrderCard from "@Features/orders/components/customer/CustomerOrderCard";
import EditPendingOrderDialog from "@Features/orders/components/customer/EditPendingOrderDialog";

export default function MyOrders() {
  const { user } = useAuth();
  const { getOrdersByUser, cancelOrder, editPendingOrder, loading } = useOrders();
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [expandedHistory, setExpandedHistory] = useState(null);
  const [editingOrder, setEditingOrder] = useState(null);

  const userOrders = getOrdersByUser(user?.id);

  const handleCancel = async (orderId) => {
    if (!window.confirm("¿Estás seguro de cancelar esta orden?")) return;
    await cancelOrder(orderId);
  };

  const handleSaveEdit = async (items) => {
    if (!editingOrder) return;
    const result = await editPendingOrder(editingOrder.id, items);
    if (result.success) setEditingOrder(null);
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
      <Box sx={{ maxWidth: 1200, mx: "auto", mt: { xs: 2, sm: 4 }, px: 2 }}>
        <Grid container spacing={1} justifyContent="center">
          {userOrders.map((order) => (
            <Grid item xs={12} sm={6} md={4} key={order.id}>
              <CustomerOrderCard
                order={order}
                expanded={expandedOrder === order.id}
                historyExpanded={expandedHistory === order.id}
                onToggle={() => setExpandedOrder((current) => current === order.id ? null : order.id)}
                onToggleHistory={() => setExpandedHistory((current) => current === order.id ? null : order.id)}
                onCancel={() => handleCancel(order.id)}
                onEdit={() => setEditingOrder(order)}
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
    </GeneralContent>
  );
}
