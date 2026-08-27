export const normalizeCatalogOption = (option = {}) => ({
  id: option.id ?? option.value ?? option.key ?? null,
  label: option.label || option.name || option.value || option.title || "",
});

export const normalizeCatalogOptions = (options = []) =>
  (Array.isArray(options) ? options : []).map(normalizeCatalogOption);
