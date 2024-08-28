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
	ID            uuid.UUID      `json:"id"`
	Name          string         `json:"name"`
	Description   sql.NullString `json:"description"`
	ImageUrl      sql.NullString `json:"image_url"`
	CreatedAt     sql.NullTime   `json:"created_at"`
	UpdatedAt     sql.NullTime   `json:"updated_at"`
	UserID        uuid.UUID      `json:"-"`
	TotalCalories int            `json:"total_calories"`
	TotalFat      int            `json:"total_fat"`
	TotalProtein  int            `json:"total_protein"`
	TotalCarbs    int            `json:"total_carbs"`
}
