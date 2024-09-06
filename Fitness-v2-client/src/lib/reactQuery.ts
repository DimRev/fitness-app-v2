import { type UseQueryOptions, type UseMutationOptions } from "react-query";

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
  MEALS: {
    GET_MEALS_BY_USER_ID: "getMealsByUserID",
  },
  FOOD_ITEMS: {
    GET_FOOD_ITEMS: "getFoodItems",
  },
  FOOD_ITEMS_PENDING: {
    GET_FOOD_ITEMS_PENDING: "getFoodItemsPending",
  },
} as const;
