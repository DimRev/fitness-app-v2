import { type UseMutationOptions, type UseQueryOptions } from "react-query";

export const USE_MUTATION_DEFAULT_OPTIONS: UseMutationOptions<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any
> = {
  retry: 3,
  retryDelay: 1000,
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const USE_QUERY_DEFAULT_OPTIONS: UseQueryOptions<any, any> = {
  cacheTime: 1000 * 60 * 5, // 5 minutes
  staleTime: 1000 * 60 * 5, // 5 minutes
  retry: 3,
  retryDelay: 1000,
};

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
    GET_FOOD_ITEMS_BY_USER_ID: "get-food-items-by-user-id",
  },
  FOOD_ITEMS_PENDING: {
    GET_FOOD_ITEMS_PENDING: "get-food-items-pending",
  },
  NOTIFICATION: {
    GET_NEW_USER_NOTIFICATIONS: "get-new-user-notifications",
  },
  CHART_DATA: {
    GET_CHART_DATA_MEALS_CONSUMED: "get-chart-data-meals-consumed",
  },
  CALENDAR_DATA: {
    GET_CALENDAR_DATA_BY_DATE: "get-calendar-data-by-date"
  }
} as const;

type QueryKeyValues<T> =
  T extends Record<string, infer U>
    ? U extends string
      ? U
      : QueryKeyValues<U>
    : never;

export type ConstQueryKeys = QueryKeyValues<typeof QUERY_KEYS>;
