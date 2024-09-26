package models

type CalendarData struct {
	Meals []struct {
		Name   string `json:"name"`
		MealID string `json:"meal_id"`
	} `json:"meals"`
	TotalCalories float64 `json:"total_calories"`
	TotalFat      float64 `json:"total_fat"`
	TotalProtein  float64 `json:"total_protein"`
	TotalCarbs    float64 `json:"total_carbs"`
}
