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
    GET_MEALS_BY_USER_ID: "getMealsByUserID",
    GET_MEAL_BY_ID: "getMealByID",
  },
  MEALS_CONSUMED: {
    GET_MEALS_CONSUMED_BY_MEAL_ID: "getMealsConsumedByMealID",
    GET_MEALS_CONSUMED_BY_DATE: "getMealsConsumedByDate",
  },
  FOOD_ITEMS: {
    GET_FOOD_ITEMS_INF_QUERY: "getFoodItemsInfiniteQuery",
    GET_FOOD_ITEMS: "getFoodItems",
    GET_FOOD_ITEMS_BY_USER_ID: "getFoodItemsByUserID",
  },
  FOOD_ITEMS_PENDING: {
    GET_FOOD_ITEMS_PENDING: "getFoodItemsPending",
  },
  NOTIFICATION: {
    GET_NEW_USER_NOTIFICATIONS: "getNewUserNotifications",
  },
} as const;

type QueryKeyValues<T> =
  T extends Record<string, infer U>
    ? U extends string
      ? U
      : QueryKeyValues<U>
    : never;

export type ConstQueryKeys = QueryKeyValues<typeof QUERY_KEYS>;
