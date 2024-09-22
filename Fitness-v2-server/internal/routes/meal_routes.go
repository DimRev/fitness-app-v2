package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func MealRoutesV1(e *echo.Group) {

	meal := e.Group("/meals", middleware.ProtectedRoute)
	{
		meal.POST("", controllers.CreateMeal)
		meal.GET("", controllers.GetMealsByUserID)
		meal.GET("/:meal_id", controllers.GetMealByID)
		meal.PUT("/:meal_id", controllers.UpdateMeal)

		meal.GET("/consume/date", controllers.GetConsumedMealsByDate)
		meal.POST("/consume/toggle", controllers.ToggleConsumeMeal)
		meal.GET("/consume/:meal_id", controllers.GetConsumedMealsByMealID)
	}
}
