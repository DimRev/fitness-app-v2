import { http, HttpResponse } from "msw";
import { type FoodItemFormSchema } from "./foodItem.schema";

const FOOD_ITEMS: FoodItem[] = [
  {
    id: "1",
    name: "test food item 1",
    calories: "1000",
    carbs: "1000",
    fat: "1000",
    protein: "1000",
    food_type: "protein",
    description: "test description 1",
    image_url: undefined,
  },
  {
    id: "2",
    name: "test food item 2",
    calories: "2000",
    carbs: "2000",
    fat: "2000",
    protein: "2000",
    food_type: "protein",
    description: "test description 2",
    image_url: undefined,
  },
  {
    id: "3",
    name: "test food item 3",
    calories: "3000",
    carbs: "3000",
    fat: "3000",
    protein: "3000",
    food_type: "protein",
    description: "test description 3",
    image_url: undefined,
  },
  {
    id: "4",
    name: "test food item 4",
    calories: "4000",
    carbs: "4000",
    fat: "4000",
    protein: "4000",
    food_type: "protein",
    description: "test description 4",
    image_url: undefined,
  },
];

export const foodItemHandlers = [
  http.get("*/food_items", async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const limit = Number(searchParams.get("limit"));
    const offset = Number(searchParams.get("offset"));
    const text_filter = searchParams.get("text_filter");

    const filteredFoodItems = FOOD_ITEMS.filter((item, idx) => {
      let isTextFiltered = true;
      let isLimitFiltered = true;

      const newLimit = limit + offset;

      if (newLimit === 0) {
        return false;
      }

      if (text_filter) {
        isTextFiltered = item.name
          .toLowerCase()
          .includes(text_filter.toLowerCase());
      }
      if (idx > newLimit) {
        isLimitFiltered = false;
      }

      return isTextFiltered && isLimitFiltered;
    });

    const foodItemWithPages: FoodItemWithPages = {
      food_items: filteredFoodItems,
      total_pages:
        limit === 0 || filteredFoodItems.length === 0
          ? 1
          : Math.ceil(filteredFoodItems.length / limit),
      total_items: filteredFoodItems.length,
    };
    return HttpResponse.json(foodItemWithPages, { status: 200 });
  }),
  http.get("*/food_items/:food_item_id", async ({ params }) => {
    const { food_item_id } = params;

    const food_item = FOOD_ITEMS.find((item) => item.id === food_item_id);

    if (food_item) {
      return HttpResponse.json(food_item, { status: 200 });
    }

    return HttpResponse.json(
      { message: "Failed fetch food item, food item not found" },
      { status: 404 },
    );
  }),
  http.put("*/food_items/:food_item_id", async ({ params, request }) => {
    const { food_item_id } = params;
    const requestBody = (await request.json()) as FoodItemFormSchema;

    const food_item = FOOD_ITEMS.find((item) => item.id === food_item_id);

    if (food_item) {
      return HttpResponse.json(
        {
          ...food_item,
          name: requestBody.name,
          calories: requestBody.calories,
          carbs: requestBody.carbs,
          fat: requestBody.fat,
          protein: requestBody.protein,
          food_type: requestBody.food_type,
          description: requestBody.description,
          image_url: requestBody.image_url ?? undefined,
        },
        { status: 200 },
      );
    }

    return HttpResponse.json(
      { message: "Failed update food item, food item not found" },
      { status: 404 },
    );
  }),
  http.delete("*/food_items/:food_item_id", async ({ params }) => {
    const { food_item_id } = params;
    const food_item = FOOD_ITEMS.find((item) => item.id === food_item_id);

    if (food_item) {
      return HttpResponse.json(
        { message: "Successfully deleted food item" },
        {
          status: 200,
        },
      );
    }

    return HttpResponse.json(
      { message: "Failed to delete food item, food item not found" },
      { status: 404 },
    );
  }),
];
