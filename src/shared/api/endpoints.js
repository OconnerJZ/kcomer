const AUTH_NAME = "api/auth";
const BUSINESS_NAME = "api/business";
const CATALOGS_NAME = "api/catalogs";
const MENU_NAME = "api/menus";
const USERS_NAME = "api/users";
const ORDERS_NAME = "api/orders";
const PAYMENTS_NAME = "api/payments";
const REVIEWS_NAME = "api/reviews";
const STATS_NAME = "api/stats";
const UPLOAD_NAME = "api/upload";

export const ENDPOINTS = {
  auth: {
    login: `${AUTH_NAME}/login`,
    register: `${AUTH_NAME}/register`,
    me: `${AUTH_NAME}/me`,
    google: `${AUTH_NAME}/google`,
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
