/*
  ID          uuid.UUID             `json:"id"`
	Name        string                `json:"name"`
	Description *string               `json:"description"`
	ImageUrl    *string               `json:"image_url"`
	FoodType    database.FoodItemType `json:"food_type"`
	Calories    string                `json:"calories"`
	Fat         string                `json:"fat"`
	Protein     string                `json:"protein"`
	Carbs       string                `json:"carbs"`
*/

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

type FoodItemType = "vegetable" | "fruit" | "grain" | "protein";

type FoodItemWithPages = {
  food_items: FoodItem[];
  total_pages: number;
};
