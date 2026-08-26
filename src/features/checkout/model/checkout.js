export const DEFAULT_CHECKOUT_FORM = (user = null) => ({
  customerPhone: user?.phone || "",
  paymentMethod: "cash",
  userAddressId: "",
  newAddress: {
    street: "",
    number: "",
    references: "",
    address: "",
    city: "",
    postalCode: "",
    state: "",
    latitude: "",
    longitude: "",
  },
  notes: "",
});

export const validateCheckout = ({ form, orderType, addressType, currentBusiness }) => {
  const errors = {};
  if (!form.customerPhone) errors.customerPhone = "El teléfono es requerido";
  if (orderType === "delivery") {
    if (addressType === "saved" && !form.userAddressId) errors.userAddressId = "Selecciona una dirección guardada";
    if (addressType === "new") {
      if (!form.newAddress.street && !form.newAddress.address) errors.street = "La dirección es requerida";
      if (!form.newAddress.number) errors.number = "El número es requerido";
      if (!form.newAddress.latitude || !form.newAddress.longitude) errors.location = "Selecciona el punto exacto en el mapa";
    }
  }
  if (!currentBusiness?.items || Object.keys(currentBusiness.items).length === 0) errors.general = "El carrito está vacío";
  if (!currentBusiness || currentBusiness.total <= 0) errors.general = "El total debe ser mayor a $0";
  return { valid: Object.keys(errors).length === 0, errors };
};

const selectedSavedAddress = (addresses, id) => addresses.find((address) => String(address.id ?? address.addressId) === String(id));

export const buildDeliverySnapshot = ({ orderType, addressType, form, addresses = [] }) => {
  if (orderType !== "delivery") return { deliveryAddress: "Recoger en tienda", deliveryLocation: null, deliveryAddressId: null };

  const source = addressType === "saved" ? selectedSavedAddress(addresses, form.userAddressId) : form.newAddress;
  if (!source) return { deliveryAddress: "", deliveryLocation: null, deliveryAddressId: null };

  const street = source.street || source.address || "";
  const number = source.number ? ` #${source.number}` : "";
  const city = source.city ? `, ${source.city}` : "";
  const postal = source.postalCode || source.postal_code ? `, CP ${source.postalCode || source.postal_code}` : "";
  const references = source.references ? ` · ${source.references}` : "";

  return {
    deliveryAddress: `${street}${number}${city}${postal}${references}`.trim(),
    deliveryAddressId: addressType === "saved" ? Number(source.id ?? source.addressId) || null : null,
    deliveryLocation: source.latitude && source.longitude ? {
      latitude: Number(source.latitude),
      longitude: Number(source.longitude),
      city: source.city || "",
      postalCode: source.postalCode || source.postal_code || "",
      state: source.state || "",
    } : null,
  };
};

export const buildOrderPayload = ({ businessId, business, user, orderType, addressType, addresses = [], form }) => {
  const delivery = buildDeliverySnapshot({ orderType, addressType, form, addresses });
  return {
    businessId,
    businessName: business.businessName,
    userId: user.id,
    customerName: user.name,
    customerEmail: user.email,
    items: Object.values(business.items),
    total: business.total,
    orderType,
    deliveryAddress: delivery.deliveryAddress,
    deliveryAddressId: delivery.deliveryAddressId,
    deliveryLocation: delivery.deliveryLocation,
    phoneNumber: form.customerPhone,
    paymentMethod: form.paymentMethod,
    notes: form.notes,
  };
};
