export const formatPlanLimit = ({ limit, used } = {}) => {
  if (limit == null) return "Sin límite configurado";
  if (used == null) return `Límite: ${limit}`;
  return `${used} de ${limit}`;
};

export const limitProgress = ({ limit, used } = {}) => {
  if (limit == null || used == null || limit <= 0) return null;
  return Math.min(100, Math.round((used / limit) * 100));
};

export const limitUsageState = (value = {}) => {
  const progress = limitProgress(value);
  if (progress == null) return { level: "normal", progress: null, message: null };
  if (progress >= 100) {
    return {
      level: "blocked",
      progress,
      message: "Alcanzaste el límite. Puedes editar o eliminar recursos existentes, pero no agregar nuevos.",
    };
  }
  if (progress >= 90) {
    return {
      level: "warning",
      progress,
      message: "Estás muy cerca del límite de tu plan.",
    };
  }
  if (progress >= 80) {
    return {
      level: "notice",
      progress,
      message: "Te estás acercando al límite de tu plan.",
    };
  }
  return { level: "normal", progress, message: null };
};

export const availableFeatures = (features = []) =>
  features.filter((feature) => feature.included && feature.status === "available");

export const upcomingFeatures = (features = []) =>
  features.filter((feature) => feature.included && feature.status === "coming_soon");

export const commercialFeatures = (features = []) =>
  features.filter((feature) => feature.commercialModel && feature.commercialModel !== "core");

export const buildPlanValueMatrix = (catalog = []) => {
  const rows = new Map();

  for (const plan of catalog) {
    for (const feature of commercialFeatures(plan.features || [])) {
      const current = rows.get(feature.key) || {
        key: feature.key,
        label: feature.label,
        description: feature.description,
        category: feature.category || "growth",
        commercialModel: feature.commercialModel,
        status: feature.status,
        plans: {},
      };
      current.plans[plan.code] = Boolean(feature.included);
      rows.set(feature.key, current);
    }
  }

  return [...rows.values()];
};
