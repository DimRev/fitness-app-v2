package models

import "time"

type MealsConsumedChartData struct {
	Date          time.Time `json:"date"`
	TotalCalories float64   `json:"total_calories"`
	TotalFat      float64   `json:"total_fat"`
	TotalProtein  float64   `json:"total_protein"`
	TotalCarbs    float64   `json:"total_carbs"`
}
