package models

import (
	"database/sql"

	"github.com/google/uuid"
)

type Meal struct {
	ID          uuid.UUID      `json:"id"`
	Name        string         `json:"name"`
	Description sql.NullString `json:"description"`
	ImageUrl    sql.NullString `json:"image_url"`
	CreatedAt   sql.NullTime   `json:"created_at"`
	UpdatedAt   sql.NullTime   `json:"updated_at"`
	UserID      uuid.UUID      `json:"-"`
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

type MealWithFoodItemIds struct {
	Meal             `json:"meal"`
	FoodItemIdAmount `json:"food_items"`
}

type MealWithFoodItems struct {
	Meal      `json:"meal"`
	FoodItems []FoodItem `json:"food_items"`
}
