package routes

import (
	"github.com/DimRev/Fitness-v2-server/internal/controllers"
	"github.com/DimRev/Fitness-v2-server/internal/database"
	"github.com/DimRev/Fitness-v2-server/internal/middleware"
	"github.com/labstack/echo"
)

func FoodItemPendingRoutesV1(e *echo.Group) {

	foodItem := e.Group("/food_items_pending", middleware.ProtectedRoute)
	{
		foodItem.GET("", controllers.GetFoodItemsPending)
		foodItem.GET("/user", controllers.GetFoodItemsPendingByUserID)
		foodItem.POST("", controllers.CreateFoodItemPending)
		foodItem.POST("/toggle/:food_item_pending_id", controllers.ToggleFoodItemPending)
		foodItem.POST("/approve/:food_item_pending_id",
			middleware.ProtectedRouteWithRoles(
				controllers.ApproveFoodItemPending,
				[]database.UserRole{database.UserRoleAdmin},
			))
		foodItem.POST("/reject/:food_item_pending_id",
			middleware.ProtectedRouteWithRoles(
				controllers.RejectFoodItemPending,
				[]database.UserRole{database.UserRoleAdmin},
			))
	}
}
