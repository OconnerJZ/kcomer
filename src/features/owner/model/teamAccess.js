export const BUSINESS_TEAM_ROLES = [
  { value: "co_owner", label: "Co-owner" },
  { value: "manager", label: "Manager" },
  { value: "kitchen", label: "Cocina" },
  { value: "cashier", label: "Caja" },
];

export const getBusinessRoleLabel = (role) =>
  role === "primary_owner"
    ? "Owner principal"
    : BUSINESS_TEAM_ROLES.find((item) => item.value === role)?.label || role;

export const getTeamErrorMessage = (error) =>
  error?.data?.message || error?.message || "No se pudo completar la acción";

