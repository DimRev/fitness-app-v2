package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func FoodItemRoutesV1(e *echo.Group) {
	foodItem := e.Group("/food_items", middleware.ProtectedRoute)
	{
		foodItem.GET("", controllers.GetFoodItems)
	}
}
