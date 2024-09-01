package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func FoodItemPendingRoutesV1(e *echo.Group) {
	foodItem := e.Group("/food_items_pending", middleware.ProtectedRoute)
	{
		foodItem.GET("", controllers.GetFoodItemsPending)
		foodItem.GET("/user", controllers.GetFoodItemsPendingByUserID)
		foodItem.POST("", controllers.CreateFoodItemPending)
	}
}
