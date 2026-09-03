export const createRealtimeScope = ({ businessIds = [], role } = {}) => {
  const normalizedBusinessIds = [...new Set(businessIds.map(String))];

  return {
    businessIds: normalizedBusinessIds,
    businessIdsKey: normalizedBusinessIds.join("|"),
    hasBusinessScope: normalizedBusinessIds.length > 0 || role === "admin",
  };
};

export const getBusinessRoomChanges = (joinedBusinessIds, businessIds) => {
  const joinedIds = new Set([...joinedBusinessIds].map(String));
  const targetIds = new Set(businessIds.map(String));

  return {
    businessIdsToJoin: [...targetIds].filter((businessId) => !joinedIds.has(businessId)),
    businessIdsToLeave: [...joinedIds].filter((businessId) => !targetIds.has(businessId)),
  };
};

export const createBusinessAccessNotification = (payload = {}) => {
  const businessId = String(payload?.businessId || "");
  if (!businessId) return null;

  return {
    businessId,
    revoked: Boolean(payload.revoked),
    title: payload.revoked ? "Acceso actualizado" : "Permisos actualizados",
    body: payload.revoked
      ? "Tu acceso a un negocio fue retirado."
      : "Tus permisos del negocio cambiaron.",
  };
};
