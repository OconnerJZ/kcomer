export const createBusinessRegistrationForm = () => ({
  businessName: "",
  phone: "",
  foodTypeIds: [],
  hasDelivery: false,
  logo: null,
  schedule: [],
  location: null,
});

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
    address: form.location?.address || form.location?.formatted_address || "",
    city: form.location?.city || "",
    postalCode: form.location?.postalCode || "",
    state: form.location?.state || "",
    country: form.location?.country || "",
  },
});
