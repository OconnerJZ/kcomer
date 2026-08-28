const DEFAULT_PAYMENT_METHODS = [
  { method: "cash", active: true, label: "Efectivo" },
  { method: "card", active: false, label: "Tarjeta" },
  { method: "wallet", active: false, label: "Billetera Digital" },
  { method: "transfer", active: false, label: "Transferencia" },
];

const compactValues = (values = []) =>
  Array.from(new Set(values.filter((value) => value !== null && value !== undefined && value !== "")));

const getPhotoValue = (photo) =>
  typeof photo === "string"
    ? photo
    : photo?.url || photo?.photoUrl || photo?.photo_url || photo?.image || photo?.imageUrl || photo?.image_url || "";

export const normalizeBusiness = (business = {}) => {
  const location = business.location || business.locations?.[0] || {};
  const delivery = business.deliverySettings || business.delivery_settings || {};
  const methods = business.paymentMethods || business.payment_methods || [];
  const foodTypes = business.foodTypes || business.food_types || [];
  const phone = business.phone || business.phones?.[0] || "";
  const email = business.email || business.emails?.[0] || "";
  const photos = business.photos || business.businessPhotos || business.business_photos || [];
  const logo =
    business.logo ||
    business.logoUrl ||
    business.logo_url ||
    business.urlImage ||
    business.image ||
    "";
  const coverImage =
    business.coverImage ||
    business.cover_image ||
    business.bannerUrl ||
    business.banner_url ||
    business.coverUrl ||
    business.cover_url ||
    business.heroImage ||
    business.hero_image ||
    getPhotoValue(photos[0]) ||
    logo;
  const social = business.social || {};

  return {
    id: business.id ?? business.businessId ?? business.business_id ?? null,
    name: business.name || business.title || business.businessName || business.business_name || "",
    phone,
    phones: compactValues([phone, ...(business.phones || [])]),
    email,
    emails: compactValues([email, ...(business.emails || [])]),
    description: business.description || "",
    open: business.open ?? business.isOpen ?? business.is_open ?? true,
    prepTimeMin: Number(business.prepTimeMin ?? business.prep_time_min ?? 30),
    estimatedDeliveryMin: Number(
      business.estimatedDeliveryMin ?? business.estimated_delivery_min ?? 45,
    ),
    logo,
    coverImage,
    bannerUrl: business.bannerUrl || business.banner_url || "",
    likes: Number(business.likes ?? business.rating_count ?? business.ratingCount ?? 0),
    rating: Number(business.rating ?? business.average_rating ?? business.averageRating ?? 0),
    hasDelivery: Boolean(
      business.hasDelivery ??
        business.has_delivery ??
        business.deliveryEnabled ??
        business.delivery_enabled ??
        false,
    ),
    location: {
      address: location.address || "",
      city: location.city || "",
      postalCode: location.postalCode || location.postal_code || "",
      latitude: location.latitude ?? "",
      longitude: location.longitude ?? "",
    },
    schedules: business.schedules || business.schedule || business.businessSchedules || [],
    schedule: business.schedule || business.schedules || business.businessSchedules || [],
    menu: business.menu || [],
    tags: business.tags || foodTypes,
    foodTypes,
    social: {
      facebook: social.facebook || business.facebookUrl || business.facebook_url || "",
      instagram: social.instagram || business.instagramUrl || business.instagram_url || "",
      whats: social.whats || "",
    },
    deliverySettings: {
      deliveryRadiusKm: Number(delivery.deliveryRadiusKm ?? delivery.delivery_radius_km ?? 5),
      deliveryFee: Number(delivery.deliveryFee ?? delivery.delivery_fee ?? 0),
      minOrderAmount: Number(delivery.minOrderAmount ?? delivery.min_order_amount ?? 0),
      estimatedTimeMin: Number(delivery.estimatedTimeMin ?? delivery.estimated_time_min ?? 30),
      useOwnDelivery: Boolean(delivery.useOwnDelivery ?? delivery.use_own_delivery ?? false),
    },
    paymentMethods: DEFAULT_PAYMENT_METHODS.map((method) => {
      const current = methods.find((item) => item.method === method.method);
      return {
        ...method,
        active: current ? Boolean(current.active ?? current.isActive ?? current.is_active) : method.active,
        config: current?.config && typeof current.config === "object" ? current.config : {},
      };
    }),
    foodTypeIds: foodTypes.map((item) => (typeof item === "object" ? item.id : item)),
    photos,
    membershipRole: business.membershipRole || business.roleInBusiness || business.role_in_business || "",
    permissions: Array.isArray(business.permissions) ? business.permissions : [],
  };
};

export const normalizeBusinesses = (businesses = []) =>
  Array.isArray(businesses) ? businesses.map(normalizeBusiness) : [];

export const toBasicInfoPayload = (business) => ({
  business_name: business.name,
  phone: business.phone,
  email: business.email,
  description: business.description,
  is_open: business.open,
  prep_time_min: Number(business.prepTimeMin),
  estimated_delivery_min: Number(business.estimatedDeliveryMin),
  logo_url: business.logo,
});

export const toSocialPayload = (social = {}) => ({
  facebook_url: social.facebook || "",
  instagram_url: social.instagram || "",
});

export const toLocationPayload = (location) => ({
  address: location.address,
  city: location.city,
  postal_code: location.postalCode,
  latitude: location.latitude,
  longitude: location.longitude,
});

export const toDeliveryPayload = (delivery) => ({
  delivery_radius_km: Number(delivery.deliveryRadiusKm),
  delivery_fee: Number(delivery.deliveryFee),
  min_order_amount: Number(delivery.minOrderAmount),
  estimated_time_min: Number(delivery.estimatedTimeMin),
  use_own_delivery: Boolean(delivery.useOwnDelivery),
});

export const toPaymentMethodsPayload = (methods = []) =>
  methods.map((method) => ({
    method: method.method,
    is_active: Boolean(method.active),
    label: method.label,
    config: method.method === "transfer" ? {
      accountHolder: method.config?.accountHolder || "",
      bankName: method.config?.bankName || "",
      clabe: method.config?.clabe || "",
      accountNumber: method.config?.accountNumber || "",
      referenceInstructions: method.config?.referenceInstructions || "",
    } : undefined,
  }));
