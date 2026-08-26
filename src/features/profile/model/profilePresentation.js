export const getRoleColor = (role) => {
  const colors = {
    admin: "error",
    owner: "warning",
    customer: "primary",
    delivery: "info",
  };

  return colors[role] || "default";
};

export const getRoleLabel = (role) => {
  const labels = {
    admin: "Administrador",
    owner: "Propietario",
    customer: "Cliente",
    delivery: "Repartidor",
  };

  return labels[role] || role;
};
