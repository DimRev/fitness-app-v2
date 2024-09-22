package models

import "time"

type ConsumedMeal struct {
	UserID    string    `json:"user_id"`
	MealID    string    `json:"meal_id"`
	Date      time.Time `json:"date"`
	CreatedAt time.Time `json:"created_at"`
	UpdatedAt time.Time `json:"updated_at"`
}
