package models

type CalendarData struct {
	Name          []string `json:"name"`
	TotalCalories float64  `json:"total_calories"`
	TotalFat      float64  `json:"total_fat"`
	TotalProtein  float64  `json:"total_protein"`
	TotalCarbs    float64  `json:"total_carbs"`
}
