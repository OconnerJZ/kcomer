export const formatPlanLimit = ({ limit, used } = {}) => {
  if (limit == null) return "Sin límite configurado";
  if (used == null) return `Límite: ${limit}`;
  return `${used} de ${limit}`;
};

export const limitProgress = ({ limit, used } = {}) => {
  if (limit == null || used == null || limit <= 0) return null;
  return Math.min(100, Math.round((used / limit) * 100));
};

export const availableFeatures = (features = []) => features.filter((feature) => feature.included && feature.status === "available");
export const upcomingFeatures = (features = []) => features.filter((feature) => feature.status === "coming_soon");
