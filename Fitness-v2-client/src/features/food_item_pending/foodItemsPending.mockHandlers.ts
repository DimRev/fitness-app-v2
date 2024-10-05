import { http, HttpResponse } from "msw";
import { FoodItemFormSchema } from "../food_item/foodItem.schema";

const FOOD_ITEMS_PENDING: FoodItemsPending[] = [
  {
    id: "1",
    name: "test food item pending 1",
    description: "test description 1",
    image_url: undefined,
    food_type: "protein",
    calories: "1000",
    fat: "1000",
    protein: "1000",
    carbs: "1000",
    likes: 1,
    liked: true,
    author_name: "one",
  },
  {
    id: "2",
    name: "test food item pending 2",
    description: "test description 2",
    image_url: undefined,
    food_type: "protein",
    calories: "2000",
    fat: "2000",
    protein: "2000",
    carbs: "2000",
    likes: 2,
    liked: true,
    author_name: "two",
  },
  {
    id: "3",
    name: "test food item pending 3",
    description: "test description 3",
    image_url: undefined,
    food_type: "protein",
    calories: "3000",
    fat: "3000",
    protein: "3000",
    carbs: "3000",
    likes: 3,
    liked: false,
    author_name: "three",
  },
  {
    id: "4",
    name: "test food item pending 4",
    description: "test description 4",
    image_url: undefined,
    food_type: "protein",
    calories: "4000",
    fat: "4000",
    protein: "4000",
    carbs: "4000",
    likes: 4,
    liked: false,
    author_name: "four",
  },
];

export const foodItemsPendingHandlers = [
  http.get("*/food_items_pending", async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const limit = Number(searchParams.get("limit"));
    const offset = Number(searchParams.get("offset"));
    const text_filter = searchParams.get("text_filter");

    const filteredFoodItemsPending = FOOD_ITEMS_PENDING.filter((item, idx) => {
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

    const foodItemsPendingWithPages: FoodItemsPendingWithPages = {
      food_items_pending: filteredFoodItemsPending,
      total_pages:
        limit === 0 || filteredFoodItemsPending.length === 0
          ? 1
          : Math.ceil(filteredFoodItemsPending.length / limit),
    };

    return HttpResponse.json(foodItemsPendingWithPages, { status: 200 });
  }),
  http.post("*/food_items_pending", async ({ request }) => {
    const requestBody = (await request.json()) as FoodItemFormSchema;

    return HttpResponse.json({
      id: "5",
      name: requestBody.name,
      description: requestBody.description,
      image_url: requestBody.image_url ?? undefined,
      food_type: requestBody.food_type,
      calories: requestBody.calories,
      fat: requestBody.fat,
      protein: requestBody.protein,
      carbs: requestBody.carbs,
      likes: 0,
      liked: false,
      author_name: "test",
    });
  }),
  http.post(
    "*/food_items_pending/approve/:food_item_pending_id",
    async ({ params }) => {
      const { food_item_pending_id } = params;

      const foodItemPending = FOOD_ITEMS_PENDING.find(
        (item) => item.id === food_item_pending_id,
      );

      if (foodItemPending) {
        return HttpResponse.json({
          message: "Food item pending approved",
        });
      }

      return HttpResponse.json(
        {
          message:
            "Failed to approve food item pending, food item pending not found",
        },
        { status: 404 },
      );
    },
  ),
  http.post(
    "*/food_items_pending/reject/:food_item_pending_id",
    async ({ params }) => {
      const { food_item_pending_id } = params;

      const foodItemPending = FOOD_ITEMS_PENDING.find(
        (item) => item.id === food_item_pending_id,
      );

      if (foodItemPending) {
        return HttpResponse.json({
          message: "Food item pending rejected",
        });
      }

      return HttpResponse.json(
        {
          message:
            "Failed to reject food item pending, food item pending not found",
        },
        { status: 404 },
      );
    },
  ),
  http.post(
    "*/food_items_pending/toggle/:food_item_pending_id",
    async ({ params }) => {
      const { food_item_pending_id } = params;

      const foodItemPending = FOOD_ITEMS_PENDING.find(
        (item) => item.id === food_item_pending_id,
      );

      if (foodItemPending) {
        if (foodItemPending.liked) {
          return HttpResponse.json({
            message: "Food item pending unliked",
          });
        } else {
          return HttpResponse.json({
            message: "Food item pending liked",
          });
        }
      }

      return HttpResponse.json(
        {
          message:
            "Failed to like food item pending, food item pending not found",
        },
        { status: 404 },
      );
    },
  ),
];
