import PropTypes from "prop-types";

const nullableString = PropTypes.string;
const dateLike = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

export const adminUserPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: nullableString,
  email: nullableString,
  phone: nullableString,
  avatar: nullableString,
  provider: PropTypes.string,
  role: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
  }),
  accountStatus: PropTypes.oneOf(["active", "blocked"]),
  blockedAt: dateLike,
  blockReason: nullableString,
  isSubscribed: PropTypes.bool,
  isPaymentActive: PropTypes.bool,
  locale: nullableString,
  createdAt: dateLike,
  updatedAt: dateLike,
});

export const adminUserBusinessesPropType = PropTypes.arrayOf(PropTypes.shape({
  membershipId: PropTypes.number,
  businessId: PropTypes.number.isRequired,
  businessName: PropTypes.string,
  role: PropTypes.string,
  joinedAt: dateLike,
}));

export const adminUserActivityPropType = PropTypes.shape({
  businesses: PropTypes.number,
  totalOrders: PropTypes.number,
  ordersLast30Days: PropTypes.number,
  completedOrders: PropTypes.number,
  totalReviews: PropTypes.number,
  totalAddresses: PropTypes.number,
  lastOrderAt: dateLike,
});

export const adminRoleCatalogPropType = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: PropTypes.string.isRequired,
}));
