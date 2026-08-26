const AUTH_NAME = "api/auth";
const BUSINESS_NAME = "api/business";
const CATALOGS_NAME = "api/catalogs";
const MENU_NAME = "api/menus";
const USERS_NAME = "api/users";
const ORDERS_NAME = "api/orders";

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
    base: "/api/payments",
    verify: "/api/payments/verify",
    intent: "/api/payments/intent",
    confirm: "/api/payments/confirm",
  },
  reviews: {
    base: "/api/reviews",
    business: "/api/reviews/business",
  },
  stats: {
    business: "/api/stats/business",
    summary: "/api/stats/business/summary",
    revenue: "/api/stats/business/revenue",
  },
  upload: {
    image: "/api/upload/image",
    multiple: "/api/upload/multiple",
  },
};
