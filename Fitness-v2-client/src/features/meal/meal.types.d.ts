type Meal = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
};

type MealWithNutrition = {
  meal: Meal;
  total_calories: number;
  total_fat: number;
  total_protein: number;
  total_carbs: number;
};

type MealWithNutritionWithPages = {
  meals: MealWithNutrition[];
  total_pages: number;
};

type MealWithFoodItems = {
  meal: Meal;
  food_items: FoodItem[];
};

type MealWithNutritionAndFoodItems = {
  meal: MealWithNutrition;
  food_items: { food_item: FoodItem; amount: number }[];
};
