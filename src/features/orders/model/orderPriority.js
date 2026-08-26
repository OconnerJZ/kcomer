const ACTIVE_STATUSES = ["pending", "accepted", "preparing", "ready", "in_delivery"];

const FALLBACK_TARGET_MINUTES = {
  pending: 8,
  accepted: 12,
  preparing: 25,
  ready: 35,
  in_delivery: 55,
};

const parseDate = (value) => {
  const timestamp = value ? new Date(value).getTime() : NaN;
  return Number.isNaN(timestamp) ? null : timestamp;
};

export const getOrderAgeMinutes = (order, now = Date.now()) => {
  const createdAt = parseDate(order?.createdAt);
  if (createdAt == null) return 0;
  return Math.max(0, Math.floor((now - createdAt) / 60000));
};

const getConfiguredTargetMinutes = (order) => {
  const candidates = [
    order?.estimatedTimeMin,
    order?.estimated_time_min,
    order?.estimatedDeliveryMin,
    order?.estimated_delivery_min,
    order?.prepTimeMin,
    order?.prep_time_min,
  ];

  const target = candidates
    .map(Number)
    .find((value) => Number.isFinite(value) && value > 0);

  return target || FALLBACK_TARGET_MINUTES[order?.status] || 30;
};

export const getOrderUrgency = (order, now = Date.now()) => {
  const ageMinutes = getOrderAgeMinutes(order, now);
  const active = ACTIVE_STATUSES.includes(order?.status);

  if (!active) {
    return {
      level: "normal",
      score: 0,
      ageMinutes,
      targetMinutes: null,
      overdueMinutes: 0,
      label: `${ageMinutes} min`,
    };
  }

  const targetMinutes = getConfiguredTargetMinutes(order);
  const remainingMinutes = targetMinutes - ageMinutes;
  const overdueMinutes = Math.max(0, ageMinutes - targetMinutes);

  if (overdueMinutes > 0) {
    return {
      level: "overdue",
      score: 3000 + overdueMinutes,
      ageMinutes,
      targetMinutes,
      overdueMinutes,
      label: `Retrasada ${overdueMinutes} min`,
    };
  }

  if (remainingMinutes <= 5) {
    return {
      level: "warning",
      score: 2000 + ageMinutes,
      ageMinutes,
      targetMinutes,
      overdueMinutes: 0,
      label: `${ageMinutes} min esperando`,
    };
  }

  if (ageMinutes <= 3 && order?.status === "pending") {
    return {
      level: "new",
      score: 1000 + ageMinutes,
      ageMinutes,
      targetMinutes,
      overdueMinutes: 0,
      label: "Nueva",
    };
  }

  return {
    level: "normal",
    score: ageMinutes,
    ageMinutes,
    targetMinutes,
    overdueMinutes: 0,
    label: `${ageMinutes} min esperando`,
  };
};

export const sortOrdersByOperationalPriority = (orders = [], now = Date.now()) =>
  [...orders].sort((left, right) => {
    const leftUrgency = getOrderUrgency(left, now);
    const rightUrgency = getOrderUrgency(right, now);

    if (rightUrgency.score !== leftUrgency.score) {
      return rightUrgency.score - leftUrgency.score;
    }

    const leftCreated = parseDate(left?.createdAt) || 0;
    const rightCreated = parseDate(right?.createdAt) || 0;
    return leftCreated - rightCreated;
  });
