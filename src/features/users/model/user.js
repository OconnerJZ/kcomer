const normalizeAddress = (address = {}, index = 0) => ({
  id: address.id ?? address.addressId ?? address.address_id ?? index,
  street: address.street || address.address || address.line1 || "",
  number:
    address.number ||
    address.externalNumber ||
    address.external_number ||
    address.houseNumber ||
    "",
  references: address.references || address.reference || address.notes || "",
  city: address.city || "",
  postalCode: address.postalCode || address.postal_code || "",
  latitude: address.latitude ?? "",
  longitude: address.longitude ?? "",
});

const normalizeBusinesses = (businesses = []) => {
  if (!Array.isArray(businesses)) return [];
  return businesses;
};

export const getUserBusinessIds = (user = {}) =>
  normalizeBusinesses(user.businesses)
    .map((business) =>
      typeof business === "object"
        ? business?.id ?? business?.businessId ?? business?.business_id
        : business,
    )
    .filter((id) => id !== null && id !== undefined && id !== "")
    .map(String);

export const normalizeUser = (user = {}) => {
  const addresses = user.addresses || user.userAddresses || user.user_addresses || [];
  const businesses = user.businesses || user.business || [];

  return {
    id: user.id ?? user.userId ?? user.user_id ?? null,
    name:
      user.name ||
      user.userName ||
      user.user_name ||
      user.fullName ||
      user.full_name ||
      "",
    email: user.email || "",
    phone: user.phone || user.phoneNumber || user.phone_number || "",
    role: user.role || user.userRole || user.user_role || "",
    avatar: user.avatar || user.avatarUrl || user.avatar_url || "",
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

export const toUserUpdatePayload = (user = {}) => ({
  name: user.name,
  phone: user.phone,
});

export { normalizeAddress };
