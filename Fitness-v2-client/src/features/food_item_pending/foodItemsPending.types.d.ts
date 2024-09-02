// type FoodItemsPending struct {
// 	ID          uuid.UUID             `json:"id"`
// 	Name        string                `json:"name"`
// 	Description *string               `json:"description"`
// 	ImageUrl    *string               `json:"image_url"`
// 	FoodType    database.FoodItemType `json:"food_type"`
// 	Calories    string                `json:"calories"`
// 	Fat         string                `json:"fat"`
// 	Protein     string                `json:"protein"`
// 	Carbs       string                `json:"carbs"`
// 	CreatedAt   time.Time             `json:"-"`
// 	UpdatedAt   time.Time             `json:"-"`
// 	UserID      uuid.UUID             `json:"-"`
// 	Likes       int64                 `json:"likes"`
// 	Liked       bool                  `json:"liked"`
// 	Author      string                `json:"author_name"`
// }

type FoodItemsPending = {
  id: string;
  name: string;
  description?: string;
  image_url?: string;
  food_type: string;
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
