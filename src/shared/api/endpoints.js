const AUTH_NAME = "api/auth";
const ADMIN_NAME = "api/admin";
const BUSINESS_NAME = "api/business";
const CATALOGS_NAME = "api/catalogs";
const MENU_NAME = "api/menus";
const USERS_NAME = "api/users";
const ORDERS_NAME = "api/orders";
const PAYMENTS_NAME = "api/payments";
const REVIEWS_NAME = "api/reviews";
const LOYALTY_NAME = "api/loyalty";
const MARKETING_NAME = "api/marketing";
const STATS_NAME = "api/stats";
const UPLOAD_NAME = "api/upload";

export const ENDPOINTS = {
  auth: {
    login: `${AUTH_NAME}/login`,
    register: `${AUTH_NAME}/register`,
    me: `${AUTH_NAME}/me`,
    google: `${AUTH_NAME}/google`,
  },
  admin: {
    dashboard: `${ADMIN_NAME}/dashboard`,
    businesses: `${ADMIN_NAME}/businesses`,
    users: `${ADMIN_NAME}/users`,
    planSummary: `${ADMIN_NAME}/plans/summary`,
    features: `${ADMIN_NAME}/features`,
    marketing: `${ADMIN_NAME}/marketing`,
  },
  businesses: {
    base: BUSINESS_NAME,
    owner: `${BUSINESS_NAME}/owner`,
  },
  catalogs: {
    foodTypes: `${CATALOGS_NAME}/food-types`,
    categories: `${CATALOGS_NAME}/categories`,
    paymentMethods: `${CATALOGS_NAME}/payment-methods`,
  },
  menus: {
    base: MENU_NAME,
    business: `${MENU_NAME}/business`,
  },
  users: {
    base: USERS_NAME,
  },
  orders: {
    base: ORDERS_NAME,
    user: `${ORDERS_NAME}/user`,
    business: `${ORDERS_NAME}/business`,
  },
  payments: {
    base: PAYMENTS_NAME,
    verify: `${PAYMENTS_NAME}/verify`,
    intent: `${PAYMENTS_NAME}/intent`,
    confirm: `${PAYMENTS_NAME}/confirm`,
  },
  reviews: {
    base: REVIEWS_NAME,
    business: `${REVIEWS_NAME}/business`,
  },
  loyalty: {
    base: LOYALTY_NAME,
    business: `${LOYALTY_NAME}/business`,
    me: `${LOYALTY_NAME}/me`,
  },
  marketing: {
    base: MARKETING_NAME,
    business: `${MARKETING_NAME}/business`,
    sponsored: `${MARKETING_NAME}/sponsored`,
  },
  stats: {
    business: `${STATS_NAME}/business`,
    summary: `${STATS_NAME}/business/summary`,
    revenue: `${STATS_NAME}/business/revenue`,
  },
  upload: {
    image: `${UPLOAD_NAME}/image`,
    multiple: `${UPLOAD_NAME}/multiple`,
  },
};
