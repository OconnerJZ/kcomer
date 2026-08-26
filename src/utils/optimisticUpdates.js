// src/utils/optimisticUpdates.js
//
// Optimistic updates apuntados a las listas que las vistas REALMENTE consumen:
//   - getOrdersByUser({ userId })      → "Mis órdenes" (cliente)
//   - getOrdersByBusiness({ businessId }) → dashboard (owner)
//
// Cada handler es una factory (api) => onQueryStarted, para poder ligarlo al
// `api` en orders.api.js. Pintan al instante; los tags (invalidatesTags)
// reconcilian con el server al confirmar y revierten si falla.
//
// La forma del item replica OrderController.formatOrder del backend.

// Obtiene el array real del cache, tolerando [...] o { data: [...] }.
const asList = (draft) => (Array.isArray(draft) ? draft : draft?.data);

// Construye una orden con la forma de formatOrder a partir del payload de creación.
const buildOptimisticOrder = (payload, tempId) => ({
  id: tempId,
  userId: payload.userId,
  businessId: payload.businessId,
  businessName: payload.businessName,
  customerName: payload.customerName,
  customerPhone: payload.customerPhone,
  status: "pending",
  deliveryStatus: "unassigned",
  deliveryAddress: payload.deliveryAddress,
  notes: payload.notes,
  total: Number(payload.total) || 0,
  items: (payload.items || []).map((it) => ({
    id: it.id,
    name: it.name,
    quantity: it.quantity,
    price: Number(it.price) || 0,
    subtotal: (Number(it.price) || 0) * (it.quantity || 0),
    note: it.note || null,
  })),
  statusHistory: [],
  createdAt: new Date().toISOString(),
  __optimistic: true, // útil para spinners/estilos mientras confirma el server
});

/**
 * Crear orden: inserta un temporal al inicio de getOrdersByUser({ userId }).
 * Al confirmar reemplaza el temporal por la orden real; si falla, revierte.
 * (El owner recibe la orden por socket "order:new", no por esta caché.)
 */
export const makeOrderCreateOptimistic = (api) => {
  return async (payload, { dispatch, queryFulfilled }) => {
    if (!payload?.userId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticOrder = buildOptimisticOrder(payload, tempId);
    const arg = { userId: payload.userId };

    const patchResult = dispatch(
      api.util.updateQueryData("getOrdersByUser", arg, (draft) => {
        const list = asList(draft);
        if (Array.isArray(list)) list.unshift(optimisticOrder);
      })
    );

    try {
      const { data } = await queryFulfilled; // orden real formateada del server
      dispatch(
        api.util.updateQueryData("getOrdersByUser", arg, (draft) => {
          const list = asList(draft);
          if (!Array.isArray(list)) return;
          const idx = list.findIndex((o) => o.id === tempId);
          if (idx !== -1) list[idx] = data;
          else list.unshift(data);
        })
      );
    } catch {
      patchResult.undo();
    }
  };
};

/**
 * Cambiar estado: setea `status` en la orden correspondiente, en la lista del
 * negocio (owner) y/o del usuario (cliente cancelando), según qué id venga.
 * El backend responde sólo { orderId, status }, así que NO sobrescribimos el
 * item completo; los tags refetchean para reconciliar el resto.
 */
export const makeOrderStatusOptimistic = (api) => {
  return async (
    { id, businessId, userId, body },
    { dispatch, queryFulfilled }
  ) => {
    const status = body?.status;
    if (!status) return;

    const patches = [];

    const patchList = (endpoint, arg) => {
      if (!arg) return;
      patches.push(
        dispatch(
          api.util.updateQueryData(endpoint, arg, (draft) => {
            const list = asList(draft);
            if (!Array.isArray(list)) return;
            const order = list.find((o) => o.id === id);
            if (order) order.status = status;
          })
        )
      );
    };

    patchList("getOrdersByBusiness", businessId ? { businessId } : null);
    patchList("getOrdersByUser", userId ? { userId } : null);

    try {
      await queryFulfilled;
    } catch {
      patches.forEach((p) => p.undo());
    }
  };
};