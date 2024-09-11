type FoodItemsPending = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  food_type: FoodItemType;
  calories: string;
  fat: string;
  protein: string;
  carbs: string;
  likes: number;
  liked: boolean;
  author_name: string;
};

type FoodItemsPendingWithPages = {
  food_items_pending: FoodItemsPending[];
  total_pages: number;
};
