type FoodItem = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  food_type: FoodItemType;
  calories: string;
  fat: string;
  protein: string;
  carbs: string;
};

type FoodItemType = "vegetable" | "fruit" | "grain" | "protein" | "dairy";

type FoodItemWithPages = {
  food_items: FoodItem[];
  total_pages: number;
  total_items: number;
};
