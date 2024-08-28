package models

import (
	"database/sql"

	"github.com/google/uuid"
)

type FoodItemType string

const (
	FoodItemTypeVegetable FoodItemType = "vegetable"
	FoodItemTypeFruit     FoodItemType = "fruit"
	FoodItemTypeGrain     FoodItemType = "grain"
	FoodItemTypeProtein   FoodItemType = "protein"
)

type FoodItem struct {
	ID          uuid.UUID
	Name        string
	Description sql.NullString
	ImageUrl    sql.NullString
	FoodType    FoodItemType
	Calories    string
	Fat         string
	Protein     string
	Carbs       string
	CreatedAt   sql.NullTime
	UpdatedAt   sql.NullTime
}
