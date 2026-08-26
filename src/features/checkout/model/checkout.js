export const DEFAULT_CHECKOUT_FORM = (user = null) => ({
  customerPhone: user?.phone || "",
  paymentMethod: "cash",
  userAddressId: "",
  newAddress: {
    street: "",
    number: "",
    references: "",
  },
  notes: "",
});

export const validateCheckout = ({
  form,
  orderType,
  addressType,
  currentBusiness,
}) => {
  const errors = {};

  if (!form.customerPhone) {
    errors.customerPhone = "El teléfono es requerido";
  }

  if (orderType === "delivery") {
    if (addressType === "saved" && !form.userAddressId) {
      errors.userAddressId = "Selecciona una dirección guardada";
    }

    if (addressType === "new") {
      if (!form.newAddress.street) {
        errors.street = "La calle es requerida";
      }
      if (!form.newAddress.number) {
        errors.number = "El número es requerido";
      }
    }
  }

  if (!currentBusiness?.items || Object.keys(currentBusiness.items).length === 0) {
    errors.general = "El carrito está vacío";
  }

  if (!currentBusiness || currentBusiness.total <= 0) {
    errors.general = "El total debe ser mayor a $0";
  }

  return errors;
};

export const buildDeliveryAddress = ({
  orderType,
  addressType,
  form,
  addresses = [],
}) => {
  if (orderType !== "delivery") {
    return "Recoger en tienda";
  }

  if (addressType === "saved") {
    const selectedAddress = addresses.find(
      (address) => address.id === form.userAddressId,
    );

    if (!selectedAddress) return "";

    return `${selectedAddress.street} #${selectedAddress.number}${
      selectedAddress.references ? `, ${selectedAddress.references}` : ""
    }`;
  }

  return `${form.newAddress.street} #${form.newAddress.number}${
    form.newAddress.references ? `, ${form.newAddress.references}` : ""
  }`;
};

export const buildOrderPayload = ({
  businessId,
  business,
  user,
  orderType,
  deliveryAddress,
  form,
}) => ({
  businessId,
  businessName: business.businessName,
  userId: user.id,
  customerName: user.name,
  customerEmail: user.email,
  items: Object.values(business.items),
  total: business.total,
  orderType,
  deliveryAddress,
  phoneNumber: form.customerPhone,
  paymentMethod: form.paymentMethod,
  notes: form.notes,
});
