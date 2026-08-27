const asList = (draft) => (Array.isArray(draft) ? draft : draft?.data);

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
  __optimistic: true,
});

export const makeOrderCreateOptimistic = (api) =>
  async (payload, { dispatch, queryFulfilled }) => {
    if (!payload?.userId) return;

    const tempId = `temp-${Date.now()}`;
    const optimisticOrder = buildOptimisticOrder(payload, tempId);
    const arg = { userId: payload.userId };

    const patchResult = dispatch(
      api.util.updateQueryData("getOrdersByUser", arg, (draft) => {
        const list = asList(draft);
        if (Array.isArray(list)) list.unshift(optimisticOrder);
      }),
    );

    try {
      const { data } = await queryFulfilled;
      dispatch(
        api.util.updateQueryData("getOrdersByUser", arg, (draft) => {
          const list = asList(draft);
          if (!Array.isArray(list)) return;
          const idx = list.findIndex((order) => order.id === tempId);
          if (idx !== -1) list[idx] = data;
          else list.unshift(data);
        }),
      );
    } catch {
      patchResult.undo();
    }
  };

export const makeOrderStatusOptimistic = (api) =>
  async ({ id, businessId, userId, body }, { dispatch, queryFulfilled }) => {
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
            const order = list.find((item) => item.id === id);
            if (order) order.status = status;
          }),
        ),
      );
    };

    patchList("getOrdersByBusiness", businessId ? { businessId } : null);
    patchList("getOrdersByUser", userId ? { userId } : null);

    try {
      await queryFulfilled;
    } catch {
      patches.forEach((patch) => patch.undo());
    }
  };
