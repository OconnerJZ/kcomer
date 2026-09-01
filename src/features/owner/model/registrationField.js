const FIELD_PATTERNS = {
  alphabetic: /^[A-Za-zÁÉÍÓÚáéíóúÑñ ]*$/,
  alphanumeric: /^[A-Za-z0-9ÁÉÍÓÚáéíóúÑñ ]*$/,
  numeric: /^[0-9]*$/,
  phone: /^[0-9]{0,10}$/,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
};

export const acceptsRegistrationFieldValue = (value, validation) => {
  const pattern = FIELD_PATTERNS[validation];
  return !pattern || pattern.test(value);
};

export const getRegistrationOptionLabel = (option) => option?.label || "";

export const selectRegistrationOptions = (options, value, multiple = false) => {
  if (multiple) {
    const selectedIds = Array.isArray(value) ? value : [];
    return options.filter((option) => selectedIds.includes(option.id));
  }
  return options.find((option) => option.id === value) || null;
};
