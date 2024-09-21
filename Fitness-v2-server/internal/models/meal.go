package models

import (
	"time"

	"github.com/google/uuid"
)

type Meal struct {
	ID          uuid.UUID `json:"id"`
	Name        string    `json:"name"`
	Description *string   `json:"description,omitempty"`
	ImageUrl    *string   `json:"image_url,omitempty"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
	UserID      uuid.UUID `json:"-"`
}

type MealWithNutrition struct {
	Meal          `json:"meal"`
	TotalCalories float64 `json:"total_calories"`
	TotalFat      float64 `json:"total_fat"`
	TotalProtein  float64 `json:"total_protein"`
	TotalCarbs    float64 `json:"total_carbs"`
}

type FoodItemIdAmount struct {
	FoodItemID uuid.UUID `json:"food_item_id"`
	Amount     int       `json:"amount"`
}

type MealWithNutritionWithPages struct {
	Meals      []MealWithNutrition `json:"meals"`
	TotalPages int64               `json:"total_pages"`
}

type MealWithNutritionAndFoodItems struct {
	Meal      MealWithNutrition    `json:"meal"`
	FoodItems []FoodItemWithAmount `json:"food_items"`
}
