const normalizeAddress = (address = {}, index = 0) => {
  const source = address || {};

  return {
    id: source.id ?? source.addressId ?? source.address_id ?? index,
    street: source.street || source.address || source.line1 || "",
    number:
      source.number ||
      source.externalNumber ||
      source.external_number ||
      source.houseNumber ||
      "",
    references: source.references || source.reference || source.notes || "",
    city: source.city || "",
    postalCode: source.postalCode || source.postal_code || "",
    latitude: source.latitude ?? "",
    longitude: source.longitude ?? "",
  };
};

const normalizeBusinesses = (businesses = []) => {
  if (!Array.isArray(businesses)) return [];
  return businesses;
};

export const getUserBusinessIds = (user = {}) => {
  const source = user || {};

  return normalizeBusinesses(source.businesses)
    .map((business) =>
      typeof business === "object" && business !== null
        ? business.id ?? business.businessId ?? business.business_id
        : business,
    )
    .filter((id) => id !== null && id !== undefined && id !== "")
    .map(String);
};

export const normalizeUser = (user = {}) => {
  const source = user || {};
  const addresses = source.addresses || source.userAddresses || source.user_addresses || [];
  const businesses = source.businesses || source.business || [];

  return {
    id: source.id ?? source.userId ?? source.user_id ?? null,
    name:
      source.name ||
      source.userName ||
      source.user_name ||
      source.fullName ||
      source.full_name ||
      "",
    email: source.email || "",
    phone: source.phone || source.phoneNumber || source.phone_number || "",
    role: source.role || source.userRole || source.user_role || "",
    avatar: source.avatar || source.avatarUrl || source.avatar_url || "",
    addresses: Array.isArray(addresses)
      ? addresses.map((address, index) => normalizeAddress(address, index))
      : [],
    businesses: normalizeBusinesses(businesses),
  };
};

export const normalizeSessionUser = ({ user = {}, token = "", lastUpdated } = {}) => ({
  ...normalizeUser(user),
  token,
  lastUpdated: lastUpdated || new Date().toISOString(),
});

export const toUserUpdatePayload = (user = {}) => {
  const source = user || {};
  return {
    name: source.name,
    phone: source.phone,
  };
};

export { normalizeAddress };
