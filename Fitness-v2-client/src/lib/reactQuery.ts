export const QUERY_KEYS = {
  USERS: {
    GET_USERS: "getUsers",
  },
  MEALS: {
    GET_MEALS_BY_USER_ID: "get-meals-by-user-id",
    GET_MEAL_BY_ID: "get-meal-by-id",
  },
  MEALS_CONSUMED: {
    GET_MEALS_CONSUMED_BY_MEAL_ID: "get-meals-consumed-by-meal-id",
    GET_MEALS_CONSUMED_BY_DATE: "get-meals-consumed-by-date",
  },
  FOOD_ITEMS: {
    GET_FOOD_ITEMS: "get-food-items",
    GET_FOOD_ITEMS_INF_QUERY: "get-food-items-infinite-query",
    GET_FOOD_ITEMS_BY_ID: "get-food-items-by-user-id",
  },
  FOOD_ITEMS_PENDING: {
    GET_FOOD_ITEMS_PENDING: "get-food-items-pending",
  },
  NOTIFICATION: {
    GET_NEW_USER_NOTIFICATIONS: "get-new-user-notifications",
  },
  MEASUREMENT: {
    GET_CHECK_TODAY_MEASUREMENT: "get-check-today-measurement",
    GET_MEASUREMENTS_BY_USER_ID: "get-measurements-by-user-id",
  },
  CHART_DATA: {
    GET_CHART_DATA_MEALS_CONSUMED: "get-chart-data-meals-consumed",
    GET_CHART_DATA_MEASUREMENTS: "get-chart-data-meals-measurements",
  },
  CALENDAR_DATA: {
    GET_CALENDAR_DATA_BY_DATE: "get-calendar-data-by-date",
  },
  SUPPORT: {
    GET_SUPPORT_TICKETS: "get-support-tickets",
  },
  SCORE: {
    GET_SCORE_BY_USER_ID: "get-score-by-user-id",
  },
} as const;

type QueryKeyValues<T> =
  T extends Record<string, infer U>
    ? U extends string
      ? U
      : QueryKeyValues<U>
    : never;

export type ConstQueryKeys = QueryKeyValues<typeof QUERY_KEYS>;
