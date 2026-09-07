import PropTypes from "prop-types";

const nullableString = PropTypes.string;

export const adminBusinessPropType = PropTypes.shape({
  id: PropTypes.number.isRequired,
  name: nullableString,
  email: nullableString,
  phone: nullableString,
  description: nullableString,
  isOpen: PropTypes.bool,
  isVerified: PropTypes.bool,
  platformStatus: PropTypes.oneOf(["active", "suspended"]),
  suspendedAt: PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]),
  suspensionReason: nullableString,
});

export const adminBusinessTeamPropType = PropTypes.arrayOf(PropTypes.shape({
  id: PropTypes.number,
  userId: PropTypes.number,
  name: nullableString,
  email: nullableString,
  avatar: nullableString,
  role: PropTypes.string,
  permissions: PropTypes.arrayOf(PropTypes.string),
}));

const planIdentityPropType = PropTypes.shape({
  code: PropTypes.string,
  name: PropTypes.string,
});

const limitPropType = PropTypes.shape({
  limit: PropTypes.number,
  used: PropTypes.number,
  remaining: PropTypes.number,
  enforced: PropTypes.bool,
});

export const adminBusinessPlanPropType = PropTypes.shape({
  plan: planIdentityPropType,
  basePlan: planIdentityPropType,
  subscription: PropTypes.shape({
    status: PropTypes.string,
    source: PropTypes.string,
  }),
  trial: PropTypes.shape({
    active: PropTypes.bool,
    planCode: PropTypes.string,
    name: PropTypes.string,
  }),
  limits: PropTypes.objectOf(limitPropType),
  usage: PropTypes.objectOf(PropTypes.number),
});

export const adminBusinessConfigurationPropType = PropTypes.shape({
  location: PropTypes.shape({
    address: nullableString,
    city: nullableString,
    postalCode: nullableString,
    latitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    longitude: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  }),
  schedules: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    day: PropTypes.string,
    isClosed: PropTypes.bool,
    opened: nullableString,
    closed: nullableString,
    isHoliday: PropTypes.bool,
  })),
  delivery: PropTypes.shape({
    enabled: PropTypes.bool,
    radiusKm: PropTypes.number,
    fee: PropTypes.number,
    minOrderAmount: PropTypes.number,
    estimatedTimeMin: PropTypes.number,
    useOwnDelivery: PropTypes.bool,
  }),
  paymentMethods: PropTypes.arrayOf(PropTypes.shape({
    method: PropTypes.string,
    active: PropTypes.bool,
  })),
  foodTypes: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    name: nullableString,
  })),
  photos: PropTypes.number,
  menuItems: PropTypes.number,
});
