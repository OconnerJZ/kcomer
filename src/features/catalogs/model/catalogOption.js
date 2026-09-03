export const normalizeCatalogOption = (option = {}) => {
  const id = option.id ?? option.foodTypeId ?? option.food_type_id ?? option.key ?? null;
  const label = option.label || option.name || option.typeName || option.type_name || option.value || option.title || "";
  return { id, label, name: label };
};

export const normalizeCatalogOptions = (options = []) =>
  (Array.isArray(options) ? options : []).map(normalizeCatalogOption);
