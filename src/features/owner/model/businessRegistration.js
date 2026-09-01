export const createBusinessRegistrationForm = () => ({
  businessName: "",
  phone: "",
  foodTypeIds: [],
  hasDelivery: false,
  logo: null,
  schedule: [],
  location: null,
});

export const createBusinessRegistrationSteps = (foodTypes = []) => [
  {
    label: "Tu negocio",
    subtitle: "Lo esencial para que las personas lo reconozcan.",
    fields: [
      {
        name: "businessName",
        label: "Nombre del negocio",
        type: "text",
        required: true,
        validate: "alphanumeric",
      },
      { name: "phone", label: "Teléfono", type: "text", required: true, validate: "phone" },
      {
        name: "foodTypeIds",
        label: "Tipo de comida",
        type: "autocomplete-multiple",
        options: foodTypes,
        required: true,
      },
      { name: "hasDelivery", label: "¿Ofrece servicio a domicilio?", type: "switch" },
      { name: "logo", label: "Logo del negocio", type: "image", required: true },
    ],
  },
  {
    label: "Cuándo te encuentran",
    subtitle: "Configura los horarios que verán tus clientes.",
    fields: [{ name: "schedule", type: "schedule", required: true }],
  },
  {
    label: "Dónde estás",
    subtitle: "Marca tu ubicación para que llegar sea sencillo.",
    fields: [{ name: "location", label: "Ubicación en mapa", type: "map", required: true }],
  },
];

export const isBusinessRegistrationFieldEmpty = (field, value) => {
  if (field.type === "autocomplete-multiple" || field.type === "schedule") {
    return !Array.isArray(value) || value.length === 0;
  }
  if (field.type === "map") return !value?.latitude || !value?.longitude;
  return !value || (typeof value === "string" && !value.trim());
};

export const validateBusinessRegistrationStep = (form, step) =>
  (step?.fields || []).reduce((errors, field) => {
    if (field.required && isBusinessRegistrationFieldEmpty(field, form[field.name])) {
      errors[field.name] = true;
    }
    return errors;
  }, {});

export const toBusinessRegistrationPayload = ({ form, userId, logoUrl = "" }) => ({
  id: userId,
  business_name: form.businessName,
  phone: form.phone,
  food_type: form.foodTypeIds,
  has_delivery: Boolean(form.hasDelivery),
  logo_url: logoUrl,
  schedule: form.schedule,
  locale: {
    latitude: form.location?.latitude,
    longitude: form.location?.longitude,
    address: form.location?.address || "",
  },
});
