import PropTypes from "prop-types";

const nullableDate = PropTypes.oneOfType([PropTypes.string, PropTypes.instanceOf(Date)]);

export const adminPlanCatalogPropType = PropTypes.arrayOf(PropTypes.shape({
  code: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  rank: PropTypes.number,
  description: PropTypes.string,
}));

export const adminPlanPropType = PropTypes.shape({
  businessId: PropTypes.number,
  plan: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }),
  basePlan: PropTypes.shape({
    code: PropTypes.string,
    name: PropTypes.string,
  }),
  subscription: PropTypes.shape({
    status: PropTypes.string,
    source: PropTypes.string,
    version: PropTypes.number,
    startsAt: nullableDate,
    endsAt: nullableDate,
  }),
  trial: PropTypes.shape({
    planCode: PropTypes.string,
    name: PropTypes.string,
    startsAt: nullableDate,
    endsAt: nullableDate,
    active: PropTypes.bool,
    lifecycle: PropTypes.oneOf(["none", "scheduled", "active", "expired"]),
    canCancel: PropTypes.bool,
  }),
  catalog: adminPlanCatalogPropType,
  billingEnabled: PropTypes.bool,
  message: PropTypes.string,
});

const planDistributionPropType = PropTypes.arrayOf(PropTypes.shape({
  planCode: PropTypes.string.isRequired,
  businesses: PropTypes.number.isRequired,
}));

export const adminPlanSummaryPropType = PropTypes.shape({
  generatedAt: nullableDate,
  totalBusinesses: PropTypes.number,
  activeTrials: PropTypes.number,
  scheduledTrials: PropTypes.number,
  expiringTrials7d: PropTypes.number,
  basePlans: planDistributionPropType,
  effectivePlans: planDistributionPropType,
  expiringTrials: PropTypes.arrayOf(PropTypes.shape({
    businessId: PropTypes.number.isRequired,
    businessName: PropTypes.string,
    planCode: PropTypes.string,
    startsAt: nullableDate,
    endsAt: nullableDate,
  })),
});

export const adminPlanHistoryPropType = PropTypes.arrayOf(PropTypes.shape({
  auditId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
  action: PropTypes.string,
  previousPlan: PropTypes.string,
  nextPlan: PropTypes.string,
  actorUserId: PropTypes.number,
  actor: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    email: PropTypes.string,
  }),
  createdAt: nullableDate,
}));
