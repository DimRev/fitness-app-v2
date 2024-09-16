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

		meal.POST("/consume/:meal_id", controllers.ConsumeMeal)
		meal.GET("/consumed/date", controllers.GetConsumedMealsByDate)
		meal.GET("/consumed/:meal_id", controllers.GetConsumedMealsByMealID)
		meal.DELETE("/consumed/:meal_id", controllers.RemoveConsumedMeal)
	}
}
