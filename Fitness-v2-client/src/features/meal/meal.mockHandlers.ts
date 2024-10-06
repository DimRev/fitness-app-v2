import { http, HttpResponse } from "msw";
import { type CreateMealRequestBody } from "./hooks/useCreateMeal";
import { type UpdateMealRequestBody } from "./hooks/useUpdateMeal";

const MEALS: Meal[] = [
  {
    id: "1",
    name: "test meal 1",
    description: "test description 1",
    image_url: undefined,
    created_at: "2024-01-01T00:00:00.000Z",
    updated_at: "2024-01-01T00:00:00.000Z",
  },
  {
    id: "2",
    name: "test meal 2",
    description: "test description 2",
    image_url: undefined,
    created_at: "2024-01-02T00:00:00.000Z",
    updated_at: "2024-01-02T00:00:00.000Z",
  },
  {
    id: "3",
    name: "test meal 3",
    description: "test description 3",
    image_url: undefined,
    created_at: "2024-01-03T00:00:00.000Z",
    updated_at: "2024-01-03T00:00:00.000Z",
  },
  {
    id: "4",
    name: "test meal 4",
    description: "test description 4",
    image_url: undefined,
    created_at: "2024-01-04T00:00:00.000Z",
    updated_at: "2024-01-04T00:00:00.000Z",
  },
];

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "test food item 1",
    description: "test description 1",
    image_url: undefined,
    food_type: "protein",
    calories: "1000",
    fat: "1000",
    protein: "1000",
    carbs: "1000",
  },
  {
    id: "2",
    name: "test food item 2",
    description: "test description 2",
    image_url: undefined,
    food_type: "protein",
    calories: "2000",
    fat: "2000",
    protein: "2000",
    carbs: "2000",
  },
  {
    id: "3",
    name: "test food item 3",
    description: "test description 3",
    image_url: undefined,
    food_type: "protein",
    calories: "3000",
    fat: "3000",
    protein: "3000",
    carbs: "3000",
  },
  {
    id: "4",
    name: "test food item 4",
    description: "test description 4",
    image_url: undefined,
    food_type: "protein",
    calories: "4000",
    fat: "4000",
    protein: "4000",
    carbs: "4000",
  },
];

const MEAL_FOOD_ITEM_REL = [
  {
    meal_id: "1",
    food_item_id: "1",
    amount: 1,
  },
  {
    meal_id: "2",
    food_item_id: "2",
    amount: 1,
  },
  {
    meal_id: "3",
    food_item_id: "3",
    amount: 1,
  },
  {
    meal_id: "4",
    food_item_id: "4",
    amount: 1,
  },
];

export const mealMockHandlers = [
  http.get("*/meals", async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const limit = Number(searchParams.get("limit"));
    const offset = Number(searchParams.get("offset"));
    const text_filter = searchParams.get("text_filter");

    const filteredMeals = MEALS.filter((meal, idx) => {
      let isTextFiltered = true;
      let isLimitFiltered = true;

      const newLimit = limit + offset;

      if (newLimit === 0) {
        return false;
      }

      if (text_filter) {
        isTextFiltered = meal.name
          .toLowerCase()
          .includes(text_filter.toLowerCase());
      }

      if (idx > newLimit) {
        isLimitFiltered = false;
      }

      return isTextFiltered && isLimitFiltered;
    });

    const mealsWithNutrition: MealWithNutrition[] = filteredMeals.map(
      (meal) => {
        const foodItems = MEAL_FOOD_ITEM_REL.filter(
          (rel) => rel.meal_id === meal.id,
        ).map((mfi) => {
          const foodItem = FOOD_ITEMS.find((fi) => fi.id === mfi.food_item_id)!;
          return {
            ...foodItem,
            amount: mfi.amount,
          };
        });

        const totalNutrition = foodItems.reduce(
          (acc, cfi) => {
            return {
              total_calories:
                acc.total_calories + Number(cfi.calories) * cfi.amount,
              total_fat: acc.total_fat + Number(cfi.fat) * cfi.amount,
              total_protein:
                acc.total_protein + Number(cfi.protein) * cfi.amount,
              total_carbs: acc.total_carbs + Number(cfi.carbs) * cfi.amount,
            };
          },
          {
            total_calories: 0,
            total_fat: 0,
            total_protein: 0,
            total_carbs: 0,
          },
        );

        return {
          meal: meal,
          total_calories: totalNutrition.total_calories,
          total_fat: totalNutrition.total_fat,
          total_protein: totalNutrition.total_protein,
          total_carbs: totalNutrition.total_carbs,
        };
      },
    );

    const filterMealsForPages = MEALS.filter((meal) => {
      if (text_filter) {
        return meal.name.toLowerCase().includes(text_filter.toLowerCase());
      }
      return true;
    });

    return HttpResponse.json<MealWithNutritionWithPages>(
      {
        meals: mealsWithNutrition,
        total_pages:
          limit === 0 || mealsWithNutrition.length === 0
            ? 1
            : Math.ceil(filterMealsForPages.length / limit),
      },
      {
        status: 200,
      },
    );
  }),

  http.post("*/meals", async ({ request }) => {
    const requestBody = (await request.json()) as CreateMealRequestBody;

    const foodItems: FoodItem[] = requestBody.food_items.map((fi) => {
      const foodItem = FOOD_ITEMS.find((f) => f.id === fi.food_item_id)!;

      return {
        ...foodItem,
      };
    });

    return HttpResponse.json<MealWithFoodItems>({
      meal: {
        id: "5",
        name: requestBody.name,
        description: requestBody.description ?? undefined,
        image_url: requestBody.image_url ?? undefined,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      food_items: foodItems,
    });
  }),

  http.get("*/meals/:meal_id", async ({ params }) => {
    const { meal_id } = params;
    const meal = MEALS.find((m) => m.id === meal_id);
    if (!meal) {
      return HttpResponse.json(
        { message: "Failed to get meal, meal not found" },
        { status: 404 },
      );
    }

    const foodItemRels = MEAL_FOOD_ITEM_REL.filter(
      (rel) => rel.meal_id === meal_id,
    );

    const foodItems = foodItemRels.map((fi) => {
      const foodItem = FOOD_ITEMS.find((f) => f.id === fi.food_item_id)!;

      return {
        ...foodItem,
        amount: fi.amount,
      };
    });

    const totalNutrition = foodItems.reduce(
      (acc, cfi) => {
        return {
          total_calories:
            acc.total_calories + Number(cfi.amount) * Number(cfi.calories),
          total_fat: acc.total_fat + Number(cfi.amount) * Number(cfi.fat),
          total_protein:
            acc.total_protein + Number(cfi.amount) * Number(cfi.protein),
          total_carbs: acc.total_carbs + Number(cfi.amount) * Number(cfi.carbs),
        };
      },
      {
        total_calories: 0,
        total_fat: 0,
        total_protein: 0,
        total_carbs: 0,
      },
    );

    const mealWithNutrition: MealWithNutrition = {
      meal: meal,
      total_calories: totalNutrition.total_calories,
      total_fat: totalNutrition.total_fat,
      total_protein: totalNutrition.total_protein,
      total_carbs: totalNutrition.total_carbs,
    };

    return HttpResponse.json<MealWithNutritionAndFoodItems>({
      meal: mealWithNutrition,
      food_items: foodItems.map((fi) => {
        return {
          amount: fi.amount,
          food_item: {
            id: fi.id,
            name: fi.name,
            description: fi.description,
            image_url: fi.image_url,
            food_type: fi.food_type,
            calories: fi.calories,
            fat: fi.fat,
            protein: fi.protein,
            carbs: fi.carbs,
          },
        };
      }),
    });
  }),

  http.put("*/meals/:meal_id", async ({ params, request }) => {
    const { meal_id } = params;

    const meal = MEALS.find((m) => m.id === meal_id);
    if (!meal) {
      return HttpResponse.json(
        { message: "Failed to update meal, meal not found" },
        { status: 404 },
      );
    }
    const requestBody = (await request.json()) as UpdateMealRequestBody;
    const foodItemsWithAmount = requestBody.food_items.map((fi) => {
      const foodItem = FOOD_ITEMS.find((f) => f.id === fi.food_item_id)!;

      return { foodItem: foodItem, amount: fi.amount };
    });

    if (!foodItemsWithAmount.every(({ foodItem }) => foodItem)) {
      return HttpResponse.json(
        { message: "Failed to update meal, food item not found" },
        { status: 404 },
      );
    }

    const updatedMeal: Meal = {
      id: meal.id,
      name: requestBody.name,
      description: requestBody.description ?? undefined,
      image_url: requestBody.image_url ?? undefined,
      created_at: meal.created_at,
      updated_at: new Date().toISOString().split("T")[0] + "T00:00:00.000Z",
    };

    const foodItems = foodItemsWithAmount.map(({ foodItem }) => {
      return foodItem;
    });

    return HttpResponse.json<MealWithFoodItems>({
      meal: updatedMeal,
      food_items: foodItems,
    });
  }),

  http.delete("*/meals/:meal_id", async ({ params }) => {
    const { meal_id } = params;

    const meal = MEALS.find((m) => m.id === meal_id);
    if (!meal) {
      return HttpResponse.json(
        { message: "Failed to delete meal, meal not found" },
        { status: 404 },
      );
    }

    const mealFoodItemRel = MEAL_FOOD_ITEM_REL.filter(
      (rel) => rel.meal_id === meal_id,
    );

    const foodItemsWithAmount = mealFoodItemRel.map((fi) => {
      const foodItem = FOOD_ITEMS.find((f) => f.id === fi.food_item_id)!;

      return { foodItem: foodItem, amount: fi.amount };
    });

    if (!foodItemsWithAmount.every(({ foodItem }) => foodItem)) {
      return HttpResponse.json(
        { message: "Failed to delete meal, food item not found" },
        { status: 404 },
      );
    }

    const foodItems = foodItemsWithAmount.map(({ foodItem }) => {
      return foodItem;
    });

    return HttpResponse.json<MealWithFoodItems>({
      meal: meal,
      food_items: foodItems,
    });
  }),
];
