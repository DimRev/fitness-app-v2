package models

import (
	"time"

	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/google/uuid"
)

type FoodItem struct {
	ID          uuid.UUID             `json:"id"`
	Name        string                `json:"name"`
	Description *string               `json:"description,omitempty"`
	ImageUrl    *string               `json:"image_url,omitempty"`
	FoodType    database.FoodItemType `json:"food_type"`
	Calories    string                `json:"calories"`
	Fat         string                `json:"fat"`
	Protein     string                `json:"protein"`
	Carbs       string                `json:"carbs"`
	CreatedAt   time.Time             `json:"-"`
	UpdatedAt   time.Time             `json:"-"`
}

type FoodItemsWithPages struct {
	FoodItemsPending []FoodItem `json:"food_items"`
	TotalPages       int64      `json:"total_pages"`
	TotalItems       int64      `json:"total_items"`
}

type FoodItemWithAmount struct {
	FoodItem FoodItem `json:"food_item"`
	Amount   int      `json:"amount"`
}
