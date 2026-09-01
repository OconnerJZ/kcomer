export const SETTINGS_SECTIONS = Object.freeze([
  { key: "general", label: "General", icon: "business", description: "Identidad y operación" },
  { key: "location", label: "Ubicación", icon: "location", description: "Dirección y mapa" },
  { key: "schedules", label: "Horarios", icon: "schedule", description: "Días y apertura" },
  { key: "delivery", label: "Delivery", icon: "delivery", description: "Cobertura y tiempos" },
  { key: "payments", label: "Pagos", icon: "payment", description: "Métodos aceptados" },
  { key: "food-types", label: "Categorías", icon: "category", description: "Tipo de comida" },
  { key: "social", label: "Redes", icon: "social", description: "Presencia digital" },
  { key: "gallery", label: "Galería", icon: "gallery", description: "Fotos y portada" },
  { key: "plan", label: "Plan", icon: "plan", description: "Nivel y capacidad" },
]);

export const TEAM_SETTINGS_SECTION = Object.freeze({
  key: "team",
  label: "Equipo",
  icon: "team",
  description: "Roles y acceso",
});

export const canManageBusinessTeam = (business) =>
  business?.membershipRole === "primary_owner"
  || business?.permissions?.includes("team.manage")
  || false;

export const getSettingsSections = (canManageTeam) =>
  canManageTeam ? [...SETTINGS_SECTIONS, TEAM_SETTINGS_SECTION] : [...SETTINGS_SECTIONS];

export const getDisplayedSettingsTab = (activeTab, sections = SETTINGS_SECTIONS) =>
  activeTab >= 0 && activeTab < sections.length ? activeTab : 0;

export const togglePaymentMethod = (paymentMethods = [], method) =>
  paymentMethods.map((paymentMethod) => paymentMethod.method === method
    ? { ...paymentMethod, active: !paymentMethod.active }
    : paymentMethod);

export const updatePaymentMethodConfig = (paymentMethods = [], method, field, value) =>
  paymentMethods.map((paymentMethod) => paymentMethod.method === method
    ? {
      ...paymentMethod,
      config: { ...(paymentMethod.config || {}), [field]: value },
    }
    : paymentMethod);

export const toggleFoodTypeSelection = (selectedFoodTypes = [], typeId) =>
  selectedFoodTypes.some((id) => String(id) === String(typeId))
    ? selectedFoodTypes.filter((id) => String(id) !== String(typeId))
    : [...selectedFoodTypes, typeId];
